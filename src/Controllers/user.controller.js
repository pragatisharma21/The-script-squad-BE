import User from '../Models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../Utils/jwtUtils.js'
import { OAuth2Client } from 'google-auth-library'
import {
  deleteFromImagekit,
  uploadToImagekit,
} from '../Utils/imagekit-service.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

let dummyProfile =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const isExistingUser = await User.findOne({ email })

    if (isExistingUser) {
      res.status(400).json({ message: 'User already Registered' })
    }

    const hashedPass = await bcrypt.hash(password, 10)

    let uploadedFile = null

    if (req.file) {
      uploadedFile = await uploadToImagekit(req.file)
    }

    const newUser = new User({
      name,
      email,
      password: hashedPass,
      profileImage: uploadedFile ? uploadedFile.url : dummyProfile,
      fileId: uploadedFile.fileId,
    })
    newUser.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    next(err)
  }
}

export const googleSignup = async (req, res, next) => {
  try {
    const { token } = req.body

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const { name, email, picture, sub } = ticket.getPayload()

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImage: picture,
        fileId: null,
        googleId: sub,
        password: null,
      })
    }

    const jwtToken = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
    })

    res.status(200).json({ user, token: jwtToken })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const isAvailable = await User.findOne({ email })

    if (!isAvailable) {
      return res.status(404).json({ message: 'user is not found' })
    }

    const isValidPassword = bcrypt.compare(password, isAvailable.password)

    if (!isValidPassword) {
      res.status(400).json({ message: 'incorrect credentials' })
    }

    const jwtToken = generateToken({
      id: isAvailable._id,
      name: isAvailable.name,
      email: isAvailable.email,
    })

    res.status(200).json({ user: isAvailable, token: jwtToken })
  } catch (err) {
    next(err)
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const data = {
      _id : user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      fileId: user.fileId,
      googleId: user?.googleId
    }
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const { name, email } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    let newProfileImage = user.profileImage
    let oldImage = { url: user.profileImage, fileId: user.fileId }

    if (req.file) {
      await deleteFromImagekit(oldImage)
      newProfileImage = await uploadToImagekit(req.file, 'profileImage')
    }

    user.name = name || user.name
    user.email = email || user.email
    user.profileImage = newProfileImage.url
    user.fileId = newProfileImage.fileId

    await user.save()

    res.status(200).json({ message: 'Profile updated successfully', user })
  } catch (err) {
    next(err)
  }
}
