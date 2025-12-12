import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User  from "../models/User";
import { OAuth2Client } from "google-auth-library";
import { generateOTP } from "../utils/otpGenerator";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
// import { sendEmail } from "../utils/emailService";

// sendOtp
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const rawEmail = req.body.email;
    const email = rawEmail?.toLowerCase().trim();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    // TODO: send email here via email service
    // await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendOtp error:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};


export const verifyOtp = async (req: Request, res: Response) => {
  
  try {
    console.log('ivde vanno')
    const { email: rawEmail, otp: rawOtp } = req.body;
    const email = rawEmail?.toString().toLowerCase().trim();
    const otp = rawOtp?.toString().trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const payload = { userId: user._id.toString(), email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Set HttpOnly refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        isProfileCompleted: user.isProfileCompleted
      },
    });
  } catch (error: any) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

// resendOtp
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    console.log("Generated resend OTP:", otp);

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    // TODO: send email here
    // await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);

    return res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};

