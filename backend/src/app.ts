import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import db from './database/connect';
import cors from 'cors';
import login from './controllers/login';
import { getMovements } from './controllers/movements';

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

interface Account {
  username: string;
  balance: number;
}

interface PostMovementRequest extends RequestWithUser {
  body: {
    amount?: number;
    type?: 'withdraw' | 'deposit';
  };
}

app.post('/login', login);

app.use(verifyToken);

app.get('/movements', getMovements);

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
