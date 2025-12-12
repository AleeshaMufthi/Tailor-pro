"use client";

import { useAuth } from "@/app/context/AuthContext";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Topbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md px-6 py-6 flex items-center justify-end relative">

      {/* USER DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm hover:bg-emerald-200 transition"
        >
          {user?.fullName || "User"}
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        <div
          className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md text-black border ${
            open ? "block" : "hidden"
          }`}
        >
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Profile
          </Link>

          <button
            onClick={async () => {
              await logout();
              window.location.href = "/auth";
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
          >
            Logout
          </button>
        </div>
      </div>

    </header>
  );
}
