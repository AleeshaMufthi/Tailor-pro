import { Request, Response } from "express";
import Outfit from "../models/Outfit";


export const createOutfit = async (req: Request, res: Response) => {
  try {
    const { name, image } = req.body;
    const userId = (req as any).user.userId;

    if (!name) {
      return res.status(400).json({ message: "Outfit name is required" });
    }

    const outfit = await Outfit.create({
      name,
      image,
      createdBy: userId,
      isDefault: false,
    });

    return res.status(201).json(outfit);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create outfit" });
  }
};


export const getOutfit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const outfits = await Outfit.find({
      $or: [
        { isDefault: true },
        { createdBy: userId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(outfits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch outfits" });
  }
};

