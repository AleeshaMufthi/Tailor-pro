"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <Sidebar />

      <div className="flex flex-col flex-1">
        
        <Topbar />

        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
