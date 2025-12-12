import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createCustomer, getCustomerById, getCustomers } from "../controllers/customerController";

const router = express.Router()

router.post("/create", createCustomer);

router.get("/", getCustomers);

router.get("/:id", getCustomerById);

export default router