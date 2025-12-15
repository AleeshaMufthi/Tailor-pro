"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CustomerDetailsPage() {
    
  const params = useParams();
  const customerId = params?.id as string | undefined;
  console.log("CustomerDetailsPage received customerId:", customerId);

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      console.log("Fetching details for customer ID:", customerId);
      const res = await api.get(`/api/customers/${customerId}`);
      console.log("Fetched customer data:", res.data);
      setCustomer(res.data);
    } catch (err) {
      console.error("Failed to fetch customer details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  if (loading) return <p className="p-6">Loading customer details…</p>;

  if (!customer)
    return <p className="p-6 text-red-500">Customer not found.</p>;

  console.log("Customer data:", customer);

  return (
    <div className="p-6">

             <Link href="/dashboard/customers" className="text-gray-600 flex items-center gap-1 mb-4">
        <ChevronLeft size={20} />
        Back to Customers
      </Link>

      <h1 className="text-2xl font-semibold mb-4">Customer Details</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-3">

        <p><strong>Customer Name:</strong> {customer.name}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Address:</strong> {customer.address}</p>
        <p><strong>City:</strong> {customer.city}</p>
        <p><strong>State:</strong> {customer.state}</p>
        <p><strong>Postal Code:</strong> {customer.postalCode}</p>
        <p><strong>Gender:</strong> {customer.gender}</p>

      </div>
    </div>
  );
}
