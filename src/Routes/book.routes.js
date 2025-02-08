import express from 'express'
import { addBook, searchBooks, updateBook, deleteBookById } from '../Controllers/book.controller.js'
import upload from '../Middlewares/upload.middleware.js';

const router = express.Router()

router.post('/add', upload.single('coverImage'), addBook);
router.get('/search', searchBooks);
router.put('/update/:id', upload.single('coverImage'), updateBook);
router.delete('/delete/:id', deleteBookById);

export default router
