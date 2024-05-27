import { Response } from 'express';

import { RequestWithUser } from '../types';
import { getMovementsDb } from '../database/movements';

async function getMovements(req: RequestWithUser, res: Response) {
  const user = req.user;

  if (!user) {
    returnError(res, 'User not found');
    return;
  }

  const { movements, error } = await getMovementsDb(user);

  if (error) {
    returnError(res, 'An error ocurred retrieving movements', 500);
    return;
  }

  res.json(movements);
}

function returnError(res: Response, error: string, statusCode: number = 400) {
  res.status(statusCode).json({ error });
}

export { getMovements };
