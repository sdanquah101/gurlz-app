import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    return decoded;
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};