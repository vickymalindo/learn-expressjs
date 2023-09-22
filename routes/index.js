import express from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from '../controllers/Books.js';
import { login, refreshToken, register } from '../controllers/Users.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { insertBookValidator } from '../validations/books.js';
import { loginValidator, registerValidator } from '../validations/users.js';

const router = express.Router();

// Books Routes
router.get('/books', verifyToken, getBooks);
router.get('/book/:id', getBook);
router.post('/book', insertBookValidator(), verifyToken, createBook);
router.put('/book/:id', insertBookValidator(), updateBook);
router.delete('/book/:id', deleteBook);

// Users Routes
router.post('/register', ...registerValidator(), register);
router.post('/login', ...loginValidator(), login);
router.get('/token', refreshToken);

export default router;
