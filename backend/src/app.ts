import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './database/connect';
import cors from 'cors';

// Replace with your own secret key
const SECRET_KEY = 'your-secret-key';

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

interface RequestWithUser extends Request {
  user?: string | JwtPayload | undefined;
}

interface User {
  username: string;
  password_hash: string;
}

interface Movement {
  username: string;
  date: string;
  type: string;
  amount: number;
  balance: number;
}

interface Account {
  username: string;
  balance: number;
}

interface LoginPostRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

interface PostMovementRequest extends RequestWithUser {
  body: {
    amount?: number;
    type?: 'withdraw' | 'deposit';
  };
}

app.post('/login', async (req: LoginPostRequest, res) => {
  const { username, password } = req.body;

  db.any<User>('SELECT * FROM users WHERE username = $1', [username])
    .then((results) => {
      if (results.length) {
        const { password_hash, username: usernameDb } = results[0];
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
      res
        .status(400)
        .json({ error: 'Generic error. Invalid username or password' });
    });
});

app.use(verifyToken);

app.get('/movements', (req: RequestWithUser, res) => {
  db.any<Movement>(
    'SELECT date, type, amount, balance FROM movements WHERE username = $1 ORDER BY date DESC',
    [req.user]
  )
    .then((results) => {
      if (results.length) {
        res.json(results);
      } else {
        res.status(400).json({
          error: 'Movements not found',
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: 'Generic error in movements' });
    });
});

app.post('/movements', (req: PostMovementRequest, res) => {
  const { amount, type } = req.body;

  if (
    !amount ||
    !type ||
    !Number.isInteger(amount) ||
    (type !== 'withdraw' && type !== 'deposit')
  ) {
    res.status(400).json({ error: 'Error validating params' });
    return;
  }

  db.any<Account>('SELECT balance FROM account WHERE username = $1', [req.user])
    .then((results) => {
      if (results.length) {
        const balance = results[0].balance;
        const newBalance =
          type === 'deposit' ? balance + amount : balance - amount;

        if (newBalance < 0) {
          res.status(400).json({ error: 'Not enough balance' });
          return;
        }

        db.tx(async (t) => {
          const queryMovement = t.none(
            'INSERT INTO movements (username, date, type, amount, balance) VALUES ($1, NOW(), $2, $3, $4)',
            [req.user, type, amount, newBalance]
          );

          const queryBalance = t.none(
            'UPDATE account SET balance = $1 WHERE username = $2',
            [newBalance, req.user]
          );

          await t.batch([queryMovement, queryBalance]);
        })
          .then(() => {
            res.json({ message: 'Movement created' });
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({ error: 'Error creating movement' });
          });
      } else {
        res.status(400).json({
          error: 'No results obtained from db.',
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: 'Generic error in movements' });
    });
});

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
    res.sendStatus(401);
  }
}

export default app;
