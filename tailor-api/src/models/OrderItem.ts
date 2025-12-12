import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem extends Document {

    name?: string;

    category?: string;

    quantity?: number;

    type?: "stitching" | "alteration";

    inspirationLink?: string;

    audioUrl?: string;

    specialInstructions?: string;

    referenceImages?: string;

    measurements?: mongoose.Schema.Types.ObjectId;

    stitchOptions?: Map<string, string>;

    stitchingPrice?: number;

    additionalPrice?: number;

    status?: "accepted" | "cutting" | "stitching" | "finishing" | "completed";

}

const orderitemSchema = new Schema<IOrderItem>(

{

  name: { type: String, required: true }, 

  category: String,

  quantity: { type: Number, default: 1 },

  type: { type: String, enum: ["stitching","alteration"], default: "stitching" },

  inspirationLink: String,

  audioUrl: String,

  specialInstructions: String,

  referenceImages: [{ url: String, publicId: String }],

  measurements: { type: mongoose.Schema.Types.ObjectId, ref: "Measurement" },

  stitchOptions: { type: Map, of: String }, 

  stitchingPrice: { type: Number, default: 0 },

  additionalPrice: { type: Number, default: 0 }, 

  status: { type: String, enum: ["accepted","cutting","stitching","finishing","completed"], default: "accepted" },
  
},
  { timestamps: true }
);

export default mongoose.model<IOrderItem>("OrderItem", orderitemSchema);
