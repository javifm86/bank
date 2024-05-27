import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import cors from 'cors';
import login from './controllers/login';
import { getMovements, postMovements } from './controllers/movements';

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

app.post('/login', login);

app.use(verifyToken);

app.get('/movements', getMovements);

app.post('/movements', postMovements);

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
