import express from 'express';
import {
  createBook,
  getBook,
  getBooks,
  updateBook,
} from '../controllers/Books.js';

const router = express.Router();

router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.post('/book', createBook);
router.put('/book/:id', updateBook);

export default router;
