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

  console.log('getMovements request received', { user });

  const { movements, error } = await getMovementsDb(user as string);

  if (error) {
    console.log('An error ocurred retrieving movements. returning error 500.');
    returnError(res, 'An error ocurred retrieving movements', 500);
    return;
  }

  console.log('Movements retrieved. returning them.', movements);
  res.json(movements);
}

function validatePostMovementsParams(req: PostMovementRequest, res: Response) {
  let hasError = false;
  const { amount, type } = req.body;

  const isAmountValid = typeof amount === 'number' && Number.isInteger(amount);
  const isTypeValid = type === 'withdraw' || type === 'deposit';

  if (!amount || !type || !isAmountValid || !isTypeValid) {
    hasError = true;
    console.log(
      'Error validating params: amount must be an integer number and type must be "withdraw" or "deposit"'
    );
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

  console.log('postMovements request received', { user, amount, type });

  // Add user type and amount check to avoid Typescript complaining below about values possibly undefined
  if (hasErrorInParams || !user || !type || !amount) {
    return;
  }

  const { balance, error: errorBalance } = await getBalance(user);

  if (errorBalance || balance === null) {
    console.log('An error ocurred retrieving balance. returning error 500.');
    returnError(res, 'An error ocurred creating movement', 500);
    return;
  }

  const newBalance = type === 'deposit' ? balance + amount : balance - amount;

  if (newBalance < 0) {
    console.log(
      'Balance is not enough to withdraw that money. returning error 400.'
    );
    returnError(res, 'Balance is not enough to withdraw that money');
    return;
  }

  const { error } = await transactionMovement(user, type, amount, newBalance);

  if (error) {
    console.log('An error ocurred creating movement. returning error 500.');
    returnError(res, 'An error ocurred creating movement', 500);
    return;
  }

  console.log('Movement created');
  res.json({ message: 'Movement created' });
}

function returnError(res: Response, error: string, statusCode: number = 400) {
  res.status(statusCode).json({ error });
}

export { getMovements, postMovements };
