import { NextFunction, Response } from 'express';

import { RequestWithUser } from '../types';
import { verifyJWT } from '../services/login';

async function verifyToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  // Exclude /login route from JWT validation
  if (req.path === '/login') {
    next();
    return;
  }

  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    res.sendStatus(401);
    return;
  }

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  const { error, username } = await verifyJWT(bearerToken);

  if (error || !username) {
    res.sendStatus(401);
    return;
  }

  req.user = username;
  next();
}

export { verifyToken };
