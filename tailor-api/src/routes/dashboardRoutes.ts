import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

import { getDashboardSummary } from "../controllers/dashboardController";

const router = express.Router();

router.get("/summary", authMiddleware, requireBoutique, getDashboardSummary);

export default router;