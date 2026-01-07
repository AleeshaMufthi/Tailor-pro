"use client";

import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";

interface CustomMeasurement {
  name: string;
  size: string;
  image?: File | null;
}

const DEFAULT_MEASUREMENT_CONFIG = {
  shoulder: {
    label: "Shoulder",
    image: "/measurements/shoulder.jpg",
    position: { top: "15%", left: "55%" },
  },
  chest: {
    label: "Chest",
    image: "/measurements/chest.jpg",
    position: { top: "22%", left: "55%" },
  },
  waist: {
    label: "Waist",
    image: "/measurements/waist.jpg",
    position: { top: "32%", left: "55%" },
  },
  hip: {
    label: "Hip",
    image: "/measurements/hip.jpg",
    position: { top: "40%", left: "55%" },
  },
  neck:{
    label: "Neck",
    image: "/measurements/neck.jpg",
    position: { top: "10%", left: "55%" },
  },
  sleeveLength:{
    label: "Sleeve Length",
    image: "/measurements/sleeve_length.jpg",
    position: { top: "28%", left: "30%" },
  },
  wrist:{
    label: "Wrist",
    image: "/measurements/wrist_circumference.jpg",
    position: { top: "45%", left: "25%" },
  },
  armhole:{
    label: "Armhole",
    image: "/measurements/arm_hole.jpg",
    position: { top: "15%", left: "30%" },
  },
  hipCircumference:{
    label: "Hip Circumference",
    image: "/measurements/hip_circumference.jpg",
    position: { top: "45%", left: "55%" },
  },
  kneeCircumference:{
    label: "Knee Circumference",
    image: "/measurements/knee_circumference.jpg",
    position: { top: "60%", left: "55%" },
  },
  bottomlength:{
    label: "Bottom Length",
    image: "/measurements/Bottomlength.jpg",
    position: { top: "75%", left: "55%" },
  },
  ankle:{
    label: "Ankle",
    image: "/measurements/ankle.jpg",
    position: { top: "87%", left: "60%" },
  }
};


export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderData, setOrderData } = useOrder();

  const [uploading, setUploading] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showStitchOptions, setShowStitchOptions] = useState(false);

  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
  const activeOutfit = orderData.outfits?.[activeOutfitIndex];

  const [form, setForm] = useState({ 
    chest: "", 
    waist: "", 
    hip: "", 
    shoulder: "",
    neck: "",
    sleeveLength: "",
    wrist: "",
    armhole: "",
    hipCircumference: "",
    kneeCircumference: "",
    bottomlength: "",
    ankle:"",
  });

  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurement[]>([]);
  const [newMeasurement, setNewMeasurement] = useState<CustomMeasurement>({
    name: "",
    size: "",
    image: null,
  });

  const [dailyOrderCount, setDailyOrderCount] = useState<number | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const ORDER_LIMIT = 15;

  const handleDeliveryDateChange = async (date: string) => {
  console.log("Selected delivery date:", date);
  updateOutfit("deliveryDate", date);

    setOrderData((prev: any) => ({
    ...prev,
    forceDeliveryDate: false, 
  }));

  try {

    const res = await api.get(
      `/api/orders/count-by-date?date=${date}`
    );

    console.log("Order count response:", res.data);

    setDailyOrderCount(res.data.totalOrders);

    if (res.data.exceeded) {
    setShowLimitModal(true);
}
  } catch (err) {
    console.error("Failed to fetch order count", err);
  }
};


const acceptOverLimit = () => {
  setOrderData((prev: any) => ({
    ...prev,
    forceDeliveryDate: true,
  }));
  setShowLimitModal(false);
};

  const addCustomMeasurement = async () => {
  if (!newMeasurement.name || !newMeasurement.size) return;

  let imageUrl: string | undefined;

  if (newMeasurement.image) {
    imageUrl = await uploadToCloudinary(newMeasurement.image);
  }

  const measurement = {
    name: newMeasurement.name,
    size: newMeasurement.size,
    imageUrl,
  };

  setCustomMeasurements((prev) => [...prev, measurement]);
  setNewMeasurement({ name: "", size: "", image: null });
};



  if (!activeOutfit) return null;

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

  const buildMeasurementPayload = () => {
  const defaultMeasurements = Object.entries(form)
    .filter(([_, value]) => value)
    .map(([key, value]) => ({
      name: key,
      size: value,
      type: "default",
    }));

  const custom = customMeasurements.map((m) => ({
    name: m.name,
    size: m.size,
    type: "custom",
  }));

  return [...defaultMeasurements, ...custom];
};


  const next = () => {
    saveMeasurementsToOutfit();
    router.push("/dashboard/orders/create/summary");
  };

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
        outfits[activeOutfitIndex].referenceImages = Array.from(
          new Set([
            ...(outfits[activeOutfitIndex].referenceImages || []),
            ...uploadedUrls,
          ])
        );
      }

      return { ...prev, outfits };
    });
  } catch (err) {
    console.error("Upload failed:", err);
  } finally {
    setUploading(false);
    e.target.value = ""; // 🔑 reset input
  }
};

// remove outfit reference image
const removeReferenceImage = (imageUrl: string) => {
  setOrderData((prev: any) => {
    const outfits = [...prev.outfits];

    outfits[activeOutfitIndex] = {
      ...outfits[activeOutfitIndex],
      referenceImages: outfits[activeOutfitIndex].referenceImages.filter(
        (img: string) => img !== imageUrl
      ),
    };

    return { ...prev, outfits };
    
  });
};


  const createMeasurements = async (data: any) => {
    const res = await api.post("/api/measurements/create", data);
    return res.data;
  };

  const removeCustomMeasurement = (index: number) => {
  setCustomMeasurements((prev) => prev.filter((_, i) => i !== index));
};

const saveMeasurementsToOutfit = () => {
  const payload = {
    defaults: {
      chest: form.chest || undefined,
      waist: form.waist || undefined,
      hip: form.hip || undefined,
      shoulder: form.shoulder || undefined,
    },
    custom: customMeasurements,
  };

  setOrderData((prev: any) => {
    const outfits = [...prev.outfits];
    outfits[activeOutfitIndex] = {
      ...outfits[activeOutfitIndex],
      measurements: payload,
    };
    return { ...prev, outfits };
  });
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
            className={`px-6 py-2 rounded-full border font-semibold mb-4 ${
              i === activeOutfitIndex
                ? "bg-emerald-600 text-white"
                : "bg-white"
            }`}
          >
            {o.name}
            {o.measurements && " ✔"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  <div>
    <label className="text-md font-semibold text-gray-600">Order Type</label>
    <select
      value={activeOutfit.type || ""}
      onChange={(e) => updateOutfit("type", e.target.value)}
      className="border p-2 mt-3 rounded-xl w-full hover:border-emerald-500 transition"
    >
      <option value="">Select Type</option>
      <option value="stitching">Stitching</option>
      <option value="alteration">Alteration</option>
    </select>
  </div>

  {/* Inspiration */}
  <div>
    <label className="text-md text-gray-600 font-semibold">Inspiration URL</label>
    <input
      className="border p-2 hover:border-emerald-500 rounded-xl w-full mt-3"
      value={activeOutfit.inspirationLink || ""}
      onChange={(e) => updateOutfit("inspirationLink", e.target.value)}
    />
  </div>

  {/* Instructions (full row) */}
  <div className="md:col-span-2">
    <label className="text-md font-semibold text-gray-600 mb-3">Special Instructions</label>
    <textarea
      rows={3}
      className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
      value={activeOutfit.specialInstructions || ""}
      onChange={(e) =>
        updateOutfit("specialInstructions", e.target.value)
      }
    />
  </div>
</div>

<h3 className="font-semibold text-md text-gray-600 mt-4">Reference Images</h3>

<label className="inline-block cursor-pointer">
  <div className="px-4 py-2 border border-emerald-600 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium">
    + Add Reference Image
  </div>

  <input
    type="file"
    accept="image/*"
    multiple
    className="hidden"
    onChange={(e) => handleFileUpload(e, "referenceImages")}
  />
</label>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
  {activeOutfit.referenceImages?.map((img: string, index: number) => (
    <div
      key={img}
      className="relative w-32 h-[200px] overflow-hidden rounded-lg"
    >
      {/* Image */}
      <img
        src={img}
        alt="reference"
        className="w-full h-full object-cover"
      />

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => removeReferenceImage(img)}
        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm group-hover:opacity-100 transition-transform hover:scale-105"
        aria-label="Remove image"
      >
        ✕
      </button>
    </div>
  ))}
</div>



<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  <div>
    <label className="text-md font-semibold text-gray-600">Stitching Price</label>
    <input
      type="number"
      className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
      value={activeOutfit.stitchingPrice || ""}
      onChange={(e) =>
        updateOutfit("stitchingPrice", Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="text-md font-semibold text-gray-600">Additional Price</label>
    <input
      type="number"
      className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
      value={activeOutfit.additionalPrice || ""}
      onChange={(e) =>
        updateOutfit("additionalPrice", Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="text-md font-semibold text-gray-600">Trial Date</label>
    <input
      type="date"
      className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
      value={activeOutfit.trialDate ?? ""}
      onChange={(e) => updateOutfit("trialDate", e.target.value)}
    />
  </div>

  <div>
    <label className="text-md font-semibold text-gray-600">Delivery Date</label>
    <input
      type="date"
      className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
      value={activeOutfit.deliveryDate ?? ""}
      onChange={(e) => handleDeliveryDateChange(e.target.value)}
    />
    {dailyOrderCount !== null && (
  <p
    className={`mt-2 ${
      dailyOrderCount >= ORDER_LIMIT
        ? "text-red-600/30 text-red-400 px-2 py-2 rounded-lg text-md font-semibold"
        : "bg-yellow-500/30 text-yellow-700 px-2 py-2 rounded-lg text-md font-semibold"
    }`}
  >
    Total {dailyOrderCount} orders placed on this day. Maximum {ORDER_LIMIT} orders allowed.
  
  </p>
)}

  </div>

</div>

{showLimitModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
      <h3 className="text-xl font-bold text-red-600 items-center justify-center flex">
        Delivery Limit Reached
      </h3>

      <p className="text-md font-semibold text-gray-700">
        There are already {dailyOrderCount} orders scheduled for this date.
        You can either continue or choose another date.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowLimitModal(false);
            updateOutfit("deliveryDate", "");
          }}
          className="px-3 py-2 border border-emerald-600 text-md font-semibold rounded-xl"
        >
          Choose Another Date
        </button>

        <button
          onClick={acceptOverLimit}
          className="px-3 py-2 bg-emerald-600 text-white text-md font-semibold rounded-xl"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  </div>
)}



<div className="p-6 rounded-lg space-y-6">

  <h2 className="font-semibold text-xl">Measurements</h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {(Object.keys(form) as (keyof typeof form)[]).map((key) => {
      const config = DEFAULT_MEASUREMENT_CONFIG[key];

      return (
        <div
          key={key}
          className="flex items-center gap-4 border border-gray-300 p-3 rounded-xl"
        >
          <img
            src={config.image}
            alt={config.label}
            className="w-24 h-24 rounded-xl object-cover"
          />

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {config.label}
            </label>
            <input
              type="number"
              placeholder="cm"
              value={form[key]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="w-full border p-2 rounded-xl"
            />
          </div>
        </div>
      );
    })}
  </div>

  <h2 className="font-semibold text-xl">Add Custom Measurement</h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
    <input
      placeholder="Measurement name"
      value={newMeasurement.name}
      onChange={(e) =>
        setNewMeasurement({ ...newMeasurement, name: e.target.value })
      }
      className="border p-2 rounded-xl"
    />

    <input
      placeholder="Size (cm)"
      value={newMeasurement.size}
      onChange={(e) =>
        setNewMeasurement({ ...newMeasurement, size: e.target.value })
      }
      className="border p-2 rounded-xl"
    />

    <label className="border border-emerald-500 rounded-xl font-medium text-md p-2 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
      <input
        type="file"
        className="hidden"
        onChange={(e) =>
          setNewMeasurement({
            ...newMeasurement,
            image: e.target.files?.[0] || null,
          })
        }
      />
      + Upload Image
    </label>
  </div>

  {newMeasurement.image && (
    <div className="flex items-center gap-3 border p-3 rounded bg-gray-50 mt-3">
      <img
        src={URL.createObjectURL(newMeasurement.image)}
        className="w-24 h-24 rounded object-cover"
        alt="preview"
      />
      <div>
        <p className="font-medium">
          {newMeasurement.name || "Custom measurement"}
        </p>
        <p className="text-sm text-gray-600">
          {newMeasurement.size} cm
        </p>
      </div>
    </div>
  )}

  <button
    onClick={addCustomMeasurement}
    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold mt-3"
  >
    Add Measurement
  </button>

  {customMeasurements.length > 0 && (
    <div className="space-y-2">
      {customMeasurements.map((m, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2 rounded-xl"
        >
          {m.image && (
            <img
              src={URL.createObjectURL(m.image)}
              className="w-24 h-24 rounded-xl object-cover"
              alt={m.name}
            />
          )}
          <p className="font-medium">
            {m.name}: {m.size} cm
          </p>

          <button
          type="button"
          onClick={() => removeCustomMeasurement(i)}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700"  />
          
        </button>

        </div>

        
      ))}
         
    </div>
  )}



  <h2 className="font-semibold text-xl text-center">Preview on Demo Image</h2>

  <div className="relative w-[380px] h-[580px] border rounded mx-auto">
    <img
      src="/measurements/measure.jpg"
      alt="Demo Body"
      className="w-full h-full object-cover"
    />

    {(Object.keys(form) as (keyof typeof form)[]).map((key) => {
      const config = DEFAULT_MEASUREMENT_CONFIG[key];
      if (!form[key]) return null;

      return (
        <div
          key={key}
          className="absolute flex items-center gap-2 bg-white/90 px-2 py-1 rounded shadow text-xs"
          style={{
            top: config.position.top,
            left: config.position.left,
          }}
        >
          <span className="font-medium text-md">
            {config.label}: {form[key]} cm
          </span>
        </div>
      );
    })}

    {customMeasurements.map((m, i) => (
      <div
        key={i}
        className="absolute flex items-center gap-2 bg-white/90 px-2 py-1 rounded shadow text-xs"
        style={{ top: `${65 + i * 6}%`, left: "55%" }}
      >
       
        <span className="text-md font-semibold">
          {m.name}: {m.size} cm
        </span>
      </div>
    ))}
  </div>
</div>

      <button
        onClick={next}
        className="px-4 py-2 bg-emerald-600 text-md font-medium text-white rounded-full"
      >
        Continue to Summary
      </button>
    </div>
  );
}
