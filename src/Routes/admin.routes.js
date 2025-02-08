import express from "express";
import { isSuperAdmin } from "../Middlewares/auth.middleware.js";
import { updateUserType } from "../Controllers/user.controller.js";
import { getFleetAdminPayments } from "../Controllers/payment.controller.js";

const router = express.Router();


router.patch('/updateType/:userId', isSuperAdmin, updateUserType)
router.get('/getFleetList', isSuperAdmin, getFleetAdminPayments)


export default router