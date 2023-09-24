import express from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from '../controllers/Books.js';
import {
  getUsers,
  login,
  logout,
  refreshToken,
  register,
} from '../controllers/Users.js';
import { verifyToken as auth } from '../middleware/verifyToken.js';
import { insertBookValidator } from '../validations/books.js';
import { loginValidator, registerValidator } from '../validations/users.js';

const router = express.Router();

// Books Routes
router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.post('/book', insertBookValidator(), auth, createBook);
router.put('/book/:id', auth, insertBookValidator(), updateBook);
router.delete('/book/:id', auth, deleteBook);

// Users Routes
router.post('/register', ...registerValidator(), register);
router.post('/login', ...loginValidator(), login);
router.get('/token', refreshToken);
router.delete('/logout', logout);
router.get('/users', auth, getUsers);

export default router;
