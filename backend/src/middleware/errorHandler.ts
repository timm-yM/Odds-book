import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { isProd } from '../config/env';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`No route for ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = 'Something went wrong on our end';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err && typeof err === 'object' && 'name' in err) {
    const e = err as { name: string; code?: number; message?: string; errors?: Record<string, { message: string }> };
    if (e.name === 'ValidationError' && e.errors) {
      statusCode = 400;
      message = Object.values(e.errors).map((v) => v.message).join(', ');
    } else if (e.code === 11000) {
      statusCode = 409;
      message = 'That record already exists';
    } else if (e.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid identifier';
    } else if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Session expired, please sign in again';
    } else if (e.message) {
      message = e.message;
    }
  }

  if (!isProd && statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
