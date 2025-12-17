'use client'
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function AddStaffPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [staffList, setStaffList] = useState<any[]>([]);
const [lastCreatedPassword, setLastCreatedPassword] = useState<string | null>(null);


useEffect(() => {
  fetchStaff();
}, []);

const fetchStaff = async () => {
  const res = await api.get("/api/staff");
  setStaffList(res.data.staff);
};


const handleSubmit = async () => {
  if (!email) return alert("Email required");

  try {
    const res = await api.post("/api/staff/add", { email, name, phone });

    setLastCreatedPassword(res.data.tempPassword);
    setEmail("");
    setName("");
    setPhone("");

    fetchStaff(); // ✅ refresh list
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to create staff");
  }
};



  return (
    <>
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Add Staff / Tailor</h2>
      <input type="text" placeholder="Name" className="border p-2 w-full" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Email" className="border p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="text" placeholder="Phone" className="border p-2 w-full" value={phone} onChange={e => setPhone(e.target.value)} />
      <button onClick={handleSubmit} className="bg-emerald-600 text-white px-4 py-2 rounded">Add Staff</button>
    </div>
    {lastCreatedPassword && (
  <div className="bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
    <p className="font-semibold">Temporary Password</p>
    <p className="text-lg font-mono">{lastCreatedPassword}</p>
    <p className="text-xs text-gray-600">
      Share this with the staff. They should change it after login.
    </p>
  </div>
)}

{/* <div className="mt-6">
  <h2 className="text-lg font-semibold mb-2">Staff Members</h2>

  <table className="w-full border rounded">
    <thead className="bg-gray-100">
      <tr>
        <th className="text-left p-2">Name</th>
        <th className="text-left p-2">Email</th>
      </tr>
    </thead>
    <tbody>
      {staffList.map((staff) => (
        <tr key={staff._id} className="border-t">
          <td className="p-2">{staff.name}</td>
          <td className="p-2">{staff.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div> */}

</>
  );
}
