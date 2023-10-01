import { check } from 'express-validator';

export const insertBookValidator = () => {
  return [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('author').not().isEmpty().withMessage('Author is required'),
    check('category').not().isEmpty().withMessage('Category is required'),
    check('image').custom((value, { req }) => {
      if (req.file.mimetype.includes('image')) {
        return true;
      }
      throw new Error('Only image');
    }),
  ];
};
