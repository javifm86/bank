import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './database/connect';

// Replace with your own secret key
const SECRET_KEY = 'your-secret-key';

const app = express();
app.use(express.json());

interface User {
  username: string;
  password_hash: string;
}

interface LoginPostRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

app.post('/login', async (req: LoginPostRequest, res) => {
  const { username, password } = req.body;

  db.any<User>('SELECT * FROM users WHERE username = $1', [username])
    .then((results) => {
      if (results.length) {
        const { password_hash, username: usernameDb } = results[0];
        console.log('password_hash:', password_hash);
        console.log('password:', password);
        bcrypt.compare(password, password_hash, function (err, result) {
          if (result === true) {
            const payload = {
              username: usernameDb,
            };

            const token = jwt.sign(payload, SECRET_KEY, {
              expiresIn: '30m',
            });
            res.json({ token });
          } else {
            res.status(400).json({
              error: 'Passwords not match. Invalid username or password',
            });
          }
        });
      } else {
        res.status(400).json({
          error: 'No results obtained from db. Invalid username or password',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ error: 'Generic error. Invalid username or password' });
    });
});

app.get('/protected', verifyToken, (req: RequestWithUser, res) => {
  console.log('user in /protected:', req.user);
  res.json({ message: 'Protected content' });
});

app.use(verifyToken);

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

interface RequestWithUser extends Request {
  user?: string | JwtPayload | undefined;
}

function verifyToken(req: RequestWithUser, res: Response, next: NextFunction) {
  // Exclude /login route from JWT validation
  if (req.path === '/login') {
    next();
    return;
  }

  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(
      bearerToken,
      SECRET_KEY,
      (
        err: VerifyErrors | null,
        data: string | JwtPayload | undefined
      ): void => {
        if (err) {
          res.sendStatus(401);
        } else {
          const { username } = data as CustomJwtPayload;
          req.user = username;
          next();
        }
      }
    );
  } else {
    console.log('no hay token');
    res.sendStatus(401);
  }
}

app.listen(3000, () => console.log('Server started on port 3000'));
