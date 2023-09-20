import { body } from 'express-validator';

export const registerValidator = () => {
  return [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('Not a valid e-mail address'),
    body('password')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 character'),
    body('passwordConfirmation')
      .not()
      .isEmpty()
      .custom((value, { req }, next) => {
        if (value !== req.body.password) {
          throw new Error('Password must be same');
        }
        return value === req.body.password;
      }),
  ];
};

export const verifyPasswordsMatch = (req, res, next) => {
  const { passwordConfirmation } = req.body;

  return body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 4 characters')
    .equals(passwordConfirmation);
};
