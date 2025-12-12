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

  const fetchOrders = async () => {
    setLoading(true);
    console.log("Fetching orders...");
    const res = await api.get("/api/orders/all");
    console.log(res.data.orders,"📦")
    setOrders(res.data.orders);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/api/orders/${id}/status`, { status });
    fetchOrders();
  };

  const today = new Date();

  console.log(today, "📅 today")

  const filteredOrders = orders.filter((o) => {

  const delivery = new Date(o.deliveryDate);

  console.log(delivery, "📅 Delivery date ")

    if (filter === "active") return o.status === "active";
    if (filter === "draft") return o.status === "draft";
    if (filter === "past_due") return delivery < today && o.status !== "delivered";
    if (filter === "upcoming") return delivery > today && o.status === "active";
    if (filter === "pending_payment") return o.balanceDue > 0 && o.status === "active";
    if (filter === "delivered") return o.status === "delivered";

    return true;

  });

  return (
    <div className="p-6 space-y-6"> 
<Link href="/dashboard/customers" className="px-4 py-2 bg-emerald-600 text-white rounded-full">
        Create New Order
      </Link>
      {/* Filters */}
   <div className="flex gap-8 border-b pb-2">
  {[
    "active",
    "draft",
    "past_due",
    "upcoming",
    "pending_payment",
    "delivered",
  ].map((f) => (
    <button
      key={f}
      onClick={() => setFilter(f)}
      className={`pb-2 text-lg font-medium transition-all ${
        filter === f
          ? "text-emerald-700 border-b-2 border-emerald-700"
          : "text-gray-500 hover:text-emerald-600"
      }`}
    >
      {f.replace("_", " ").toUpperCase()}

    </button>
  ))}
</div>


  <div className="space-y-4">
  {filteredOrders.map((order) => (
    <div
      key={order._id}
      className="bg-white p-5 border rounded-lg shadow"
    >
      {/* ROW 1 */}
      <div className="grid grid-cols-3 gap-4 border-b pb-3">
        <div>
          <p className="font-semibold text-gray-700">Order Number</p>
          <p>{order.orderNumber}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Customer Name</p>
          <p>{order.customer?.name}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Phone Number</p>
          <p>{order.customer?.phone}</p>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-3 gap-4 border-b py-3">
        <div>
          <p className="font-semibold text-gray-700">Trial Date</p>
          <p>{order.trialDate ? new Date(order.trialDate).toLocaleDateString() : "-"}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Delivery Date</p>
          <p>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "-"}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Total Amount</p>
          <p>₹{order.totalAmount}</p>
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-3 gap-4 py-3">
        <div>
          <p className="font-semibold text-gray-700">Item Status</p>
          <p className="capitalize">{order.status}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Items</p>
          <ul className="list-disc ml-4 text-gray-700">
            {order.items?.map((item: any, idx: number) => (
              <li key={idx}>
                {item.name} (x{item.quantity})
              </li>
            ))}
          </ul>
        </div>

        <div>
  <p className="font-semibold text-gray-700">Outfit Status</p>
<ul className="list-disc ml-4 text-gray-700">
  {order.items?.map((item: any) => (
    <div key={item._id} className="mb-2">
      <li>
        {item.name} —
        <span className="capitalize text-emerald-700">{item.status}</span>
      </li>

      <div className="flex items-center justify-end">
        <Link
          href={`/dashboard/orders/${order._id}/item/${item._id}`}
          className="flex items-center gap-1 text-emerald-600 font-medium"
        >
          View Outfit Details <ChevronRight />
        </Link>
      </div>
    </div>
  ))}
</ul>

</div>


        {/* Open Order Details Page */}
        <div className="flex items-center justify-end">
          <Link
            href={`/dashboard/orders/${order._id}`}
            className="flex items-center gap-1 text-emerald-600 font-medium"
          >
            View Order Details <ChevronRight />
          </Link>
        </div>
      </div>

      {/* Status dropdown */}
      <div className="pt-3 flex justify-end">
        <select
          className="border p-2 rounded"
          value={order.status}
          onChange={(e) => updateStatus(order._id, e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="upcoming">Upcoming</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
    </div>
  ))}

  {filteredOrders.length === 0 && (
    <p className="text-gray-500">No orders found.</p>
  )}
</div>

    </div>
  );
}

