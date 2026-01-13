import express from "express";
import { addStaff, getStaff } from "../controllers/staffController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router();

router.post("/add", authMiddleware, requireBoutique, addStaff);
router.get("/get", authMiddleware, requireBoutique, getStaff);

export default router;