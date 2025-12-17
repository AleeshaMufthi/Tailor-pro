import User from "../models/User";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export const addStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;

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
      name,
      email,
      phone,
      role: "staff",
      password: hashedPassword,
      createdBy: ownerId, // ✅ CRITICAL
      isProfileCompleted: false,
    });

    res.json({
      message: "Staff created",
      staff: {
        id: staff._id,
        name: staff.name,
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

    const staff = await User.find({
      role: "staff",
      createdBy: ownerId, // recommended
    }).select("name email");

    console.log("Fetched staff:", staff);

    res.json({ staff });
  } catch {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};