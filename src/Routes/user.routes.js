import express from 'express'
import {
  getMyBooks,
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

router.put(
  '/updateProfile/:userId',
  isAuthenticated,
  uploadProfileImage,
  updateUserProfile,
)

export default router
