import { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// interface LocalAuth extends Request {
//   [key: string]: any;
// }

export default async (req: any, res: any, next: NextFunction) => {
  const token = req.header('x-auth');
  if (!token) {
    return res.status(401).json({ message: 'no token' });
  }
  try {
    jwt.verify(token, 'secret', (err: any, decoded: any) => {
      if (err) res.status(201).json({ erorrs: [{ message: 'invalid token' }] });
      req.user = decoded.user;
      next();
    });
  } catch (e) {
    return res.status(500).json({ errors: [{ message: 'Sever error' }] });
  }
};
