import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true },
    phoneNumber: { type: String },
    userType: {
      type: String,
      enum: ['DEFAULT', 'FLEET_ADMIN', 'ADMIN'],
      default: 'DEFAULT',
    },
    profileImage: { type: String },
    myBooks: { type: [] },
    fileId: { type: String },
    readingPreferences: [{ type: String }],
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

export default User
