import { Request, Response } from 'express';

import { getUser } from '../database/user';
import { comparePassword, getJWT } from '../services/login';

interface LoginPostRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

async function login(req: LoginPostRequest, res: Response) {
  const { username: usernameParam, password: passwordParam } = req.body;
  console.log('login request received', { usernameParam, passwordParam });

  if (!usernameParam || !passwordParam) {
    console.log('username and password are required. returning error 400.');
    returnError(res, 'username and password are required');
    return;
  }

  const { error, passwordHash, username } = await getUser(usernameParam);

  if (error) {
    console.log(
      'an error ocurred retrieving username information. returning error 500.'
    );
    returnError(res, 'an error ocurred retrieving username information', 500);
    return;
  }

  if (!username || !passwordHash) {
    console.log('invalid username or password. returning error 401.', 401);
    returnError(res, 'invalid username or password', 401);
    return;
  }

  const isPasswordCorrect = await comparePassword(passwordParam, passwordHash);

  if (!isPasswordCorrect) {
    console.log('password is not correct. returning error 401.');
    returnError(res, 'invalid username or password', 401);
    return;
  }

  const token = getJWT(username);
  console.log('login successful. returning token.');
  res.json({ token });
}

function returnError(res: Response, error: string, statusCode: number = 400) {
  res.status(statusCode).json({ error });
}

export default login;
