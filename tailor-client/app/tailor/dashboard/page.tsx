"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/lib/axios";

import {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ----------------------------- Helpers ----------------------------- */

const getItemDates = (order: any) =>
  (order.items || [])
    .map((i: any) => i.deliveryDate)
    .filter(Boolean)
    .map((d: string) => new Date(d));

const hasPastDueItem = (order: any, today: Date) =>
  getItemDates(order).some((d: Date) => d < today);

const hasUpcomingItem = (order: any, today: Date) =>
  getItemDates(order).some((d: Date) => d > today);

/* ----------------------------- Component ----------------------------- */

export default function Dashboard() {
  const { user } = useAuth();
  const activeBoutique = user?.activeBoutique;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------- Fetch Orders ----------------------------- */

  useEffect(() => {
    if (!activeBoutique) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/orders/all", {
          params: { boutiqueId: activeBoutique },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeBoutique]);

  /* ----------------------------- Analytics ----------------------------- */

  const today = new Date();

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const totalCustomers = new Set(
    orders.map((o) => o.customer?._id).filter(Boolean)
  ).size;

  const upcomingOrders = orders.filter(
    (o) => o.status === "active" && hasUpcomingItem(o, today)
  ).length;

  const overdueOrders = orders.filter(
    (o) => o.status !== "delivered" && hasPastDueItem(o, today)
  ).length;

  /* ----------------------------- Stats Cards ----------------------------- */

  const stats = [
    { title: "Total Orders", value: totalOrders, icon: ShoppingBag },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
    },
    { title: "Total Customers", value: totalCustomers, icon: Users },
    { title: "Upcoming Deliveries", value: upcomingOrders, icon: Clock },
    {
      title: "Overdue Orders",
      value: overdueOrders,
      icon: AlertTriangle,
      danger: overdueOrders > 0,
    },
  ];

  /* ----------------------------- Weekly Chart ----------------------------- */

  const weeklyOrders = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days.map((day, index) => ({
      day,
      orders: orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getDay() === index;
      }).length,
    }));
  })();

  /* ----------------------------- Upcoming List ----------------------------- */

  const upcomingList = orders
    .filter((o) => hasUpcomingItem(o, today) && o.status === "active")
    .slice(0, 3);

  /* ----------------------------- UI ----------------------------- */

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-emerald-700">
        Dashboard Analytics
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`rounded-2xl bg-white p-5 shadow border flex items-center gap-4 ${
              stat.danger ? "border-red-300" : "border-gray-200"
            }`}
          >
            <stat.icon
              className={`h-8 w-8 ${
                stat.danger ? "text-red-500" : "text-emerald-600"
              }`}
            />
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border">
          <h2 className="text-lg font-semibold mb-4">
            Orders This Week
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyOrders}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line dataKey="orders" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-2xl p-6 shadow border">
          <h2 className="text-lg font-semibold mb-4">
            Upcoming Deliveries
          </h2>

          {upcomingList.length === 0 ? (
            <p className="text-gray-500">No upcoming deliveries</p>
          ) : (
            <ul className="space-y-3">
              {upcomingList.map((o) => (
                <li key={o._id} className="flex justify-between">
                  <span>Order number {o.orderNumber}</span>
                  <span className="text-gray-500">
                    {new Date(getItemDates(o)[0]).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueOrders > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Overdue Orders
          </h2>
          <p className="text-red-600">
            {overdueOrders} orders have crossed the delivery date.
          </p>
        </div>
      )}
    </div>
  );
}
