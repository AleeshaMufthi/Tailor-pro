import express from "express"
import { createOutfit, getOutfit } from "../controllers/outfitController"
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router()

router.post("/create",authMiddleware, createOutfit);
router.get("/get", authMiddleware, getOutfit);

export default router