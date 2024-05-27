import { Request, Response } from 'express';

import { getUser } from '../database/user';
import { comparePassword, getJWT } from '../services/login';

const SECRET_KEY = 'your-secret-key';

interface LoginPostRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

async function login(req: LoginPostRequest, res: Response) {
  const { username: usernameParam, password: passwordParam } = req.body;

  if (!usernameParam || !passwordParam) {
    returnError(res, 'username and password are required');
    return;
  }

  const { error, passwordHash, username } = await getUser(usernameParam);

  if (error) {
    returnError(res, 'an error ocurred retrieving username information', 500);
    return;
  }

  if (!username || !passwordHash) {
    returnError(res, 'invalid username or password');
    return;
  }

  const isPasswordCorrect = await comparePassword(passwordParam, passwordHash);

  if (!isPasswordCorrect) {
    returnError(res, 'invalid username or password');
    return;
  }

  const token = getJWT(username, SECRET_KEY);
  res.json({ token });
}

function returnError(res: Response, error: string, statusCode: number = 400) {
  res.status(statusCode).json({ error });
}

export default login;
