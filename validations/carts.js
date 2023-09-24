import { body } from 'express-validator';

export const insertCart = () => {
  return [
    body('user_id')
      .not()
      .isEmpty()
      .isInt()
      .withMessage('user_id is required / must number'),
    body('book_id')
      .not()
      .isEmpty()
      .isInt()
      .withMessage('book_id is required / must number'),
  ];
};
