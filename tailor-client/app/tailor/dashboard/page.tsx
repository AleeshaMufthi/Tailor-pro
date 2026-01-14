"use client";

import { TrendingUp, ShoppingBag, Users, Clock, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { title: "Total Orders", value: "128", icon: ShoppingBag },
  { title: "Total Revenue", value: "₹2,45,000", icon: TrendingUp },
  { title: "Total Customers", value: "76", icon: Users },
  { title: "Upcoming Deliveries", value: "9", icon: Clock },
  { title: "Overdue Orders", value: "3", icon: AlertTriangle, danger: true },
];

const weeklyOrders = [
  { day: "Mon", orders: 12 },
  { day: "Tue", orders: 18 },
  { day: "Wed", orders: 10 },
  { day: "Thu", orders: 22 },
  { day: "Fri", orders: 30 },
  { day: "Sat", orders: 25 },
];

export default function Dashboard() {
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
              className={`h-8 w-8 ${stat.danger ? "text-red-500" : "text-emerald-600"}`}
            />
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border">
          <h2 className="text-lg font-semibold mb-4">Orders This Week</h2>
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
          <h2 className="text-lg font-semibold mb-4">Upcoming Deliveries</h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Order #T-1023</span>
              <span className="text-gray-500">Tomorrow</span>
            </li>
            <li className="flex justify-between">
              <span>Order #T-1027</span>
              <span className="text-gray-500">Dec 18</span>
            </li>
            <li className="flex justify-between">
              <span>Order #T-1031</span>
              <span className="text-gray-500">Dec 19</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          Overdue Orders
        </h2>
        <p className="text-red-600">3 orders have crossed the delivery date.</p>
      </div>
    </div>
  );
}
