"use client";

import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function OrderSummaryPage() {
  const { orderData } = useOrder();
  const router = useRouter();

  const confirmOrder = async () => {
    try {
  const payload = {
    customerId: orderData.customerId,
    trialDate: orderData.trialDate,
    deliveryDate: orderData.deliveryDate,
    advanceGiven: orderData.advanceGiven,
    notes: orderData.notes,
  outfits: [
    {
      name: orderData.type,
      category: orderData.category,
      quantity: 1,
      inspirationLink: orderData.inspirationLink || "",
      audioUrl: "", 
      specialInstructions: orderData.notes || "",
      referenceImages: [],

      measurements: orderData.measurements,
      stitchOptions: orderData.stitchOptions,

      stitchingPrice: orderData.totalAmount,
      additionalPrice: 0,
    }
  ],
};

  const res = await api.post("/api/orders/create", payload);
  router.push(`/dashboard/orders`);
  } catch (err) {
  console.error("Order creation failed", err);
  }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Order Summary</h1>

      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(orderData, null, 2)}
      </pre>

      <button
        onClick={confirmOrder}
        className="px-4 py-2 bg-emerald-600 text-white rounded"
      >
        Confirm Order
      </button>
    </div>
  );
}
