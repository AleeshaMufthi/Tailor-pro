"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();

const { user, loading } = useAuth();

if (loading) return <p>Loading...</p>;
if (!user) return null;

const menuItems = [
  ...(user.role === "owner"
    ? [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Add Staff", href: "/dashboard/staff" },
      ]
    : []),
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Customers", href: "/dashboard/customers" },
  { name: "Smart Calendar", href: "/dashboard/calendar" },
  { name: "FAQs", href: "/dashboard/faq" },
  { name: "Privacy Policy", href: "/dashboard/policy" },
];


  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-12 flex flex-col">
      
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-20">
       
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1"></div>
    </aside>
  );
}
