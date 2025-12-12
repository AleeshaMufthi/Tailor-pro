import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {

  email: string;

  phone?: string;

  name?: string;

  address?: string;

  city?: string;

  state?: string;

  postalCode?: string;

  gender?: "male" | "female" | "other";

  notes?: string;

  createdAt: Date;

}

const customerSchema = new Schema<ICustomer>(

  {

  name: { type: String, required: true },

  phone: { type: String, required: true, index: true },

  email: { type: String },

  address: { type: String },

  city: { type: String },

  state: { type: String },

  postalCode: { type: String },

  gender: { type: String, enum: ["male","female","other"], default: "other" },

  notes: { type: String },

  createdAt: { type: Date, default: Date.now },

  },

  { timestamps: true }

);

export default mongoose.model<ICustomer>("Customer", customerSchema);


