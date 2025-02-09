import Book from '../Models/books.model.js'
import {
  deleteFromImagekit,
  uploadToImagekit,
} from '../Utils/imagekit-service.js'

export const addBook = async (req, res, next) => {
  try {
    const { title, author, description, genre, price } = req.body
    let coverImage = null,
      bookPdf = null

    if (!req.files || !req.files.coverImage || !req.files.bookPdf) {
      return res
        .status(400)
        .json({ message: 'Cover image and PDF are required' })
    }

    if (req.files.coverImage) {
      coverImage = await uploadToImagekit(req.files.coverImage[0], 'coverImage')
    }

    if (req.files.bookPdf) {
      bookPdf = await uploadToImagekit(req.files.bookPdf[0], 'bookPdf')
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Please login to add the book' })
    }

    const newBook = new Book({
      title,
      author,
      description,
      userId: req.user.id,
      pdfUrl: bookPdf.url,
      pdfFileId: bookPdf.fileId,
      coverImage: coverImage.url,
      coverImageFileId: coverImage.fileId,
      genre,
      price,
    })

    await newBook.save()
    res.status(201).json({ newBook, message: 'New book added successfully.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong' })
    next(err)
  }
}

export const searchBooks = async (req, res, next) => {
  try {
    const { title, genre, author } = req.query
    const query = {}

    if (title) query.title = { $regex: title, $options: 'i' }
    if (genre) query.genre = genre
    if (author) query.author = author

    const books = await Book.find(query).limit(50)
    res.status(200).json(books)
  } catch {
    next(err)
  }
}

export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, genre, description, price, author } = req.body

    const book = await Book.findById(id)
    if (!book) return res.status(404).json({ error: 'Book not found' })

    let newCoverImage = book.coverImage
    let oldCoverImage = { url: book.coverImage, fileId: book.coverImageFileId }

    if (req.file) {
      const uploadedImage = await uploadToImagekit(req.file, 'coverImage')
      newCoverImage = uploadedImage.url

      if (oldCoverImage.fileId) {
        await deleteFromImagekit(oldCoverImage)
      }

      book.coverImageFileId = uploadedImage.fileId
    }

    book.title = title || book.title
    book.genre = genre || book.genre
    book.coverImage = newCoverImage
    book.description = description || book.description
    book.price = price || book.price
    book.author = author || book.author

    await book.save()
    res.status(200).json({ message: 'Book updated successfully', book })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update book' })
    next(error)
  }
}

export const deleteBookById = async (req, res, next) => {
  try {
    const { id } = req.params
    const book = await Book.findById(id)

    if (!book) return res.status(404).json({ error: 'Book not found' })

    let coverImage = { url: book.coverImage, fileId: book.coverImageFileId }
    if (coverImage.fileId) {
      await deleteFromImagekit(coverImage)
    }

    let bookPdf = { url: book.pdfUrl, fileId: book.pdfFileId }
    if (bookPdf.fileId) {
      await deleteFromImagekit(bookPdf)
    }

    await Book.findByIdAndDelete(id)

    res.status(200).json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete book' })
    next(error)
  }
}

export const getPaginatedBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const books = await Book.find()
      .populate({
        path: 'reviews',
        select: 'rating',
      })
      .skip(skip)
      .limit(limit)
      .select('-pdfUrl')
      .lean()
      .exec()

    const totalBooks = await Book.countDocuments()

    const booksWithRatings = books.map((book) => {
      const totalRating = book.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      )
      const rating =
        book.reviews.length > 0 ? totalRating / book.reviews.length : 0

      return {
        ...book,
        rating: parseFloat(rating.toFixed(1)),
        reviewsCount: book.reviews.length,
      }
    })

    res.status(200).json({
      success: true,
      books: booksWithRatings,
      pagination: {
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
        currentPage: page,
      },
    })
  } catch (err) {
    next(err)
  }
}
