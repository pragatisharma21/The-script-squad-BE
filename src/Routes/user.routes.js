import express from 'express'
import {
  addToCart,
  addToWishList,
  getMyBooks,
  getMyCart,
  getMyWishlist,
  getUserProfile,
  googleSignup,
  login,
  signUp,
  updateUserProfile,
} from '../Controllers/user.controller.js'
import { uploadProfileImage } from '../Middlewares/upload.middleware.js'
import { isAuthenticated } from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', uploadProfileImage, signUp)
router.post('/googleSignup', googleSignup)
router.post('/login', login)
router.get('/profile/:id', isAuthenticated, getUserProfile)
router.get('/myBooks', isAuthenticated, getMyBooks)
router.post('/add-to-cart/:userId/:bookId', isAuthenticated, addToCart)
router.post('/add-to-wishlist/:userId/:bookId', isAuthenticated, addToWishList)
router.get('/cart/:userId', isAuthenticated, getMyCart)
router.get('/wishlist/:userId', isAuthenticated, getMyWishlist)

router.put(
  '/updateProfile/:userId',
  isAuthenticated,
  uploadProfileImage,
  updateUserProfile,
)

export default router
