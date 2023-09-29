import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
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
    throw new Error(error);
  }
};

export const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);
  try {
    const { title, author, category, count } = req.body;
    const book = await Books.create({
      title: title,
      author: author,
      category: category,
      count: count,
    });
    response({
      statusCode: 201,
      message: 'Create book successfully',
      datas: book.dataValues,
      res,
    });
  } catch (error) {
    throw new Error(error);
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);
  const { id } = req.params;
  try {
    const bookUpdated = await Books.update(req.body, {
      where: {
        id: id,
      },
    });
    if (bookUpdated[0] === 0)
      return response({
        statusCode: 304,
        message: 'Update book failed or not found',
        datas: {},
        res,
      });
    return response({
      statusCode: 202,
      message: 'Update book successfully',
      datas: req.body,
      res,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const bookDeleted = await Books.destroy({ where: { id: id } });
    if (bookDeleted[0] === 0)
      return response({
        statusCode: 400,
        message: 'Delete book failed',
        datas: {},
        res,
      });
    return response({
      statusCode: 200,
      message: 'Delete book successfully',
      res,
      datas: {},
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const searchBook = async (req, res) => {
  const { title, author, category } = req.query;
  try {
    const findBooks = await Books.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${title?.toLowerCase() ?? ''}%`,
            },
            author: {
              [Op.like]: `%${author?.toLowerCase() ?? ''}%`,
            },
            category: { [Op.like]: `%${category?.toLowerCase() ?? ''}%` },
          },
        ],
      },
    });
    if (findBooks.length < 1) {
      return response({
        statusCode: 404,
        message: 'Books not found',
        datas: null,
        res,
      });
    }
    return response({
      statusCode: 302,
      message: 'Success search books',
      datas: findBooks,
      res,
    });
  } catch (error) {
    throw new Error(error);
  }
};
