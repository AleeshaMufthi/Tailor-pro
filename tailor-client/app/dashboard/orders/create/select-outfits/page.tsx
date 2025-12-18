"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useOrder } from "@/app/context/OrderContext";
import { useState } from "react";
import { Check } from "lucide-react";

interface Outfit {
  name: string;
  quantity: number;
  image?: string;
}

const defaultOutfits: Outfit[] = [
  { name: "Shirt", quantity: 1, image: "/outfits/shirtimage.jpg" },
  { name: "Pant", quantity: 1, image: "/outfits/pantimage.jpg" },
  { name: "Kurtha", quantity: 1, image: "/outfits/kurthaimage.jpg" },
  { name: "Blouse", quantity: 1, image: "/outfits/blouseimage.jpg" },
  { name: "Churidar", quantity: 1, image: "/outfits/churidharimage.png" },
  { name: "Coat", quantity: 1, image: "/outfits/coatimage.jpg" },
];

export default function SelectOutfitsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const customerId = params?.get("customerId") || "";


  const { setOrderData } = useOrder();
  const [selected, setSelected] = useState<Outfit[]>([]);
  const [customName, setCustomName] = useState("");

  const toggleOutfit = (outfit: Outfit) => {
    const idx = selected.findIndex((s) => s.name === outfit.name);
    if (idx >= 0) {
      setSelected(selected.filter((_, i) => i !== idx));
    } else {
      setSelected([...selected, { ...outfit, quantity: 1 }]);
    }
  };

  const updateQty = (index: number, qty: number) => {
    const updated = [...selected];
    updated[index].quantity = Math.max(1, qty || 1);
    setSelected(updated);
  };

  const remove = (index: number) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const addCustomOutfit = () => {
    if (!customName.trim()) return;
    const newOutfit: Outfit = { name: customName.trim(), quantity: 1 };
    setSelected([...selected, newOutfit]);
    setCustomName("");
  };

  const next = () => {
    setOrderData((prev: any) => ({
      ...prev,
      customerId,
      outfits: selected,
    }));

    router.push("/dashboard/orders/create/order-details");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-black">Select Outfits</h1>

      {/* Outfit Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10">
        {defaultOutfits.map((o) => {
          const isSelected = selected.some((s) => s.name === o.name);
          return (
            <div
              key={o.name}
              className={`relative h-48 w-48 border rounded-lg overflow-hidden cursor-pointer flex items-center justify-center transition-transform ${
                isSelected ? "ring-4 ring-emerald-500 scale-105" : "hover:scale-105"
              }`}
              onClick={() => toggleOutfit(o)}
            >
              <img
                src={o.image}
                alt={o.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-center p-2">
                {o.name}
              </div>
              {isSelected && (
                <Check
                  size={24}
                  className="absolute top-1 right-1 text-emerald-500 bg-white rounded-full p-0.5"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Outfit Input */}
      <div className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Add custom outfit"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addCustomOutfit}
          className="px-4 py-2 bg-emerald-600 font-semibold hover:bg-emerald-800 text-black rounded-full"
        >
          Add
        </button>
      </div>

      {/* Selected Outfits */}
      <div className="mt-6 space-y-3">
        {selected.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-white p-4 border rounded">
            <div>
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                className="border p-1 w-16"
                value={item.quantity}
                onChange={(e) => updateQty(i, Number(e.target.value))}
              />
              <button onClick={() => remove(i)} className="text-sm text-red-600">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={next}
        className="mt-6 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition"
      >
        Continue
      </button>
    </div>
  );
}
