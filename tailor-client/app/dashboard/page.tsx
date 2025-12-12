"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function Dashboard() {

    const router = useRouter();
   

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-emerald-600">
        Welcome to Tailor Dashboard 🎉
      </h1>
    </div>
  );
}

