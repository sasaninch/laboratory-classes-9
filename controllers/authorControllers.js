const Author = require('../models/Author');

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ 
      error: 'Failed to fetch authors',
      message: error.message 
    });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Both firstName and lastName are required' 
      });
    }

    const existingAuthor = await Author.findOne({ 
      firstName: firstName.trim(), 
      lastName: lastName.trim() 
    });

    if (existingAuthor) {
      return res.status(409).json({ 
        error: 'Author with this name already exists',
        existingAuthor 
      });
    }

    const newAuthor = new Author({
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });

    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
    console.error('Error creating author:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Failed to create author',
      message: error.message 
    });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Both firstName and lastName are required' 
      });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ 
        error: 'Author not found' 
      });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('Error updating author:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'Invalid author ID format' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to update author',
      message: error.message 
    });
  }
};

module.exports = {
  getAllAuthors,
  createAuthor,
  updateAuthor
};