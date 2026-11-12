import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.split(' ')[1];
  if (req.cookies?.token) return req.cookies.token;
  return null;
}

/** Requires a valid JWT; attaches the full user document to req.user. */
export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) throw ApiError.unauthorized('You must be signed in to do that');

  const payload = verifyToken(token);
  const user = await User.findById(payload.id);
  if (!user) throw ApiError.unauthorized('This account no longer exists');

  req.user = user;
  next();
});

/** Attaches req.user if a valid token is present, but never blocks the request. */
export const attachUserIfPresent = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = verifyToken(token);
      const user = await User.findById(payload.id);
      if (user) req.user = user;
    } catch {
      // invalid/expired token on an optional route - just continue unauthenticated
    }
  }
  next();
});

/** Restricts a route to one or more roles. Use after `protect`. */
export const restrictTo = (...roles: Array<'user' | 'admin'>) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw ApiError.forbidden('You do not have permission to perform this action');
  }
  next();
};
