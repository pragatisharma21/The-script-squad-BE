import express from 'express'
import {
  getUserProfile,
  login,
  signUp,
} from '../Controllers/user.controller.js'
import upload from '../Middlewares/upload.middleware.js'

const router = express.Router()

router.post('/signup', upload.single('avatar'), signUp)
router.post('/login', login)
router.get('/profile/:id', getUserProfile)

export default router
