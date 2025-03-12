import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  logger.error('Unhandled error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { error: err, stack: err.stack })
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};