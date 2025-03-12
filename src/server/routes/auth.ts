import express from 'express';
import { register, login, logout, getProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';
import { check } from 'express-validator';

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('age_group').notEmpty().withMessage('Age group is required'),
  ],
  validateRequest,
  register
);

router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfile);

export default router;
