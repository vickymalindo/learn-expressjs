import Books from '../models/BookModel.js';
import Carts from '../models/CartModel.js';
import Users from '../models/UserModel.js';
import response from '../utils/response.util.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const createCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);
  try {
    const { userId, bookId } = req.body;
    const cart = await Carts.create({
      userId: userId,
      bookId: bookId,
    });
    response({
      statusCode: 201,
      message: 'Insert cart success',
      datas: cart,
      res,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getCarts = async (req, res) => {
  const carts = await Carts.findAll();
  if (!carts.length)
    return response({
      statusCode: 400,
      message: 'Carts empty',
      datas: null,
      res,
    });
  response({
    statusCode: 200,
    message: 'Get carts success',
    datas: carts,
    res,
  });
};

export const getUserCarts = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Users.findAll({
      where: {
        id: id,
      },
      include: [{ model: Books }],
      attributes: { exclude: ['password', 'refresh_token'] },
    });
    const { books } = result;
    console.log(books?.length);
    response({
      statusCode: 200,
      message:
        result[0].books?.length === 0
          ? 'Empty user carts'
          : 'Get user carts success',
      datas: result,
      res,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCart = async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    const cartDeleted = await Carts.destroy({
      where: {
        [Op.and]: [{ userId: userId, bookId: bookId }],
      },
    });
    if (cartDeleted[0] === 0)
      return response({
        statusCode: 400,
        message: 'Delete cart failed',
        datas: null,
        res,
      });
    return response({
      statusCode: 200,
      message: 'Delete cart successfully',
      res,
      datas: null,
    });
  } catch (error) {
    throw new Error(error);
  }
};
