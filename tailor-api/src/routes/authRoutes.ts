import express, { response } from "express";
import { sendOtp, verifyOtp, resendOtp } from "../controllers/authController";
import { request } from "http";

const router = express.Router();

router.get("/send-otp", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS is working correctly 🚀",
    origin: req.headers.origin || "no-origin",
  });
});

// router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);


router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",   
    secure: false,   
    path: "/", 
  });
  return res.json({ message: "Logged out successfully" });
});



export default router;
