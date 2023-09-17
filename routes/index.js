import express from 'express';
import { createBook, getBooks } from '../controllers/Books.js';

const router = express.Router();

router.get('/books', getBooks);
router.post('/book', createBook);

export default router;
