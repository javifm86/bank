import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function comparePassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return new Promise((resolve) => {
    bcrypt.compare(password, passwordHash, function (err, result) {
      if (err) {
        resolve(false);
      }
      resolve(result);
    });
  });
}

function getJWT(username: string, secretKey: string) {
  const payload = { username };

  const token = jwt.sign(payload, secretKey, {
    expiresIn: '30m',
  });

  return token;
}

export { comparePassword, getJWT };
