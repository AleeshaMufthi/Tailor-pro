import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUser, updateProfile, getUserProfile } from "../controllers/userController";

const router = express.Router()

router.get("/get-user", authMiddleware, getUser);

router.put("/profile", authMiddleware, updateProfile);

router.get("/get-profile", authMiddleware, getUserProfile);

export default router