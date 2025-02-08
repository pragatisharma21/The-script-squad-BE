import express from 'express'
import {
  getUserProfile,
  googleSignup,
  login,
  signUp,
  updateUserProfile,
} from '../Controllers/user.controller.js'
import upload from '../Middlewares/upload.middleware.js'
import { isAuthenticated } from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', upload.single('profileImage'), signUp)
router.post('/googleSignup', googleSignup)
router.post('/login', login)
router.get('/profile/:id', isAuthenticated, getUserProfile)

router.put(
  '/updateProfile/:userId',
  isAuthenticated,
  upload.single('profileImage'),
  updateUserProfile,
)

export default router
