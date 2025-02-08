import express from 'express'
import {
  getReviews,
  postReview,
  updateReview,
  deleteReview,
} from '../Controllers/review.controller.js'
import { isAuthenticated } from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.get('/:bookId', isAuthenticated, getReviews)
router.post('/', isAuthenticated, postReview)
router.put('/:reviewId', isAuthenticated, updateReview)
router.delete('/:reviewId', isAuthenticated, deleteReview)

export default router
