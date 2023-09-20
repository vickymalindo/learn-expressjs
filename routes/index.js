import express from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from '../controllers/Books.js';
import { register } from '../controllers/Users.js';
import { insertBookValidator } from '../validations/books.js';
import { registerValidator } from '../validations/users.js';

const router = express.Router();

// Books Route
router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.post('/book', insertBookValidator(), createBook);
router.put('/book/:id', insertBookValidator(), updateBook);
router.delete('/book/:id', deleteBook);

// Users Route
router.post('/register', ...registerValidator(), register);

export default router;
