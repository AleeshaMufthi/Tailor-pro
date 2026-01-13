"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/app/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    userPhoto: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        userPhoto: user.userPhoto || "",
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let photoUrl = form.userPhoto;

      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }

      const res = await api.put("/api/user/profile", {
        fullName: form.fullName,
        phone: form.phone,
        userPhoto: photoUrl,
      });

      setUser(res.data.user);
      setPreview(null);
      setPhotoFile(null);
    } catch {
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <div className="mb-4">
        <img
          src={preview || form.userPhoto || "/default.png"}
          className="h-24 w-24 rounded object-cover mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPhotoFile(file || null);
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 rounded"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
