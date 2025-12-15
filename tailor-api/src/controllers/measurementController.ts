import Measurement from "../models/Measurement";
import { Request, Response } from "express";

export const createMeasurements = async (req: Request, res: Response) => {
  try {
    const measurement = await Measurement.create(req.body);
    res.status(201).json(measurement);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
