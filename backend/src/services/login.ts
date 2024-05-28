import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

const SECRET_KEY = process.env.BACKEND_SECRET_KEY ?? 'your-secret-key';

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

interface VerifyJWTResponse {
  error: boolean;
  username: string | null;
}

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

function getJWT(username: string) {
  const payload = { username };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '30m',
  });

  return token;
}

function verifyJWT(bearerToken: string): Promise<VerifyJWTResponse> {
  return new Promise((resolve) => {
    jwt.verify(bearerToken, SECRET_KEY, callbackVerify);

    function callbackVerify(
      err: VerifyErrors | null,
      data: string | JwtPayload | undefined
    ): void {
      if (err) {
        resolve({
          error: true,
          username: null,
        });
        return;
      }
      const { username } = data as CustomJwtPayload;
      resolve({
        error: false,
        username,
      });
    }
  });
}

export { comparePassword, getJWT, verifyJWT };
