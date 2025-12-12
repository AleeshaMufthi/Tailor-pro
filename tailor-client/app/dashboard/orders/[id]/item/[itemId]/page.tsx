"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

export default function OutfitDetailsPage() {
  const params = useParams();
  const orderId = params.id;
  const itemId = params.itemId;

  const [order, setOrder] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutfitDetails();
  }, []);

  const fetchOutfitDetails = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/api/orders/${orderId}`);
      const orderData = res.data.order;

      const foundItem = orderData.items?.find((i: any) => i._id === itemId);

      setOrder(orderData);
      setItem(foundItem);
    } catch (err) {
      console.error("Error fetching outfit details:", err);
    }

    setLoading(false);
  };

  const updateOutfitStatus = async (status: string) => {
    await api.patch(`/api/orders/item/${itemId}/status`, { status });
    fetchOutfitDetails();
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!item) return <p className="p-6 text-red-600">Outfit not found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700">
        Outfit Details — {item.name}
      </h1>

      {/* Order Info */}
      <div className="bg-white p-5 rounded-lg shadow border">
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Customer:</strong> {order.customer?.name}</p>
      </div>

      {/* Outfit Info */}
      <div className="bg-white p-5 rounded-lg shadow border space-y-4">

        <p><strong>Outfit Name:</strong> {item.name}</p>
        <p><strong>Quantity:</strong> {item.quantity}</p>

        {/* Update Status */}
        <div className="flex gap-3 items-center mt-2">
          <strong>Status:</strong>
          <select
            value={item.status}
            onChange={(e) => updateOutfitStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="accepted">Accepted</option>
            <option value="cutting">Cutting</option>
            <option value="stitching">Stitching</option>
            <option value="finishing">Finishing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <p><strong>Type:</strong> {item.type}</p>
        <p><strong>Stitching Price:</strong> ₹{item.stitchingPrice}</p>

        {/* Inspiration Link */}
        {item.inspirationLink && (
          <p>
            <strong>Inspiration Link:</strong>{" "}
            <a
              href={item.inspirationLink}
              target="_blank"
              className="text-blue-600 underline"
            >
              View Link
            </a>
          </p>
        )}

        {/* Audio */}
        {item.audioUrl && (
          <div>
            <strong>Audio Note:</strong>
            <audio controls className="mt-2 w-full">
              <source src={item.audioUrl} />
            </audio>
          </div>
        )}

        {/* Reference Images */}
        {item.referenceImages?.length > 0 && (
          <div>
            <strong>Reference Images:</strong>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {item.referenceImages.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  className="w-full h-32 object-cover rounded-md shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Special instructions */}
        {item.specialInstructions && (
          <p><strong>Special Instructions:</strong> {item.specialInstructions}</p>
        )}

        {/* Measurements */}
        {item.measurements && (
          <div>
            <h3 className="font-semibold mt-3">Measurements</h3>
            <ul className="ml-4 list-disc">
              {Object.entries(item.measurements).map(([key, val]) => (
                <li key={key}>
                  <strong>{key}:</strong> {val}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stitch Options */}
        {item.stitchOptions && Object.keys(item.stitchOptions).length > 0 && (
          <div>
            <h3 className="font-semibold mt-3">Stitch Options</h3>
            <ul className="ml-4 list-disc">
              {Object.entries(item.stitchOptions).map(([key, val]) => (
                <li key={key}>
                  <strong>{key}:</strong> {val.toString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
