import Review from '../Models/review.model.js'

export const getReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params
    let { page = 1, limit = 10 } = req.query

    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit

    const reviews = await Review.find({ bookId })
      .populate('userId', 'name profileImage')
      .select('userId reviewText rating createdAt updatedAt')
      .skip(skip)
      .limit(limit)
      .exec()

    const totalReviews = await Review.countDocuments({ bookId })

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      hasMore: skip + reviews.length < totalReviews,
    })
  } catch (err) {
    next(err)
  }
}

export const postReview = async (req, res, next) => {
  try {
    const { bookId, userId, reviewText, rating } = req.body

    const existingReview = await Review.findOne({ bookId, userId })
    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this book' })
    }

    const newReview = new Review({ bookId, userId, reviewText, rating })
    await newReview.save()

    res.status(201).json({ newReview, message: 'Review created' })
  } catch (err) {
    next(err)
  }
}

export const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params
    const { userId, reviewText, rating } = req.body

    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, userId },
      { reviewText, rating },
      { new: true },
    )

    if (!updatedReview) {
      return next('Review not found or you are not authorized to update it.')
    }

    res.status(200).json(updatedReview)
  } catch (err) {
    next(err)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params
    const { userId } = req.body

    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
      userId,
    })

    if (!deletedReview) {
      return next('Review not found or unauthorized deletion')
    }

    res.status(200).json({ message: 'Review deleted successfully' })
  } catch (err) {
    next(err)
  }
}
