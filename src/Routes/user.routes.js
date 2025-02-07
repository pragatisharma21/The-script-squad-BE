import express from 'express'
import {
  getUserProfile,
  googleSignup,
  login,
  signUp,
  updateUserProfile,
} from '../Controllers/user.controller.js'
import upload from '../Middlewares/upload.middleware.js'

const router = express.Router()

router.post('/signup', upload.single('profileImage'), signUp)
router.post('/googleSignup', googleSignup)
router.post('/login', login)
router.get('/profile/:id', getUserProfile)

router.put('/updateProfile/:userId', upload.single('profileImage'), updateUserProfile)

export default router
