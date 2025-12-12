import { Request, Response } from "express";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Measurement from "../models/Measurement";
import { generateOrderNumber } from "../utils/generateOrderNumber";

export const createOrder = async (req: Request, res: Response) => {
  try {

    const {
      customerId,
      outfits,                 // array of outfitObjects (each converted to OrderItem)
      trialDate,
      deliveryDate,
      advanceGiven = 0,
      notes,
    } = req.body;

    if (!customerId)
      return res.status(400).json({ message: "customerId is required" });

    if (!outfits || outfits.length === 0)
      return res.status(400).json({ message: "At least one outfit is required" });

    // -------------------------------------------
    // 1️⃣ CREATE ORDER ITEMS
    // -------------------------------------------
    const createdItemIds: any[] = [];
    let totalAmount = 0;

    for (const item of outfits) {
      // item = {name, type, specialInstructions, referenceImages[], audioUrl, inspirationLink ...}

      // Save measurements if present
      let measurementDoc = null;
      if (item.measurements && Object.keys(item.measurements).length > 0) {
        measurementDoc = await Measurement.create(item.measurements);
      }

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
        measurements: measurementDoc?._id || null,
        stitchOptions: item.stitchOptions || {},
        stitchingPrice: item.stitchingPrice || 0,
        additionalPrice: item.additionalPrice || 0,
      });

      createdItemIds.push(orderItem._id);

      // Calculate total pricing
      totalAmount +=
        (orderItem.stitchingPrice || 0) * (orderItem.quantity || 1) +
        (orderItem.additionalPrice || 0);
    }

    // -------------------------------------------
    // 2️⃣ CREATE ORDER RECORD
    // -------------------------------------------
    const orderNumber = await generateOrderNumber();

    const balanceDue = totalAmount - (advanceGiven || 0);

    const order = await Order.create({
      orderNumber,
      customer: customerId,
      items: createdItemIds,
      trialDate,
      deliveryDate,
      totalAmount,
      advanceGiven,
      balanceDue,
      notes,
      status: "active",
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
      .populate("items");

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

    const body = await req.body();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return res.json(
        { error: "Invalid amount" },
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.json(
        { error: "Order not found" },
      );
    }

    order.advanceGiven = (order.advanceGiven || 0) + amount;

    order.balanceDue = order.totalAmount - order.advanceGiven;

    if (order.balanceDue < 0) {
      order.balanceDue = 0;
    }

    await order.save();

    return res.json({
      message: "Payment updated",
      order,
    });
  }catch (err: any) {
    console.log("PAYMENT UPDATE ERROR:", err);
    return res.json(
      { error: "Server error" }
    );
  }
}


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




