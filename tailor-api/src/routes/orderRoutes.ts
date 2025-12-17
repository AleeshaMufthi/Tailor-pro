import express from "express";
import { createOrder, getAllOrders, updateOrderStatus, getOrderById, updateOutfitStatus, receivePayment, addExtraCharge } from "../controllers/orderController";

const router = express.Router()

router.post("/create", createOrder);

router.get("/all", getAllOrders);

router.patch("/:orderId/status", updateOrderStatus);

router.get("/:id", getOrderById);

router.patch("/:id/receive-payment", receivePayment); 

router.patch("/:id/add-extra-charge", addExtraCharge);


router.patch("/item/:itemId/status", updateOutfitStatus)

export default router