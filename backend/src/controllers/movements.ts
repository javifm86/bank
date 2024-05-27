import { Response } from 'express';

import { RequestWithUser } from '../types';
import { getMovementsDb, transactionMovement } from '../database/movements';
import { getBalance } from '../database/account';

interface PostMovementRequest extends RequestWithUser {
  body: {
    amount?: number;
    type?: 'withdraw' | 'deposit';
  };
}

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

function validatePostMovementsParams(req: PostMovementRequest, res: Response) {
  const user = req.user;
  let hasError = false;
  const { amount, type } = req.body;

  if (!user) {
    hasError = true;
    returnError(res, 'User not found');
  }

  const isAmountValid = typeof amount === 'number' && Number.isInteger(amount);
  const isTypeValid = type === 'withdraw' || type === 'deposit';

  if (!amount || !type || !isAmountValid || !isTypeValid) {
    hasError = true;
    returnError(
      res,
      'Error validating params: amount must be an integer number and type must be "withdraw" or "deposit"'
    );
  }

  return hasError;
}

async function postMovements(req: PostMovementRequest, res: Response) {
  const user = req.user;
  const { amount, type } = req.body;
  const hasErrorInParams = validatePostMovementsParams(req, res);

  // Add user type and amount check to avoid Typescript complaining below about values possibly undefined
  if (hasErrorInParams || !user || !type || !amount) {
    return;
  }

  const { balance, error: errorBalance } = await getBalance(user);

  if (errorBalance || balance === null) {
    returnError(res, 'An error ocurred creating movement', 500);
    return;
  }

  const newBalance = type === 'deposit' ? balance + amount : balance - amount;

  if (newBalance < 0) {
    returnError(res, 'Balance is not enough to withdraw that money');
    return;
  }

  const { error } = await transactionMovement(user, type, amount, newBalance);

  if (error) {
    returnError(res, 'An error ocurred creating movement', 500);
    return;
  }

  res.json({ message: 'Movement created' });
}

function returnError(res: Response, error: string, statusCode: number = 400) {
  res.status(statusCode).json({ error });
}

export { getMovements, postMovements };
