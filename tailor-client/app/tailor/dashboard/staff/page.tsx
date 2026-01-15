"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function StaffPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/api/staff/get");
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.error("Failed to fetch staff");
    }
  };

  const handleAddStaff = async () => {
    if (!email) return alert("Email required");

    try {
      setLoading(true);
      await api.post("/api/staff/add", { email, name, phone });
      setEmail("");
      setName("");
      setPhone("");
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="text-xl font-bold">Add Staff</h2>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleAddStaff}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Staff"}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Staff Members</h3>

        {staffList.length === 0 ? (
          <p className="text-gray-500">No staff added yet</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{s.email}</td>
                  <td className="p-2">{s.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
