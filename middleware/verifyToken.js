import jwt from 'jsonwebtoken';
import response from '../utils/response.util.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null)
    return response({
      statusCode: 401,
      message: 'Unauthorized',
      datas: null,
      res,
    });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return response({
        statusCode: 403,
        message: 'Forbidden',
        datas: null,
        res,
      });

    // decoded output is the data that sign using jwt
    console.log(decoded);

    // req.email = decoded.email;
    next();
  });
};
