import mongoose, { Schema, Document } from "mongoose";

export interface IMeasurement extends Document {
  type?: string;
  values?: Map<string, string>;
  images?: {
    url: string;
    publicId: string;
  }[];
}

const measurementSchema = new Schema<IMeasurement>(
  {
    type: { type: String },

    values: {
      type: Map,
      of: String,
    },

    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IMeasurement>(
  "Measurement",
  measurementSchema
);
