const express = require('express');
const router = express.Router();
const { getAllAuthors, createAuthor, updateAuthor } = require('../controllers/authorControllers');

router.get('/', getAllAuthors);
router.post('/', createAuthor);
router.put('/:id', updateAuthor);

module.exports = router;