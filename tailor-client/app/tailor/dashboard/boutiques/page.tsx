"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/app/context/AuthContext";

export default function BoutiqueSettingsPage() {
  const { user, setUser } = useAuth();
  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [dailyOrderLimit, setDailyOrderLimit] = useState<number>(15);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);


  const saveLimit = async () => {
  try {
    await api.put("/api/boutique/update-daily-limit", {
      dailyOrderLimit,
    });

    alert("Daily order limit updated");
  } catch (err) {
    alert("Failed to update limit");
  }
};

  useEffect(() => {
    api.get("/api/boutique/my-boutiques").then(res => {
      setBoutiques(res.data);
      console.log(res.data, 'boutiques fetched');
    });
  }, []);


  const switchBoutique = async (id: string) => {
    const res = await api.post("/api/boutique/switch", {
      boutiqueId: id,
    });
    window.location.reload();
    setUser(res.data.user);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-start justify-start mb-6">
            <h1 className="text-3xl font-bold text-emerald-700 mb-6 ">Boutique Settings</h1>
            <p className="text-gray-600 font-semibold">This page lets you manage multiple boutiques under your account.</p>
            </div>

<label className="block text-gray-700 font-semibold mb-2">
  Maximum orders per day
</label>

<input
  type="number"
  min={1}
  className="border rounded-lg p-2 w-full mb-4"
  value={dailyOrderLimit}
  onChange={(e) => setDailyOrderLimit(Number(e.target.value))}
/>

<button
  onClick={saveLimit}
  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold"
>
  Save
</button>

      <h2 className="text-2xl font-bold text-emerald-700 my-6">My Boutiques</h2>
      {boutiques.map((b) => (
        <div
          key={b._id}
          className="flex justify-between items-center p-4  rounded-lg border border-emerald-600 mb-3"
        >
          <span className="font-semibold text-lg">{b.name}</span>

          {user?.activeBoutique === b._id ? (
            <div>
            <p className="text-gray-800 font-semibold mb-6">The active boutique will be used across your dashboard.</p>
            <span className="text-gray-900 font-semibold bg-green-500 py-3 px-6 text-lg rounded-full">Active</span>
            </div>
           
          ) : (
            <div>
              <p className="text-gray-800 font-semibold mb-4">Switch between Boutiques to manage their settings.</p>
            <button
              onClick={() => switchBoutique(b._id)}
              className="bg-blue-500 text-gray-900 font-semibold py-3 px-6 text-lg rounded-full"
            >
              Switch
            </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
