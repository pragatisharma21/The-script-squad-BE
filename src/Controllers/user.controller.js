import User from '../Models/user.model.js'

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

    let fileUrl = null

    if (req.file) {
      fileUrl = await uploadToIMagekit(req.file)
    }

    const newUser = new User({
      name,
      email,
      password: hashedPass,
      avatar: fileUrl ? fileUrl : dummyProfile,
    })
    newUser.save()
    res.status(201).json({ message: 'User created successfully' })
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

    const token = jwt.sign(
      {
        id: isAvailable._id,
        username: isAvailable.name,
        email: isAvailable.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    res.status(200).json({ token })
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
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}
