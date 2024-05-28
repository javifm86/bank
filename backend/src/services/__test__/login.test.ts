import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { comparePassword, getJWT, verifyJWT } from '../login';

const MOCK_SECRET_KEY = process.env.BACKEND_SECRET_KEY as string;

describe('login services', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('comparePassword', () => {
    it('should return true if the password matches the hashed password', async () => {
      const password = 'testPassword';
      const hashedPassword = bcrypt.hashSync(password);
      const result = await comparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false if the password does not match the hashed password', async () => {
      const password = 'testPassword';
      const hashedPassword = bcrypt.hashSync('differentPassword');
      const result = await comparePassword(password, hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle error from bcrypt.compare', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      compareSpy.mockImplementation((password, passwordHash, callback) => {
        if (callback) {
          callback(new Error('bcrypt error'), false);
        }
      });

      try {
        await comparePassword('password', 'passwordHash');
      } catch (err: any) {
        expect(err.message).toBe('bcrypt error');
      }

      compareSpy.mockRestore();
    });
  });

  describe('getJWT', () => {
    it('should return a valid JWT for a given user', () => {
      const token = getJWT('javi');
      const decoded = jwt.verify(token, MOCK_SECRET_KEY);
      console.log(process.env.BACKEND_SECRET_KEY);
      expect(decoded).toEqual(expect.objectContaining({ username: 'javi' }));
    });
  });

  describe('verifyJWT', () => {
    it('should return a decoded user object with error=false if the token is valid', async () => {
      const payload = { username: 'test' };

      const token = jwt.sign(payload, MOCK_SECRET_KEY, {
        expiresIn: '30m',
      });
      const result = await verifyJWT(token);
      expect(result).toEqual({ error: false, username: 'test' });
    });

    it('should throw an error if the token is invalid', async () => {
      const token = 'invalid-token';
      const result = await verifyJWT(token);
      expect(result).toEqual({ error: true, username: null });
    });
  });
});
