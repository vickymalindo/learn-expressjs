import { check } from 'express-validator';

export const insertBookValidator = () => {
  return [
    check('title').not().isEmpty().withMessage('Titile is required'),
    check('author').not().isEmpty().withMessage('Author is required'),
    check('category').not().isEmpty().withMessage('Category is required'),
  ];
};
