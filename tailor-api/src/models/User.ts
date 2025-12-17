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

  role?: "owner" | "staff";

  password?: string; // add this
createdBy?: mongoose.Schema.Types.ObjectId;

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

    role: {
  type: String,
  enum: ["owner", "staff"],
  default: "owner" // the first registered user will be owner
},

password: {
  type: String,
  select: false, // security
},

createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},


  },

  { timestamps: true }

);

export default mongoose.model<IUser>("User", userSchema);
