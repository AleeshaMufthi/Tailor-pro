"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function Sidebar() {

  const pathname = usePathname();

  const { user, loading } = useAuth();

  const [activeBoutique, setActiveBoutique] = useState<{
  _id: string;
  name: string;
  } | null>(null);

  const getBoutiqueId = (user: any) => {
  if (!user) return null
  if (user.role === "owner") return user.activeBoutique
  if (user.role === "staff") return user.boutique
  return null
}

  useEffect(() => {

  getBoutiqueId(user);

  const fetchActiveBoutique = async () => {
    try {
      const res = await api.get("/api/boutique/active");
      setActiveBoutique(res.data);
    } catch {}
  };

  fetchActiveBoutique();
}, [user?.activeBoutique]);


if (loading) return <p>Loading...</p>;
if (!user) return null;

const menuItems = [
  ...(user.role === "owner"
    ? [
        { name: "Dashboard", href: "/tailor/dashboard" },
        { name: "Staffs", href: "/tailor/dashboard/staff" },
        { name: "Revenue", href: "/tailor/dashboard/revenue" },
        { name: "Settings", href: "/tailor/dashboard/boutiques" },
      ]
    : []),
  { name: "Orders", href: "/tailor/dashboard/orders" },
  { name: "Customers", href: "/tailor/dashboard/customers" },
  { name: "Smart Calendar", href: "/tailor/dashboard/calendar" },
  { name: "FAQs", href: "/tailor/dashboard/faq" },
  { name: "Privacy Policy", href: "/tailor/dashboard/policy" },
];


  return (
    <aside className="no-print w-64 bg-white shadow-lg min-h-screen p-12 flex flex-col">
      
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-10">

        {/* ACTIVE BOUTIQUE */}
<div className="mb-5 px-2">
  <div className="flex items-center gap-3">
    {/* Online Dot */}
    <span className="relative flex h-4 w-4">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600"></span>
    </span>

    <div>
      <p className="text-sm text-gray-500 font-semibold">
        Active Boutique
      </p>
      <p className="text-xl font-bold text-gray-800 truncate max-w-[180px]">
        {activeBoutique?.name ?? "—"}
      </p>
    </div>
  </div>
</div> 
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
