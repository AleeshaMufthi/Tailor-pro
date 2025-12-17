"use client";
import React from "react";

const MAX_ORDERS = 15;

/**
 * STATIC SAMPLE DATA
 * key = day of month
 * value = number of orders
 */
const ordersByDate: Record<number, number> = {
  2: 4,
  4: 8,
  6: 12,
  9: 15,
  12: 6,
  14: 10,
  18: 3,
  21: 14,
  25: 9,
};

function getColor(count: number) {
  if (count <= 5) return "bg-green-500";
  if (count <= 9) return "bg-yellow-400";
  if (count <= 12) return "bg-orange-500";
  return "bg-red-500";
}

export default function CalendarPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleString("default", { month: "long" });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Calendar</h1>

        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <span className="text-emerald-700 font-semibold">
            Maximum {MAX_ORDERS} orders can be taken per day
          </span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <Legend color="bg-green-500" label="1–5 Safe" />
        <Legend color="bg-yellow-400" label="6–9 Busy" />
        <Legend color="bg-orange-500" label="10–12 High" />
        <Legend color="bg-red-500" label="13–15 Critical" />
      </div>

      {/* CALENDAR */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {monthName} {year}
        </h2>

        {/* WEEKDAYS */}
        <div className="grid grid-cols-7 text-center text-gray-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="font-medium">
              {d}
            </div>
          ))}
        </div>

        {/* DAYS */}
        <div className="grid grid-cols-7 gap-3">
          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const count = ordersByDate[day];

            return (
              <div
                key={day}
                className={`relative h-24 rounded-lg border p-2 flex flex-col justify-between
                ${count ? "border-emerald-300 bg-emerald-50" : "border-gray-200"}
                hover:shadow transition`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold">{day}</span>

                  {count && (
                    <span
                      className={`w-3 h-3 rounded-full ${getColor(count)}`}
                    />
                  )}
                </div>

                {count && (
                  <div className="text-xs mt-auto">
                    <div
                      className={`inline-block px-2 py-1 rounded text-white text-xs ${getColor(
                        count
                      )}`}
                    >
                      {count} orders
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------- Legend Component -------- */
const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full ${color}`} />
    <span>{label}</span>
  </div>
);
