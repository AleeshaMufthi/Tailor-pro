import express from "express";
import { createOrder, getAllOrders, updateOrderStatus, getOrderById, updateOutfitStatus, receivePayment, addExtraCharge, getOrdersCountByDate } from "../controllers/orderController";

const router = express.Router()

router.post("/create", createOrder);

router.get("/all", getAllOrders);

router.patch("/:orderId/status", updateOrderStatus);

router.get("/count-by-date", getOrdersCountByDate );

router.get("/:id", getOrderById);

router.patch("/:id/receive-payment", receivePayment); 

router.patch("/:id/add-extra-charge", addExtraCharge);

router.patch("/item/:itemId/status", updateOutfitStatus);

export default router