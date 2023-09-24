import express from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from '../controllers/Books.js';
import {
  deleteUser,
  getUsers,
  login,
  logout,
  refreshToken,
  register,
  updateUser,
} from '../controllers/Users.js';
import { verifyToken as auth } from '../middleware/verifyToken.js';
import { insertBookValidator } from '../validations/books.js';
import {
  loginValidator,
  registerValidator,
  updateUserValidator,
} from '../validations/users.js';
import { insertCart } from '../validations/carts.js';
import { createCart } from '../controllers/Carts.js';

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
router.put('/user/:id', auth, updateUserValidator(), updateUser);
router.delete('/user/:id', auth, deleteUser);

// Carts Routes
router.post('/cart', auth, ...insertCart(), createCart);

export default router;
