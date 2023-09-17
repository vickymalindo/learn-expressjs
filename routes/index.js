import express from 'express';
import { createBook, getBook, getBooks } from '../controllers/Books.js';

const router = express.Router();

router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.post('/book', createBook);

export default router;
