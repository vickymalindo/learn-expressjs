import Books from '../models/BookModel.js';

export const getBooks = async (req, res) => {
  try {
    const books = await Books.findAll();
    if (books.length === 0) return res.json({ message: 'empty data books' });
    return res.json(books);
  } catch (error) {
    console.log(error);
  }
};
