import { Request, Response } from "express";
import Order from "../models/Order";
import Customer from "../models/Customer";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;

    const today = new Date();

    // Orders for boutique
    const orders = await Order.find({
      boutique: boutiqueId,
      isArchived: false,
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const upcomingOrders = orders.filter((o) =>
      o.items?.some(
        (i: any) => new Date(i.deliveryDate) > today
      )
    ).length;

    const overdueOrders = orders.filter((o) =>
      o.items?.some(
        (i: any) => new Date(i.deliveryDate) < today && o.status !== "delivered"
      )
    ).length;

    const totalCustomers = await Customer.countDocuments({
      boutique: boutiqueId,
    });

    // Weekly orders chart
    const weeklyOrders = Array.from({ length: 7 }).map((_, idx) => {
      const day = new Date();
      day.setDate(today.getDate() - (6 - idx));

      const count = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.toDateString() === day.toDateString()
        );
      }).length;

      return {
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        orders: count,
      };
    });

    // Upcoming deliveries list
    const upcomingDeliveries = orders
      .flatMap((o) =>
        o.items.map((i: any) => ({
          orderNumber: o.orderNumber,
          deliveryDate: i.deliveryDate,
        }))
      )
      .filter((i) => new Date(i.deliveryDate) > today)
      .slice(0, 5);

    res.json({
      stats: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        upcomingOrders,
        overdueOrders,
      },
      weeklyOrders,
      upcomingDeliveries,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
