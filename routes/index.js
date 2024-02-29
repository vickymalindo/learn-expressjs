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
  changePassword,
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
import { resizeImage, uploadImage } from '../middleware/upload.js';
import { verifyToken as auth, verifyAdmin } from '../middleware/verifyToken.js';
import { insertBookValidator, validatorImage } from '../validations/books.js';
import { insertCart } from '../validations/carts.js';
import {
  changePasswordValidator,
  loginValidator,
  registerValidator,
  updateUserValidator,
} from '../validations/users.js';

const router = express.Router();

// Books Routes
router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.post(
  '/book/:count',
  verifyAdmin,
  uploadImage.single('image'),
  insertBookValidator(),
  validatorImage,
  resizeImage,
  createBook
);
router.put(
  '/book/:id/:count',
  verifyAdmin,
  uploadImage.single('image'),
  insertBookValidator(),
  validatorImage,
  resizeImage,
  updateBook
);
router.delete('/book/:id', verifyAdmin, deleteBook);
router.get('/book', searchBook);

// Users Routes
router.post('/register', ...registerValidator(), register);
router.post('/login', ...loginValidator(), login);
router.get('/token', refreshToken);
router.delete('/logout', logout);
router.get('/users', verifyAdmin, getUsers);
router.put('/user/:id', auth, ...updateUserValidator(), updateUser);
router.get('/user/:id', auth, getUser);
router.delete('/user/:id', verifyAdmin, deleteUser);
router.get('/user', verifyAdmin, searchUser);
router.post(
  '/user/password',
  auth,
  ...changePasswordValidator(),
  changePassword
);

// Carts Routes
router.post('/cart', auth, ...insertCart(), createCart);
router.get('/cart/:id', auth, getUserCarts);
router.get('/cart', auth, getCarts);
router.delete('/delete/:userId/:bookId', auth, deleteCart);

export default router;
