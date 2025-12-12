import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {

  name?: string;

  email: string;

  phone?: string;

  isProfileCompleted: boolean;

  fullName?: string;

  shopName?: string;

  tailorType?: "gents" | "ladies" | "both";

  userPhoto?: string;

  shopPhoto?: string;

  otp?: string;
  
  otpExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: String,

    email: { type: String, required: true },

    phone: String,

    isProfileCompleted: { type: Boolean, default: false },

    fullName: String,

    shopName: String,

    tailorType: {
      type: String,
      enum: ["gents", "ladies", "both"],
    },

    userPhoto: String,

    shopPhoto: String,

    otp: String,

    otpExpires: Date,

  },

  { timestamps: true }

);

export default mongoose.model<IUser>("User", userSchema);
