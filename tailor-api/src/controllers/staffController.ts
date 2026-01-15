import User from "../models/User";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export const addStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;

    const boutiqueId = (req as any).user.activeBoutique;
    console.log(boutiqueId)

    if (!boutiqueId) {
      return res.status(400).json({ message: "No active boutique selected" });
    }

    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const email = req.body.email?.toLowerCase().trim();
    const { name, phone } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const staff = await User.create({
      email,
      name,
      phone,
      role: "staff",
      createdBy: ownerId,
      boutique: boutiqueId,
      isProfileCompleted: false,
    });

    console.log("Created staff:", staff);

    res.json({
      message: "Staff created",
      staff: {
        id: staff._id,
        email: staff.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;

    const boutiqueId = (req as any).user.activeBoutique;

    if (!boutiqueId) {
      return res.status(400).json({ message: "No active boutique selected" });
    }

    const staff = await User.find({
      role: "staff",
      boutique: boutiqueId,
      createdBy: ownerId, 
    }).select("phone email");

    console.log("Fetched staff:", staff);

    res.json({ staff });
  } catch {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};