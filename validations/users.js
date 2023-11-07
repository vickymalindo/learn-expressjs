import { body } from 'express-validator';
import Users from '../models/UserModel.js';

export const registerValidator = () => {
  return [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('Not a valid e-mail address')
      .custom(async (value) => {
        const user = await Users.findOne({ where: { email: value } });
        if (user?.dataValues) {
          throw new Error('Email already taken');
        }
        return true;
      }),
    body('password')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 character'),
    body('passwordConfirmation')
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password must be same');
        }
        return value === req.body.password;
      }),
  ];
};

export const loginValidator = () => {
  return [
    body('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('Not a valid email address'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ];
};

export const updateUserValidator = () => {
  return [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('Not a valid email address')
      .custom(async (value) => {
        const user = await Users.findOne({ where: { email: value } });
        if (user?.dataValues) {
          throw new Error('Email already taken');
        }
        return true;
      }),
  ];
};

export const changePasswordValidator = () => {
  return [
    body('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('Not a valid email address'),
    body('password')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage('Must have minimal 6 character'),
    body('newPassword')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage('Must have minimal 6 character'),
  ];
};
