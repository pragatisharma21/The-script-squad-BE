import User from '../Models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../Utils/jwtUtils.js'
import { OAuth2Client } from 'google-auth-library'
import {
  deleteFromImagekit,
  uploadToImagekit,
} from '../Utils/imagekit-service.js'
import Book from '../Models/books.model.js'
import { Payment } from '../Models/payment.model.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

let dummyProfile =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const isExistingUser = await User.findOne({ email })

    if (isExistingUser) {
      return res.status(400).json({ message: 'User already Registered' })
    }

    const hashedPass = await bcrypt.hash(password, 10)
    let uploadedFile = null

    if (req.file) {
      uploadedFile = await uploadToImagekit(req.file, 'profileImage')
    }

    const newUser = new User({
      name,
      email,
      password: hashedPass,
      isPasswordCreated: true,
      profileImage: uploadedFile ? uploadedFile.url : dummyProfile,
      fileId: uploadedFile ? uploadedFile.fileId : null,
    })

    await newUser.save()
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
        userType: 'DEFAULT',
      })
      user.save()
    }

    const jwtToken = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
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
      userType: isAvailable.userType,
    })

    res.status(200).json({ user: isAvailable, token: jwtToken })
  } catch (err) {
    next(err)
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId

    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || dummyProfile,
      fileId: user.fileId,
      googleId: user?.googleId,
      userType: user?.userType,
    }
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const { name, phoneNumber } = req.body

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
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.profileImage = newProfileImage.url
      ? newProfileImage.url
      : newProfileImage
    user.fileId = newProfileImage.fileId ? newProfileImage.fileId : user.fileId

    await user.save()

    res.status(200).json({ message: 'Profile updated successfully', user })
  } catch (err) {
    next(err)
  }
}

export const getMyBooks = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).populate('myBooks')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const myBooks = user.myBooks
    return res.status(200).json({ books: myBooks })
  } catch (err) {
    next(err)
  }
}

export const updateUserType = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.userType === 'DEFAULT' || user.userType === 'FLEET_PENDING') {
      user.userType = 'FLEET_ADMIN'
      await user.save()
      return res
        .status(200)
        .json({ message: 'User role updated to FLEET_ADMIN', user })
    } else {
      return res
        .status(400)
        .json({ message: 'User is already an admin or not in DEFAULT state' })
    }
  } catch (err) {
    next(err)
  }
}

export const addToCart = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    if (!user.myCart.includes(bookId)) {
      user.myCart.push(bookId)
      await user.save()
    }

    res.status(200).json({ message: 'Book added to cart', myCart: user.myCart })
  } catch (err) {
    next(err)
  }
}

export const removeFromCart = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    if (user.myCart.includes(bookId)) {
      user.myCart = user.myCart.filter((id) => id.toString() !== bookId)
      await user.save()
    } else {
      return res.status(400).json({ message: 'Book not in cart' })
    }

    res
      .status(200)
      .json({ message: 'Book removed from cart', myCart: user.myCart })
  } catch (err) {
    next(err)
  }
}

export const addToWishList = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    if (!user.myWishList.includes(bookId)) {
      user.myWishList.push(bookId)
      await user.save()
    }

    res
      .status(200)
      .json({ message: 'Book added to wishlist', myWishList: user.myWishList })
  } catch (err) {
    next(err)
  }
}

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    if (user.myWishList.includes(bookId)) {
      user.myWishList = user.myWishList.filter((id) => id.toString() !== bookId)
      await user.save()
    } else {
      return res.status(400).json({ message: 'Book not in wishlist' })
    }

    res.status(200).json({
      message: 'Book removed from wishlist',
      myWishList: user.myWishList,
    })
  } catch (err) {
    next(err)
  }
}

export const getMyCart = async (req, res, next) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).populate('myCart')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json({ myCart: user.myCart })
  } catch (err) {
    next(err)
  }
}

export const getMyWishlist = async (req, res, next) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).populate('myWishList')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json({ myWishList: user.myWishList })
  } catch (err) {
    next(err)
  }
}

export const getUserPayments = async (req, res, next) => {
  try {
    const userId = req.user.id

    if (!userId) {
      return res.status(404).json({ message: 'user not found' })
    }

    const paymentHistory = await Payment.find({ userId }).sort({
      createdAt: -1,
    })

    res.status(200).json({ paymentHistory })
  } catch (err) {
    next(err)
  }
}
