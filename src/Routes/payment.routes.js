import express from 'express'
import {
  createOrder,
  verifyPayment,
} from '../Controllers/payment.controller.js'
import { isAuthenticated } from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/create-order', isAuthenticated, createOrder)
router.post('/verify-payment', isAuthenticated, verifyPayment)

export default router
