import express from "express";
import { createOrder, getFleetAdminPayments, verifyPayment } from "../Controllers/payment.controller.js";
import { isAuthenticated, isSuperAdmin } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-order", isAuthenticated,  createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/fleet-admin-payments", isSuperAdmin,  getFleetAdminPayments); 

export default router;
