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

export const createBook = async (req, res) => {
  const { title, author, category } = req.body;

  try {
    const book = await Books.create({
      title: title,
      author: author,
      category: category,
    });
    res
      .status(200)
      .json({ message: 'Create book successfully', data: book.dataValues });
  } catch (error) {
    throw new Error(`Create book failed, ${error.message}`);
  }
};
