import mongoose from 'mongoose'

const borrowHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: {
      type: String,
      enum: ['borrowed', 'returned'],
      default: 'borrowed',
    },
  },
  { timestamps: true },
)

const BorrowHistory = mongoose.model('BorrowHistory', borrowHistorySchema)

export default BorrowHistory
