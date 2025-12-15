"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OrderDetails() {

  const [amountReceived, setAmountReceived] = useState("");


  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

    useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const res = await api.get(`/api/orders/${id}`);
    console.log("Fetched order:", res);
    setOrder(res.data.order);
  };

  const updateOutfitStatus = async (itemId: string, status: string) => {
    await api.patch(`/api/order-items/${itemId}/status`, { status });
    fetchOrder();
  };

  const handleReceivePayment = async () => {
  if (!amountReceived) return; // if nothing entered, do nothing

  await api.patch(`/api/orders/${order._id}/receive-payment`, {
    amount: Number(amountReceived),
  });

  setAmountReceived("");
  fetchOrder(); // refresh UI
};


  // const updateOrderStatus = async (status: string) => {
  //   await api.patch(`/api/orders/${id}/status`, { status });
  //   fetchOrder();
  // };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">

       <Link href="/dashboard/orders" className="text-gray-600 flex items-center gap-1">
  <ChevronLeft size={20} />
  Back to Orders
</Link>

      <div className="bg-white p-5 border rounded-lg shadow">
        <h1 className="font-bold text-2xl mb-2">Invoice</h1>
        <h2 className="font-bold text-lg mb-2">Order No: {order.orderNumber}</h2>

        <p>Customer: {order.customer?.name}</p>
        <p>Phone: {order.customer?.phone}</p>
        <p>Order Recieved Date: {order.createdAt}</p>

        <div className="bg-white p-5 rounded-lg border shadow space-y-4">

  <h1 className="font-bold text-2xl mb-2">Order Summary</h1>

  {/* ITEMS LIST */}
  <div className="space-y-2">
    <p className="font-semibold">Items ({order.items.length})</p>

    {order.items.map((item: any) => (
      <div 
        key={item._id} 
        className="border-b pb-2 flex justify-between"
      >
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          <p className="text-sm text-gray-600">Stitching: ₹{item.stitchingCost}</p>
        </div>

        <p className="text-sm text-gray-700">
          Delivery: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "-"}
        </p>
      </div>
    ))}
  </div>

  {/* PRICE SUMMARY */}
  <div className="pt-4 space-y-1">
    <p className="text-lg font-semibold">Total Amount: ₹{order.totalAmount}</p>
    <p className="text-lg">Advance: ₹{order.advanceAmount || 0}</p>
    <p className="text-lg font-semibold text-emerald-700">
      Balance: ₹{order.balanceDue}
    </p>
  </div>

  {/* RECEIVE BALANCE FORM */}
  <div className="pt-4">
    <p className="font-semibold mb-1">Receive Balance Due</p>

    <div className="flex gap-3">
      <input 
        type="number"
        placeholder="Enter amount received"
        className="border p-2 rounded w-48"
        value={amountReceived}
        onChange={(e) => setAmountReceived(e.target.value)}
      />

      <button
        onClick={handleReceivePayment}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        Confirm
      </button>
    </div>
  </div>

</div>


        {/* <select
          value={order.status}
          onChange={(e) => updateOrderStatus(e.target.value)}
          className="border p-2 rounded mt-3"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="upcoming">Upcoming</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="delivered">Delivered</option>
        </select> */}
      </div>

      {/* <div className="bg-white p-5 border rounded-lg shadow">
        <h3 className="font-semibold mb-3">Outfits</h3>

        {order.items.map((item: any) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b py-3"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>

            <select
              value={item.status}
              onChange={(e) =>
                updateOutfitStatus(item._id, e.target.value)
              }
              className="border p-2 rounded"
            >
              <option value="accepted">Accepted</option>
              <option value="cutting">Cutting</option>
              <option value="stitching">Stitching</option>
              <option value="finishing">Finishing</option>
              <option value="completed">Completed</option>
            </select>

          </div>
        ))}
      </div> */}
    </div>
  );
}
