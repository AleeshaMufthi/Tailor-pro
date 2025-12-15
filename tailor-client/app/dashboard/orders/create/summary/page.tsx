"use client";

import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function OrderSummaryPage() {
  const { orderData } = useOrder();
  const router = useRouter();

  // Common function for building outfits payload
  const buildOutfitsPayload = () =>
    (orderData.outfits || []).map((o: any) => ({
      name: o.name,
      category: o.category || "",
      quantity: o.quantity || 1,
      inspirationLink: orderData.inspirationLink || "",
      audioUrl: orderData.audioUrl || "",
      specialInstructions: orderData.notes || "",
      referenceImages: (orderData.referenceImages || []).map((img: any) =>
        typeof img === "string" ? { url: img, publicId: null } : img
      ),
      measurements: orderData.measurements || null,
      stitchOptions: orderData.stitchOptions || {},
      stitchingPrice: o.stitchingPrice ?? orderData.totalAmount ?? 0,
      additionalPrice: o.additionalPrice ?? 0,
    }));

  // CONFIRM ORDER (ACTIVE)
  const confirmOrder = async () => {
    try {
      const payload = {
        customerId: orderData.customerId,
        trialDate: orderData.trialDate,
        deliveryDate: orderData.deliveryDate,
        advanceGiven: orderData.advanceGiven || 0,
        notes: orderData.notes || "",
        outfits: buildOutfitsPayload(),
        status: "active",
      };

      const res = await api.post("/api/orders/create", payload);
      router.push(`/dashboard/orders`);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create order");
    }
  };

  // SAVE AS DRAFT
  const saveAsDraft = async () => {
    try {
      const payload = {
        customerId: orderData.customerId,
        trialDate: orderData.trialDate,
        deliveryDate: orderData.deliveryDate,
        advanceGiven: orderData.advanceGiven || 0,
        notes: orderData.notes || "",
        outfits: buildOutfitsPayload(),
        status: "draft", // 👈 KEY DIFFERENCE
      };

      const res = await api.post("/api/orders/create", payload);
      router.push(`/dashboard/orders`);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save draft");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Order Summary</h1>

      <pre className="bg-gray-100 p-4 rounded text-sm">{JSON.stringify(orderData, null, 2)}</pre>

      <div className="flex gap-4">
        <button
          onClick={confirmOrder}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Confirm Order
        </button>

        <button
          onClick={saveAsDraft}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
}
