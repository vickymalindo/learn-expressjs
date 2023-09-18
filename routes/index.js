import express from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from '../controllers/Books.js';
import { insertBookValidator } from '../validations/books.js';

const router = express.Router();

router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.post('/book', insertBookValidator(), createBook);
router.put('/book/:id', updateBook);
router.delete('/book/:id', deleteBook);

export default router;
