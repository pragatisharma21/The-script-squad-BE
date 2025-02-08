import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    pdfFileId: { type: String },
    coverImage: { type: String, required: true },
    coverImageFileId: { type: String },
    genre: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        commentText: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
)

bookSchema.virtual('rating').get(function () {
  if (this.reviews.length === 0) return 0
  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  )
  return totalRating / this.reviews.length
})

const Book = mongoose.model('Book', bookSchema)

export default Book
