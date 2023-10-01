import express from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  searchBook,
  updateBook,
} from '../controllers/Books.js';
import {
  createCart,
  deleteCart,
  getCarts,
  getUserCarts,
} from '../controllers/Carts.js';
import {
  deleteUser,
  getUser,
  getUsers,
  login,
  logout,
  refreshToken,
  register,
  searchUser,
  updateUser,
} from '../controllers/Users.js';
import { verifyToken as auth } from '../middleware/verifyToken.js';
import { insertBookValidator } from '../validations/books.js';
import { insertCart } from '../validations/carts.js';
import {
  loginValidator,
  registerValidator,
  updateUserValidator,
} from '../validations/users.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Books Routes
router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.post(
  '/book',
  uploadImage.single('image'),
  auth,
  insertBookValidator(),
  createBook
);
router.put('/book/:id', auth, insertBookValidator(), updateBook);
router.delete('/book/:id', auth, deleteBook);
router.get('/book', searchBook);

// Users Routes
router.post('/register', ...registerValidator(), register);
router.post('/login', ...loginValidator(), login);
router.get('/token', refreshToken);
router.delete('/logout', logout);
router.get('/users', auth, getUsers);
router.put('/user/:id', auth, updateUserValidator(), updateUser);
router.get('/user/:id', auth, getUser);
router.delete('/user/:id', auth, deleteUser);
router.get('/user', auth, searchUser);

// Carts Routes
router.post('/cart', auth, ...insertCart(), createCart);
router.get('/cart/:id', auth, getUserCarts);
router.get('/cart', auth, getCarts);
router.delete('/delete/:userId/:bookId', auth, deleteCart);

export default router;
