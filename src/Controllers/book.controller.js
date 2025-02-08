import Book from "../Models/books.model.js"
import { deleteFromImagekit, uploadToImagekit } from "../Utils/imagekit-service.js";

let dummyImage = "https://img.freepik.com/free-vector/blank-book-cover-white-vector-illustration_1284-41903.jpg?t=st=1738850444~exp=1738854044~hmac=14fe4ab743d8e3961edd500b97daff73b1f90f1613969cfc358b80277f385a75&w=740";


export const addBook = async (req, res, next) => {
    try {
        const { title, author, description, pdfUrl, genre } = req.body;
        let fileUrl = null;
        console.log(req.file);
        if (req.file)
            fileUrl = await uploadToImagekit(req.file);

        console.log(fileUrl);
        const newBook = new Book({
            title,
            author,
            description,
            pdfUrl,
            coverImage: fileUrl ? fileUrl.url : dummyImage,
            genre
        })
        await newBook.save();
        res.status(201).json({ message: 'New book added successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
        next(err);
    }
}

export const searchBooks = async (req, res, next) => {
    try {
        const { title, genre, author } = req.query;
        const query = {};

        if (title) query.title = { $regex: title, $options: 'i' };
        if (genre) query.genre = genre;
        if (author) query.author = author;

        const books = await Book.find(query).limit(50);
        res.status(200).json(books);
    } catch {
        next(err);
    }
}

export const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, genre, description } = req.body;
        let updateCoverImage = null;

        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        let newCoverImage = book.coverImage;
        let oldCoverImage = { url: book.coverImage, fileId: book.fileId };

        if (req.file) {
            newCoverImage = await uploadToImagekit(req.file, 'coverImage');
        }

        book.name = name || book.name;
        book.genre = genre || book.genre;
        book.coverImage = newCoverImage.url;
        book.description = description || book.description;

        await book.save();
        res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
        next(err);
    }
}

export const deleteBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) return res.status(404).json({ error: 'Book not found' });

        let coverImage ={url: book.coverImage, fileId: book.fileId};
        await deleteFromImagekit(coverImage);
        
        await Book.findByIdAndDelete(id);

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
        next(err);
    }
}