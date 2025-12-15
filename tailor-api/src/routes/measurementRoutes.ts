import { createMeasurements } from "../controllers/measurementController";
import express from "express";

const router = express.Router()

router.post("/create", createMeasurements);

export default router