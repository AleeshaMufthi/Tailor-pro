import { Request, Response } from "express";
import User  from "../models/User";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId).select("-otp -otpExpires");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name || "",
        isProfileCompleted: user.isProfileCompleted,
        fullName: user.fullName || "",
        shopName: user.shopName || "",
        tailorType: user.tailorType || "",
        userPhoto: user.userPhoto || "",
        shopPhoto: user.shopPhoto || "",
        phone: user.phone || "",
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const {
      fullName,
      shopName,
      tailorType,
      userPhoto,
      shopPhoto,
      phone,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        shopName,
        tailorType,
        userPhoto,
        shopPhoto,
        isProfileCompleted: true,
        phone,
      },
      { new: true }
    ).select("-otp -otpExpires");
    
    return res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId).select("-otp -otpExpires");

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};
