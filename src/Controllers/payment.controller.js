import crypto from 'crypto'
import { Payment } from '../Models/payment.model.js'
import User from '../Models/user.model.js'
import { razorpayInstance } from '../Config/razorpay.js'

export const createOrder = async (req, res, next) => {
  try {
    const { userId, totalAmount, books, paymentType } = req.body
    if (!userId || !totalAmount || !paymentType) {
      return res.status(400).json({ error: 'Invalid data' })
    }

    if (paymentType === 'BOOK_PURCHASE' && (!books || books.length === 0)) {
      return res.status(400).json({ error: 'Books required for purchase' })
    }

    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    }

    const order = await razorpayInstance.orders.create(options)

    res.json({ success: true, orderId: order.id })
  } catch (err) {
    next(err)
  }
}

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      books,
      totalAmount,
      paymentType,
    } = req.body

    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const payment = await Payment.create({
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: totalAmount,
      books: paymentType === 'BOOK_PURCHASE' ? books : [],
      paymentType,
      status: 'Success',
    })

    if (paymentType === 'BOOK_PURCHASE') {
      await User.findByIdAndUpdate(userId, {
        $push: { myBooks: { $each: books } },
      })
    }
    else{
      await User.findByIdAndUpdate(userId, {
        $set: {userType: "FLEET_PENDING"},
      })
    }

    res.json({ success: true, message: 'Payment successful', payment })
  } catch (err) {
    next(err)
  }
}

export const getFleetAdminPayments = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;


    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;


    const totalPayments = await Payment.countDocuments({
      paymentType: 'FLEET_ADMIN',
      status: 'Success',
    });

    const payments = await Payment.find({
      paymentType: 'FLEET_ADMIN',
      status: 'Success',
    })
      .populate('userId', 'name email userType')
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      totalPayments,
      totalPages: Math.ceil(totalPayments / limit),
      currentPage: page,
      payments,
    });
  } catch (err) {
    next(err);
  }
};

