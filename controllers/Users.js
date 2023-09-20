import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import Users from '../models/UserModel.js';
import response from '../utils/response.util.js';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const user = await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    response({
      statusCode: 201,
      message: 'Register success',
      datas: user,
      res,
    });
  } catch (error) {
    response({ statusCode: 400, message: 'Register failed', datas: null, res });
  }
};
