import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, age_group } = req.body;

  // Validate required fields
  if (!age_group) {
    throw new AppError('Age group is required', 400);
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new AppError('Email or username already exists', 400);
  }

  // Create a new user
  const user = await User.create({
    email,
    username,
    age_group,
    ...req.body, // Include other fields if needed
  });

  // Generate a token
  const token = generateToken(user._id);

  // Send response
  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        country: user.country,
        age_group: user.age_group, // Include age_group in response
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        country: user.country,
        age_group: user.age_group, // Include age_group in response
      },
      token,
    },
  });
});

const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '24h' }
  );
};
