// app/context/OrderContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

export interface OutfitItem {
  name: string;
  quantity: number;

  category?: string;
  type?: "stitching" | "alteration";

  stitchingPrice?: number;
  additionalPrice?: number;

  trialDate?: string;      
  deliveryDate?: string;   

  inspirationLink?: string;
  audioUrl?: string;
  referenceImages?: string[];
  specialInstructions?: string;

  measurements?: any;
  stitchOptions?: any;
}


export interface OrderData {
  customerId: string;
  outfits: OutfitItem[];
  type: string; 
  category?: string;
  notes: string; 
  audioUrl: string;
  inspirationLink: string;
  referenceImages: string[]; 
  totalAmount: number;
  advanceGiven: number;
  balance: number;
  deliveryDate: string;
  trialDate: string;
  measurements: Record<string, any>;
  stitchOptions: Record<string, any>;
}

const defaultValue: OrderData = {
  customerId: "",
  outfits: [],
  type: "",
  category: "",
  notes: "",
  audioUrl: "",
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

const OrderContext = createContext<{
  orderData: OrderData;
  setOrderData: React.Dispatch<React.SetStateAction<OrderData>>;
} | null>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orderData, setOrderData] = useState<OrderData>(defaultValue);

  return <OrderContext.Provider value={{ orderData, setOrderData }}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx; // <-- previously missing return
};
