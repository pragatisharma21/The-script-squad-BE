import imagekitSetup from "../Config/imagekit.js";
import Book from "../Models/books.model.js"

let dummyImage = "https://img.freepik.com/free-vector/blank-book-cover-white-vector-illustration_1284-41903.jpg?t=st=1738850444~exp=1738854044~hmac=14fe4ab743d8e3961edd500b97daff73b1f90f1613969cfc358b80277f385a75&w=740";

// Function to upload an image or PDF to ImageKit
const uploadFile = async (fileData, fileName) => {
    try {
        console.log(fileData)
        const result = await imagekitSetup.upload({
            file: fileData, // base64-encoded file or a URL
            fileName: fileName, // any file name you want
        });
        return result;
    } catch (error) {
        throw new Error('Image/PDF upload failed');
    }
};

// Function to delete a file from ImageKit
const deleteFile = async (fileId) => {
    try {
        await imagekitSetup.deleteFile(fileId);
    } catch (error) {
        throw new Error('Failed to delete file from ImageKit');
    }
};

export const addBook = async (req, res, next) => {
    try {
        const { title, author, description,coverImage, pdfUrl, genre } = req.body;
        const fileUrl = dummyImage;
        if(coverImage)
            fileUrl = await uploadFile(coverImage, title);
        const newBook = new Book({
            title,
            author,
            description,
            pdfUrl,
            coverImage: fileUrl ? fileUrl : dummyImage,
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

        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        book.name = name || book.name;
        book.genre = genre || book.genre;
        book.description = description || book.description;

        await book.save();
        res.status(200).json(book);
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

        await Book.findByIdAndDelete(id);

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
        next(err);
    }
}