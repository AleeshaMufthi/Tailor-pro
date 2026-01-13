import User from "../models/User";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export const addStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;

    const boutiqueId = (req as any).user.activeBoutique;

    if (!boutiqueId) {
      return res.status(400).json({ message: "No active boutique selected" });
   }

    const owner = await User.findById(ownerId);

    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { email, name, phone } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const tempPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const staff = await User.create({
      email,
      phone,
      role: "staff",
      password: hashedPassword,
      createdBy: ownerId,
      boutique: boutiqueId,
      isProfileCompleted: false,
    });

    res.json({
      message: "Staff created",
      staff: {
        id: staff._id,
        email: staff.email,
      },
      tempPassword,
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
    }).select("name email");

    console.log("Fetched staff:", staff);

    res.json({ staff });
  } catch {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};