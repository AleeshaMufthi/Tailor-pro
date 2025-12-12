"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useOrder } from "@/app/context/OrderContext";
import { useState } from "react";

const availableOutfits = [
  "Shirt",
  "Pant",
  "Kurtha",
  "Blouse",
  "Churidar",
  "Coat",
];

export default function SelectOutfitsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const customerId = params.get("customerId") || "";

  const { setOrderData } = useOrder();
  const [selected, setSelected] = useState<any[]>([]);

  const addOutfit = (name: string) => {
    setSelected([...selected, { name, quantity: 1 }]);
  };

  const updateQty = (index: number, qty: number) => {
    const updated = [...selected];
    updated[index].quantity = qty;
    setSelected(updated);
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
      <h1 className="text-xl font-semibold">Select Outfits</h1>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {availableOutfits.map((o) => (
          <button
            key={o}
            onClick={() => addOutfit(o)}
            className="p-3 bg-gray-200 rounded"
          >
            {o}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {selected.map((item, i) => (
          <div key={i} className="flex justify-between bg-white p-4 border rounded">
            <span>{item.name}</span>
            <input
              type="number"
              min={1}
              className="border p-1 w-20"
              value={item.quantity}
              onChange={(e) => updateQty(i, Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      <button
        onClick={next}
        className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded"
      >
        Next: Order Details
      </button>
    </div>
  );
}

