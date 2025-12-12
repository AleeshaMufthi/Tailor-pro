"use client";
import { createContext, useContext, useState } from "react";

interface OutfitItem {
  name: string;
  quantity: number;
}

interface OrderData {
  customerId: string;
  outfits: OutfitItem[];
  type: string;
  notes: string;
  audioUrl: File | null;
  inspirationLink: string;
  referenceImages: File[];
  totalAmount: number;
  advanceGiven: number;
  balance: number;
  deliveryDate: string;
  trialDate: string;
  measurements: any;
  stitchOptions: any;
}

const defaultValue: OrderData = {
  customerId: "",
  outfits: [],
  type: "",
  notes: "",
  audioUrl: null,
  inspirationLink: "",
  referenceImages: [],
  totalAmount: 0,
  advanceGiven: 0,
  balance: 0,
  deliveryDate: "",
  trialDate: "",
  measurements: {},
  stitchOptions: {},
};

const OrderContext = createContext<any>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    
  const [orderData, setOrderData] = useState<OrderData>(defaultValue);

  return (
    <OrderContext.Provider value={{ orderData, setOrderData }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);

