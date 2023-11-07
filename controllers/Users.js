import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Users from '../models/UserModel.js';
import response from '../utils/response.util.js';

export const getUsers = async (req, res) => {
  const users = await Users.findAll({
    attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
  });

  return response({
    statusCode: 200,
    message: 'Get users successfully',
    datas: users,
    res,
  });
};

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

    delete user.dataValues.password;
    console.log(user);
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
    // find user by email
    const user = await Users.findOne({
      where: {
        email: email,
      },
    });

    // compare hash password to real password
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

    // generate access token with jwt sign
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30S',
      }
    );

    // generate refresh token with jwt sign
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    // upadte user refresh_token
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // give cookie with value refresh token
    res.cookie('refreshToken', refreshToken, {
      // this use for client-side scripting
      httpOnly: true,
      // this for expired cookie
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
    // get cookie refresh token
    const refreshToken = req.cookies.refreshToken;
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

    // verify refresh token
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

        // generate access token
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

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return response({
      statusCode: 204,
      message: 'No token/content',
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
      statusCode: 204,
      message: 'User not found',
      datas: null,
      res,
    });

  const userId = user.id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );

  // clear cookie refresh token
  res.clearCookie('refreshToken');
  return response({
    statusCode: 200,
    message: 'Logout success',
    datas: null,
    res,
  });
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);

  const { id } = req.params;
  try {
    const userUpdated = await Users.update(req.body, {
      where: {
        id: id,
      },
    });

    if (userUpdated[0] === 0)
      return response({
        statusCode: 304,
        message: 'Update user failed or not found',
        datas: null,
        res,
      });

    return response({
      statusCode: 202,
      message: 'Update user successfully',
      datas: req.body,
      res,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userDeleted = await Users.destroy({ where: { id: id } });
    if (userDeleted[0] === 0)
      return response({
        statusCode: 400,
        message: 'Delete user failed',
        datas: null,
        res,
      });

    return response({
      statusCode: 200,
      message: 'Delete user successfully',
      res,
      datas: null,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ['password', 'refresh_token'] },
    });

    response({
      statusCode: 200,
      message: 'Get user success',
      datas: user,
      res,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const searchUser = async (req, res) => {
  const { name, email } = req.query;
  try {
    const findUsers = await Users.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${name?.toLowerCase() ?? ''}%`,
            },
            email: {
              [Op.like]: `%${email?.toLowerCase() ?? ''}%`,
            },
          },
        ],
      },
      attributes: { exclude: ['password', 'refresh_token'] },
    });

    if (findUsers.length < 1) {
      return response({
        statusCode: 404,
        message: 'Users not found',
        datas: null,
        res,
      });
    }
    return response({
      statusCode: 302,
      message: 'Success get users',
      datas: findUsers,
      res,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors);

  const { email, password, newPassword } = req.body;

  const user = await Users.findOne({
    where: { email: email },
    attributes: { exclude: ['refresh_token'] },
  });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return response({
      statusCode: 401,
      message: 'Wrong password',
      datas: null,
      res,
    });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashPassword;
  await user.save();

  return response({
    statusCode: 200,
    message: 'Password success changed',
    datas: user,
    res,
  });
};
