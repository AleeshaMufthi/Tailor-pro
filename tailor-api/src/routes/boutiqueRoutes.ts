import express from "express";
import { getMyBoutiques, switchBoutique, updateDailyOrderLimit, getActiveBoutique } from "../controllers/boutiqueController";
import { requireBoutique } from "../middleware/boutiqueMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/switch", authMiddleware, requireBoutique, switchBoutique);

router.get("/my-boutiques", authMiddleware, requireBoutique, getMyBoutiques);

router.put("/update-daily-limit", authMiddleware, requireBoutique, updateDailyOrderLimit);

router.get("/active", authMiddleware, getActiveBoutique);

export default router;