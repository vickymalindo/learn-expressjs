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

export const getBook = async (req, res) => {
  const { id } = req.params;
  const book = await Books.findByPk(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.status(200).json({ message: 'Get book successfully', data: book });
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  try {
    const bookUpdated = await Books.update(req.body, {
      where: {
        id: id,
      },
    });
    if (bookUpdated[0] === 0)
      return res.status(400).json({ message: 'Update book failed' });
    return res.status(202).json({ message: 'Update book successfully' });
  } catch (error) {
    throw new Error(`Update book failed: ${error.message}`);
  }
};
