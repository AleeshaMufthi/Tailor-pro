import mongoose, { Schema, Document } from "mongoose";

export interface IMeasurement extends Document {

  type?: string;

  values?: Map<string, string>;

  images?: string;

}

const measurementSchema = new Schema<IMeasurement>(
  {

  type: { type: String, required: true }, 

  values: { type: Map, of: String }, // key: measurement name, value: measurement e.g. "chest": "38"

  images: [{ url: String, publicId: String }], 

  },

  { timestamps: true }

);

export default mongoose.model<IMeasurement>("Measurement", measurementSchema);
