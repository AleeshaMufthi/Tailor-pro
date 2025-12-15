// dashboard/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

const filterColors: any = {
  active: "text-emerald-700 border-emerald-700",
  draft: "text-blue-600 border-blue-600",
  past_due: "text-red-600 border-red-600",
  upcoming: "text-purple-600 border-purple-600",
  pending_payment: "text-orange-600 border-orange-600",
  delivered: "text-yellow-600 border-yellow-600",
};

const statusBadge: any = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-blue-100 text-blue-700",
  past_due: "bg-red-100 text-red-700",
  upcoming: "bg-purple-100 text-purple-700",
  pending_payment: "bg-orange-100 text-orange-700",
  delivered: "bg-yellow-100 text-yellow-700",
}




  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders...");
      const res = await api.get("/api/orders/all");
      console.log(res.data.orders, "📦");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const today = new Date();

  console.log(today, "Today's date");

  const filteredOrders = orders.filter((o) => {
   
  const delivery = o?.deliveryDate ? new Date(o.deliveryDate) : null;

  console.log(delivery, "Delivery date for order");

    if (filter === "active") return o.status === "active";
    if (filter === "draft") return o.status === "draft";
    if (filter === "past_due") return delivery && delivery < today && o.status !== "delivered";
    if (filter === "upcoming") return delivery && delivery > today && o.status === "active";
    if (filter === "pending_payment") return (o.balanceDue || 0) > 0 && o.status === "delivered";
    if (filter === "delivered") return o.status === "delivered" && o.balanceDue == 0;
  
  return true;

  });

  return (
    <div className="p-6 space-y-10">

    <div className="flex justify-end">
      <Link
        href="/dashboard/customers"
        className="px-6 py-4 bg-blue-400 text-black font-semibold rounded-full border border-blue-700 hover:bg-blue-500 transition inline-block"
      >
      Create New Order
      </Link>
    </div>


      {/* Filters */}
      <div className="flex gap-8 pb-2">
        {["active", "draft", "past_due", "upcoming", "pending_payment", "delivered"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 text-lg font-medium transition-all 
            ${filter === f ? `${filterColors[f]} border-b-2` : `${filterColors[f]} text-gray-500 hover:text-black`}`}>
            {f.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Orders list */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading && <p className="text-gray-500">Loading orders...</p>}

        {!loading &&
          filteredOrders.map((order) => (
  <div
    key={order._id}
    className="relative bg-white border rounded-xl p-5 shadow hover:shadow-lg transition"
  >
    {/* Status badge */}
    <span
      className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full capitalize
      ${statusBadge[order.status]}`}
    >
      {order.status.replace('_', ' ')}
    </span>

    {/* Order number */}
    <p className="text-center text-sm text-gray-500 mb-1">
      Order No: {order.orderNumber}
    </p>

    {/* Customer */}
    <h3 className="text-center font-semibold text-lg text-gray-800">
      {order.customer?.name || '—'}
    </h3>

    {/* Meta info */}
    <div className="mt-4 space-y-2 text-sm text-gray-700">
      <div className="flex justify-between">
        <span>Delivery</span>
        <span>
          {order.deliveryDate
            ? new Date(order.deliveryDate).toLocaleDateString()
            : '-'}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Total</span>
        <span className="font-semibold">₹{order.totalAmount ?? 0}</span>
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-6 flex flex-col gap-2">
      <Link
        href={`/dashboard/orders/${order._id}`}
        className="w-full text-center py-2 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
      >
        View Order Details
      </Link>

      <Link
        href={`/dashboard/orders/${order._id}/item/${order.items?.[0]?._id}`}
        className="w-full text-center py-2 rounded-full border border-emerald-600 text-emerald-600 text-sm font-medium hover:bg-emerald-50"
      >
        View Outfit Details
      </Link>
    </div>
  </div>
))}


        {!loading && filteredOrders.length === 0 && <p className="text-gray-600 font-semibold">No orders found.</p>}
      </div>
    </div>
  );
}
