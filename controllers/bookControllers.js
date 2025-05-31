const Book = require('../models/Book');
const Author = require('../models/Author');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('author', 'firstName lastName');
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      error: 'Failed to fetch books',
      message: error.message 
    });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, year, author } = req.body;

    if (!title || !year || !author) {
      return res.status(400).json({ 
        error: 'Title, year, and author are required' 
      });
    }

    const authorExists = await Author.findById(author);
    if (!authorExists) {
      return res.status(400).json({ 
        error: 'Author not found' 
      });
    }

    const newBook = new Book({
      title,
      year,
      author
    });

    const savedBook = await newBook.save();
    
    const populatedBook = await Book.findById(savedBook._id)
      .populate('author', 'firstName lastName');

    res.status(201).json(populatedBook);
  } catch (error) {
    console.error('Error creating book:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'Invalid author ID format' 
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Failed to create book',
      message: error.message 
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ 
        error: 'Book not found' 
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'Invalid book ID format' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to delete book',
      message: error.message 
    });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  deleteBook
};