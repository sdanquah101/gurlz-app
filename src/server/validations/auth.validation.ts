import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  body('gender')
    .isIn(['female', 'male'])
    .withMessage('Gender must be either female or male'),
  body('country')
    .notEmpty()
    .withMessage('Country is required'),
  body('phoneNumber')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please provide a valid phone number')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];