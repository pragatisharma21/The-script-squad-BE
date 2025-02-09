import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    isPasswordCreated: { type: Boolean, default: false },
    googleId: { type: String, sparse: true, default: null},
    phoneNumber: { type: String },
    userType: {
      type: String,
      enum: ['DEFAULT', 'FLEET_PENDING', 'FLEET_ADMIN', 'ADMIN'],
      default: 'DEFAULT',
    },
    profileImage: { type: String },
    myBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    myCart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    myWishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    fileId: { type: String },
    readingPreferences: [{ type: String }],
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

export default User
