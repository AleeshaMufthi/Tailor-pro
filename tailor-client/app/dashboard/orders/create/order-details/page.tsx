"use client";

import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MeasurementsModal from "./MeasurementsModal";
import StitchOptionsModal from "./StitchOptionsModal";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function OrderDetailsPage() {
  const router = useRouter();

  const { orderData, setOrderData } = useOrder();

  const [uploading, setUploading] = useState(false);

  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showStitchOptions, setShowStitchOptions] = useState(false);

  const update = (key: string, value: any) => {
    setOrderData((prev: any) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    router.push("/dashboard/orders/create/summary");
  };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const url = await uploadToCloudinary(file);
      uploadedUrls.push(url);
    }

    setOrderData({
      [field]: uploadedUrls,
    });

    setUploading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Order Details</h1>

      {/* Type */}
      <select
        value={orderData.type}
        onChange={(e) => update("type", e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select Type</option>
        <option>Stitching</option>
        <option>Alteration</option>
      </select>

      {/* Instructions */}
      <textarea
        className="border p-2 w-full"
        rows={4}
        placeholder="Special Instructions"
        value={orderData.instructions}
        onChange={(e) => update("instructions", e.target.value)}
      />

      {/* Inspiration Link */}
      <input
        className="border p-2 w-full"
        placeholder="Inspiration URL"
        value={orderData.inspirationLink}
        onChange={(e) => update("inspirationLink", e.target.value)}
      />

      {/* Reference Images */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileUpload(e, "referenceImages")}
      />

      <p className="font-semibold mt-4">Upload Audio Note</p>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => handleFileUpload(e, "audioNote")}
      />

      {/* Amounts */}
      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Total Amount"
        onChange={(e) => update("totalAmount", Number(e.target.value))}
      />

      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Advance"
        onChange={(e) => update("advance", Number(e.target.value))}
      />

      <input
        className="border p-2 w-full"
        type="date"
        placeholder="Delivery Date"
        onChange={(e) => update("deliveryDate", e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="date"
        placeholder="Trial Date"
        onChange={(e) => update("trialDate", e.target.value)}
      />

      {/* Modals */}
      <button
        onClick={() => setShowMeasurement(true)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        Add Measurements
      </button>

      <button
        onClick={() => setShowStitchOptions(true)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        Stitch Options
      </button>

      {showMeasurement && (
        <MeasurementsModal
          close={() => setShowMeasurement(false)}
          save={(m: any) => update("measurements", m)}
        />
      )}

      {showStitchOptions && (
        <StitchOptionsModal
          close={() => setShowStitchOptions(false)}
          save={(o: any) => update("stitchOptions", o)}
        />
      )}

      <button
        onClick={next}
        className="px-4 py-2 bg-emerald-600 text-white rounded"
      >
        Continue to Summary
      </button>
    </div>
  );
}

