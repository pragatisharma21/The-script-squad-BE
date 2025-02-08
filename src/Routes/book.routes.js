import express from 'express'
import upload from '../Middlewares/upload.middleware.js'
import { addBook, searchBooks, updateBook, deleteBookById } from '../Controllers/book.controller.js'

const router = express.Router()

router.post('/add', addBook);
router.get('/search', searchBooks);
router.put('/update/:id', updateBook);
router.delete('/delete/:id', deleteBookById);

export default router
