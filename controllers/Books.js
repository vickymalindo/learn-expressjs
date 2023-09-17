import Books from '../models/BookModel.js';
import response from '../utils/response.util.js';

export const getBooks = async (req, res) => {
  try {
    const books = await Books.findAll();
    if (books.length === 0)
      return response({
        statusCode: 204,
        message: 'empty data books',
        datas: [],
        res,
      });
    return response({
      statusCode: 200,
      message: 'Get books successfully',
      datas: books,
      res,
    });
  } catch (error) {
    throw new Error(`Get books failed ${error.message}`);
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
    response({
      statusCode: 201,
      message: 'Create book successfully',
      datas: book.dataValues,
      res,
    });
  } catch (error) {
    throw new Error(`Create book failed, ${error.message}`);
  }
};

export const getBook = async (req, res) => {
  const { id } = req.params;
  const book = await Books.findByPk(id);
  if (!book)
    return response({
      statusCode: 204,
      message: 'Book not found',
      datas: {},
      res,
    });
  return response({
    statusCode: 302,
    message: 'Get book successfully',
    datas: book,
    res,
  });
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

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const bookDeleted = await Books.destroy({ where: { id: id } });
    if (bookDeleted[0] === 0)
      return res.status(400).json({ message: 'Delete book failed' });
    return res.status(202).json({ message: 'Delete book successfully' });
  } catch (error) {
    throw new Error(`Update book failed: ${error.message}`);
  }
};
