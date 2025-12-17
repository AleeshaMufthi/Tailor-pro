"use client";

import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MeasurementsModal from "./MeasurementsModal";
import StitchOptionsModal from "./StitchOptionsModal";
import { uploadToCloudinary } from "@/lib/cloudinary";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderData, setOrderData } = useOrder();

  const [uploading, setUploading] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showStitchOptions, setShowStitchOptions] = useState(false);

  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
  const activeOutfit = orderData.outfits?.[activeOutfitIndex];

  if (!activeOutfit) return null;

  /* ----------------------------------
     Outfit scoped updater
  ---------------------------------- */
  const updateOutfit = (key: string, value: any) => {
    setOrderData((prev: any) => {
      const outfits = [...prev.outfits];
      outfits[activeOutfitIndex] = {
        ...outfits[activeOutfitIndex],
        [key]: value,
      };
      return { ...prev, outfits };
    });
  };

  const next = () => {
    router.push("/dashboard/orders/create/summary");
  };

  /* ----------------------------------
     File Upload (per outfit)
  ---------------------------------- */
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "referenceImages" | "audioUrl"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }

      setOrderData((prev: any) => {
        const outfits = [...prev.outfits];

        if (field === "audioUrl") {
          outfits[activeOutfitIndex].audioUrl = uploadedUrls[0];
        } else {
          outfits[activeOutfitIndex].referenceImages = [
            ...(outfits[activeOutfitIndex].referenceImages || []),
            ...uploadedUrls,
          ];
        }

        return { ...prev, outfits };
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  /* ----------------------------------
     Measurements
  ---------------------------------- */
  const createMeasurements = async (data: any) => {
    const res = await api.post("/api/measurements/create", data);
    return res.data;
  };

  const saveMeasurements = async (values: any) => {
    try {
      const payload = {
        type: activeOutfit.type || "stitching",
        values,
      };

      const measurement = await createMeasurements(payload);
      updateOutfit("measurements", measurement._id);
      setShowMeasurement(false);
    } catch (err) {
      console.error("Failed to save measurements", err);
    }
  };

  const updateOrder = (key: string, value: any) => {
  setOrderData((prev: any) => ({
    ...prev,
    [key]: value,
  }));
};


console.log(orderData, "ordreData in details")


  return (
    <div className="p-6 space-y-4">

      <Link
        href="/dashboard/orders/create/select-outfits"
        className="text-gray-600 flex items-center gap-1"
      >
      <ChevronLeft size={20} />
      Back to Outfits
      </Link>


      <h1 className="text-2xl font-semibold text-black">Order Details</h1>

      {/* Outfit Tabs */}
      <div className="flex gap-2 flex-wrap">
        {orderData.outfits.map((o: any, i: number) => (
          <button
            key={i}
            onClick={() => setActiveOutfitIndex(i)}
            className={`px-6 py-2 rounded-full border font-semibold ${
              i === activeOutfitIndex
                ? "bg-emerald-600 text-black"
                : "bg-white"
            }`}
          >
            {o.name}
            {o.measurements && " ✔"}
          </button>
        ))}
      </div>

      {/* Type */}
      <select
        value={activeOutfit.type || ""}
        onChange={(e) => updateOutfit("type", e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select Type</option>
        <option value="stitching">Stitching</option>
        <option value="alteration">Alteration</option>
      </select>

      {/* Instructions */}
      <textarea
        className="border p-2 w-full"
        rows={4}
        placeholder="Special Instructions"
        value={activeOutfit.specialInstructions || ""}
        onChange={(e) =>
          updateOutfit("specialInstructions", e.target.value)
        }
      />

      {/* Inspiration Link */}
      <input
        className="border p-2 w-full"
        placeholder="Inspiration URL"
        value={activeOutfit.inspirationLink || ""}
        onChange={(e) =>
          updateOutfit("inspirationLink", e.target.value)
        }
      />
      <p>Reference Images</p>
      {/* Reference Images */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileUpload(e, "referenceImages")}
      />

      {/* Audio */}
      {/* <p>Audio Note</p>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => handleFileUpload(e, "audioUrl")}
      /> */}

      {/* Prices */}
      <p>Stitching price</p>
      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Stitching Price"
        value={ activeOutfit.stitchingPrice || "" }
        onChange={(e) =>
          updateOutfit("stitchingPrice", Number(e.target.value))
        }
      />

      <p>Additional price</p>
      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Additional Price"
        value={activeOutfit.additionalPrice || ""}
        onChange={(e) =>
          updateOutfit("additionalPrice", Number(e.target.value))
        }
      />

<p>Delivery date</p>
<input
  className="border p-2 w-full"
  type="date"
  value={activeOutfit.deliveryDate ?? ""}
  onChange={(e) => updateOutfit("deliveryDate", e.target.value)}
/>

<p>Trial date</p>
<input
  className="border p-2 w-full"
  type="date"
  value={activeOutfit.trialDate ?? ""}
  onChange={(e) => updateOutfit("trialDate", e.target.value)}
/>


      {/* Modals */}
      <button
        onClick={() => setShowMeasurement(true)}
        className="px-4 py-2 bg-gray-200 rounded-full border border-emerald-500 hover:bg-gray-400 transition"
      >
        Add Measurements
      </button>

      {/* <button
        onClick={() => setShowStitchOptions(true)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        Stitch Options
      </button> */}

      {showMeasurement && (
        <MeasurementsModal
          close={() => setShowMeasurement(false)}
          save={saveMeasurements}
        />
      )}

      {showStitchOptions && (
        <StitchOptionsModal
          close={() => setShowStitchOptions(false)}
          save={(o: any) => updateOutfit("stitchOptions", o)}
        />
      )}

      <button
        onClick={next}
        className="px-4 py-2 bg-emerald-600 text-white rounded-full"
      >
        Continue to Summary
      </button>
    </div>
  );
}
