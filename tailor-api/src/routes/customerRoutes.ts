import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createCustomer, getCustomerById, getCustomers, getOrdersByCustomer } from "../controllers/customerController";

const router = express.Router()

router.post("/create", createCustomer);

router.get("/", getCustomers);

router.get("/:id", getCustomerById);

router.get("/:id/orders", getOrdersByCustomer);

export default router