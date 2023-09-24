import Carts from '../models/CartModel.js';
import response from '../utils/response.util.js';
import { validationResult } from 'express-validator';

export const createCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);
  try {
    const { user_id, book_id } = req.body;
    const cart = await Carts.create({
      user_id: user_id,
      book_id: book_id,
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
