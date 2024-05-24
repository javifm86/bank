import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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

app.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  db.any<User>('SELECT * FROM users WHERE username = $1', [userName])
    .then((results) => {
      if (results.length) {
        const { password_hash, username } = results[0];
        console.log('password_hash:', password_hash);
        console.log('password:', password);
        bcrypt.compare(password, password_hash, function (err, result) {
          if (result === true) {
            const token = jwt.sign(username, SECRET_KEY);
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

app.get('/:password', (req, res) => {
  const plainPassword = req.params.password;
  console.log(plainPassword);

  const saltRounds = 10;

  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`hashedPassword:--${hashedPassword}--`);

    bcrypt.compare(plainPassword, hashedPassword, function (err, result) {
      if (result === true) {
        console.log('Password matches');
      } else {
        console.log('Password does not match');
      }

      db.any('SELECT * FROM users')
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
  res.json({ message: 'Hello world' });
});

// app.get('/protected', verifyToken, (req, res) => {
//   res.json({ message: 'Protected content' });
// });

// function verifyToken(req: Request, res: Response, next: NextFunction) {
//   const bearerHeader = req.headers['authorization'];

//   if (bearerHeader) {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     jwt.verify(bearerToken, SECRET_KEY, (err, data) => {
//       if (err) {
//         res.sendStatus(403);
//       } else {
//         req.user = data;
//         next();
//       }
//     });
//   } else {
//     res.sendStatus(403);
//   }
// }

app.listen(3000, () => console.log('Server started on port 3000'));
