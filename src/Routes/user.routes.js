import express from 'express'
import {
  getUserProfile,
  googleSignup,
  login,
  signUp,
  updateUserProfile,
} from '../Controllers/user.controller.js'
import upload from '../Middlewares/upload.middleware.js'
import authMiddleware from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', upload.single('profileImage'), signUp)
router.post('/googleSignup', googleSignup)
router.post('/login', login)
router.get('/profile/:id', authMiddleware, getUserProfile)

router.put(
  '/updateProfile/:userId',
  authMiddleware,
  upload.single('profileImage'),
  updateUserProfile,
)

export default router
