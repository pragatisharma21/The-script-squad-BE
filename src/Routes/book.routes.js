import express from 'express'
import {
  addBook,
  searchBooks,
  updateBook,
  deleteBookById,
  getPaginatedBooks,
} from '../Controllers/book.controller.js'
import {
  uploadBookFiles,
  uploadCoverImage,
} from '../Middlewares/upload.middleware.js'
import { isAuthenticated, isFleetAdmin } from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/add', isFleetAdmin, uploadBookFiles, addBook)
router.get('/search', isAuthenticated, searchBooks)
router.put('/update/:id', isFleetAdmin, uploadCoverImage, updateBook)
router.delete('/delete/:id', isFleetAdmin, deleteBookById)
router.get('/allBooks', isAuthenticated, getPaginatedBooks)

export default router
