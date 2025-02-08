import express from 'express'
import {
  getReviews,
  postReview,
  updateReview,
  deleteReview,
} from '../Controllers/review.controller.js'
import authMiddleware from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.get('/:bookId', authMiddleware, getReviews)
router.post('/', authMiddleware, postReview)
router.put('/:reviewId', authMiddleware, updateReview)
router.delete('/:reviewId', authMiddleware, deleteReview)

export default router
