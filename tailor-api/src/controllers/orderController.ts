import { Request, Response } from "express";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Measurement from "../models/Measurement";
import { generateOrderNumber } from "../utils/generateOrderNumber";

export const createOrder = async (req: Request, res: Response) => {
  try {

    const {
      customerId,
      outfits,   
      advanceGiven = 0,
      notes,
       
    } = req.body;

    if (!customerId)
      return res.status(400).json({ message: "customerId is required" });

    if (!outfits || outfits.length === 0)
      return res.status(400).json({ message: "At least one outfit is required" });

    const createdItemIds: any[] = [];
    let totalAmount = 0;


const LIMIT = 15;
const forceDeliveryDate = req.body.forceDeliveryDate === true;

const deliveryDates: string[] = outfits
  .map((o: any) => o.deliveryDate)
  .filter(Boolean)
  .map((d: string | Date) =>
    typeof d === "string" ? d : d.toISOString()
  );

const uniqueDeliveryDates = [...new Set(deliveryDates)];


for (const date of uniqueDeliveryDates) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const ordersCount = await OrderItem.countDocuments({
    deliveryDate: { $gte: start, $lte: end },
  });

  if (ordersCount >= LIMIT && !forceDeliveryDate) {
    return res.status(409).json({
      message: "Delivery date limit exceeded",
      deliveryDate: date,
      totalOrders: ordersCount,
      limit: LIMIT,
    });
  }
}



    for (const item of outfits) {

      // Create OrderItem
      const orderItem = await OrderItem.create({
        name: item.name,
        category: item.category,
        quantity: item.quantity || 1,
        type: item.type || "stitching",
        inspirationLink: item.inspirationLink || "",
        audioUrl: item.audioUrl || "",
        specialInstructions: item.specialInstructions || "",
        referenceImages: item.referenceImages || [],
        measurements: item.measurements || null,
        stitchOptions: item.stitchOptions || {},
        stitchingPrice: item.stitchingPrice || 0,
        additionalPrice: item.additionalPrice || 0,
        trialDate: item.trialDate ? new Date(item.trialDate) : null,
        deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : null,
      });

      createdItemIds.push(orderItem._id);

      // Calculate total pricing
      totalAmount +=
        (orderItem.stitchingPrice || 0) * (orderItem.quantity || 1) +
        (orderItem.additionalPrice || 0);
    }
    const orderNumber = await generateOrderNumber();

    const balanceDue = totalAmount - (advanceGiven || 0);

    const order = await Order.create({
      orderNumber,
      customer: customerId,
      items: createdItemIds,
      totalAmount,
      advanceGiven,
      balanceDue,
      notes,
      status: req.body.status || "active",
    });
    

    return res.status(201).json({
      message: "Order created",
      orderId: order._id,
      orderNumber: order.orderNumber,
    });

  } catch (err: any) {
    console.error("❌ ORDER CREATION ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


// Get All Orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    console.log("Fetching all orders...")
    const orders = await Order.find()
      .populate("customer")
      .populate({
        path: "items",
        model: "OrderItem"
      });
    return res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


// update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const allowed = [
      "draft",
      "active",
      "past_due",
      "upcoming",
      "pending_payment",
      "delivered",
      "cancelled"
    ];

    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    return res.json({ message: "Status updated", order });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


// Get Order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
        .populate({
    path: "items",
    populate: {
      path: "measurements",
      model: "Measurement",
    },
  });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({ order });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const receivePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // ❗ totalAmount NEVER changes here

    const currentAdvance = order.advanceGiven || 0;
    const newAdvance = currentAdvance + amount;

    order.advanceGiven = newAdvance;

    order.balanceDue = Math.max(
      order.totalAmount - newAdvance,
      0
    );

    await order.save();

    return res.json({
      message: "Payment received successfully",
      order,
    });
  } catch (err) {
    console.error("RECEIVE PAYMENT ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};



export const addExtraCharge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, amount } = req.body;

    if (!reason || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid charge data" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Add charge
    order.additionalCharges = order.additionalCharges || [];
    order.additionalCharges.push({
      reason,
      amount,
      createdAt: new Date(),
    });

    // Update totals
    order.totalAmount = (order.totalAmount || 0) + amount;
    order.balanceDue = (order.balanceDue || 0) + amount;

    await order.save();

    res.json({
      message: "Additional charge added",
      order,
    });
  } catch (err) {
    console.error("ADD CHARGE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};





// update outfit status
// export const updateOutfitStatus = async (req: Request, res: Response) => {
//   try {

//     const { itemId } = req.params;

//     const { status } = req.body;

//     const item = await OrderItem.findById(itemId);

//     if (!item) {

//       return res.status(404).json({ message: "Order item not found" });

//     }

//     item.status = status;

//     await item.save();

//     return res.json({

//       success: true,

//       message: "Outfit status updated",

//       item,
//     });

//   } catch (err: any) {

//     return res.status(500).json({ message: err.message });

//   }
// };
// update outfit status
export const updateOutfitStatus = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    // Update OrderItem status
    const item = await OrderItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Order item not found" });

    item.status = status;
    await item.save();

    // Find the parent order (item._id is inside order.items array)
    const order = await Order.findOne({ items: itemId }).populate("items");
    console.log(order,"📦parent order")
    if (!order) return res.status(404).json({ message: "Parent order not found" });

    // ✔ Check if all items have status = completed
    const allCompleted = order.items.every((i: any) => i.status === "completed");
    console.log(allCompleted,"✅ all outfits completed?")

    if (allCompleted) {
      order.status = "delivered";
      await order.save();
    }

    return res.json({
      success: true,
      message: "Outfit status updated",
      item,
      orderUpdated: allCompleted ? "Order marked as delivered" : "No change",
    });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getOrdersCountByDate = async (req: Request, res: Response) => {
  try {
    console.log("Fetching order count by date...", req.query);

    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "Valid date is required" });
    }

    const parsedDate = new Date(`${date}T00:00:00`);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const start = new Date(parsedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsedDate);
    end.setHours(23, 59, 59, 999);

    const count = await OrderItem.countDocuments({
      deliveryDate: {
        $ne: null,    
        $gte: start,
        $lte: end,
      },
    });

    const LIMIT = 15;

    return res.json({
      date,
      totalOrders: count,
      limit: LIMIT,
      exceeded: count >= LIMIT,
    });

  } catch (error: any) {
    console.error("❌ count-by-date ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};







