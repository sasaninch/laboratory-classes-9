const express = require('express');
const router = express.Router();
const { getAllBooks, createBook, deleteBook } = require('../controllers/bookControllers');

router.get('/', getAllBooks);
router.post('/', createBook);
router.delete('/:id', deleteBook);

module.exports = router;