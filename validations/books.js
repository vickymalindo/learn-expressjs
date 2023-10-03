import { check, validationResult } from 'express-validator';
import fs from 'fs';

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

export const validatorImage = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors);
    next();
  } catch (error) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
    console.log(`successfully deleted ${req.file.path}`);
  }
};
