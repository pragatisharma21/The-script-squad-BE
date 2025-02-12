import express from 'express'
import {
  addToCart,
  addToWishList,
  removeFromCart, // Import removeFromCart controller
  removeFromWishlist, // Import removeFromWishlist controller
  getMyBooks,
  getMyCart,
  getMyWishlist,
  getUserProfile,
  googleSignup,
  login,
  signUp,
  updateUserProfile,
  getUserPayments,
} from '../Controllers/user.controller.js'
import { uploadProfileImage } from '../Middlewares/upload.middleware.js'
import {
  isAuthenticated,
  isFleetAdmin,
} from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', uploadProfileImage, signUp)
router.post('/googleSignup', googleSignup)
router.post('/login', login)
router.get('/profile/:userId', getUserProfile)
router.get('/myBooks', isAuthenticated, getMyBooks)
router.post('/add-to-cart/:userId/:bookId', isAuthenticated, addToCart)
router.post('/add-to-wishlist/:userId/:bookId', isAuthenticated, addToWishList)
router.get('/cart/:userId', isAuthenticated, getMyCart)
router.get('/wishlist/:userId', isAuthenticated, getMyWishlist)

router.post(
  '/remove-from-cart/:userId/:bookId',
  isAuthenticated,
  removeFromCart,
)
router.post(
  '/remove-from-wishlist/:userId/:bookId',
  isAuthenticated,
  removeFromWishlist,
)
router.get('/getUserPayment', isAuthenticated, getUserPayments)

router.put(
  '/updateProfile/:userId',
  isAuthenticated,
  uploadProfileImage,
  updateUserProfile,
)

export default router
