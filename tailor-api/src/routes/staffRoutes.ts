import express from "express";
import { addStaff, getStaff } from "../controllers/staffController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add", authMiddleware, addStaff);
router.get("/get", authMiddleware, getStaff);

export default router;