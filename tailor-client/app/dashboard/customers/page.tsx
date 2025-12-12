"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddCustomerModal from "@/components/customers/AddCustomerModal";

export default function SelectCustomerPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const gotoOutfitSelection = (customerId: string) => {
    console.log("Selected Customer:", customerId);

    router.push(
      `/dashboard/orders/create/select-outfits?customerId=${customerId}`
    );
  };

  console.log("Customers data:", customers);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Select Customer</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700"
        >
          + Add Customer
        </button>
      </div>

      {/* Add Customer Modal */}
      {openModal && (
        <AddCustomerModal 
          close={() => setOpenModal(false)} 
          refresh={fetchCustomers}
        />
      )}

      {/* Loading */}
      {loading && <p>Loading customers...</p>}

      {/* Customer List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
        <div
  key={c._id}
  className="p-4 rounded-lg bg-white shadow hover:shadow-md border"
>
  <h2 className="font-bold text-lg">{c.name}</h2>
  <p className="text-sm text-gray-600">{c.phone}</p>
  <p className="text-sm text-gray-600">{c.city}, {c.state}</p>

  <div className="flex justify-between mt-4">
    
    <button
      onClick={() => gotoOutfitSelection(c._id)}
      className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
    >
      Select
    </button>

    <Link
      href={`/dashboard/customers/${c._id}`}
      className="px-3 py-1 bg-gray-200 rounded text-sm"
    >
      View Details
    </Link>

  </div>
</div>

        ))}
      </div>
    </div>
  );
}
