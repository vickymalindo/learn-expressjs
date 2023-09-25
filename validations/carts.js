import { body } from 'express-validator';

export const insertCart = () => {
  return [
    body('userId')
      .not()
      .isEmpty()
      .isInt()
      .withMessage('userId is required / must number'),
    body('bookId')
      .not()
      .isEmpty()
      .isInt()
      .withMessage('bookId is required / must number'),
  ];
};
