import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const authenticateToken = (req: Request & { user: any }, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET ?? '', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.user = user;
    next();
  });
};

export const authorizeRoles = (roles: string[]) => {
  return async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
