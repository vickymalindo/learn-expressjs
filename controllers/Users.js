import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
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

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({
      where: {
        email: email,
      },
    });
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return response({
        statusCode: 401,
        message: 'Wrong password',
        datas: null,
        res,
      });
    const userId = user.id;
    const name = user.name;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30S',
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    response({
      statusCode: 202,
      message: 'Login success',
      datas: accessToken,
      res,
    });
  } catch (error) {
    response({
      statusCode: 401,
      message: 'Login failed / user not found',
      datas: null,
      res,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
      return response({
        statusCode: 401,
        message: 'Unauthorized',
        datas: null,
        res,
      });
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user)
      return response({
        statusCode: 403,
        message: 'Forbidden',
        datas: null,
        res,
      });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return response({
            statusCode: 403,
            message: 'Forbidden',
            datas: null,
            res,
          });
        const userId = user.id;
        const { name, email } = user;
        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '30s',
          }
        );
        response({
          statusCode: 200,
          message: 'Refresh token success',
          datas: accessToken,
          res,
        });
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};
