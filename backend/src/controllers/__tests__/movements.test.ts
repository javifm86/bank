import request from 'supertest';
import app from '../../app';
import { getMovementsDb, transactionMovement } from '../../database/movements';
import { verifyJWT } from '../../services/login';
import { getBalance } from '../../database/account';

jest.mock('../../database/movements');
jest.mock('../../services/login');
jest.mock('../../database/account');

describe('Movements', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Get movements', () => {
    it('should respond with an error if user is not found in token', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: true,
        username: null,
      });

      const response = await request(app)
        .get('/movements')
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if database returns error when consulting movements', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });
      (getMovementsDb as jest.Mock).mockResolvedValue({
        movements: [],
        error: true,
      });

      const response = await request(app)
        .get('/movements')
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(500);
    });

    it('should respond with movements if database returns information properly', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });
      (getMovementsDb as jest.Mock).mockResolvedValue({
        movements: [],
        error: false,
      });

      const response = await request(app)
        .get('/movements')
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Post movements', () => {
    it('should respond with an error if user is not found in token', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: true,
        username: null,
      });

      const response = await request(app)
        .post('/movements')
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if amount is not present', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });

      const response = await request(app)
        .post('/movements')
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error if type is not present', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });

      const response = await request(app)
        .post('/movements')
        .send({ amount: 1000 })
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error if amount is not a number', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });

      const response = await request(app)
        .post('/movements')
        .send({ amount: '1000', type: 'deposit' })
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error if amount is not integer', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });

      const response = await request(app)
        .post('/movements')
        .send({ amount: 1000.5, type: 'deposit' })
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error type is not "withdraw" or "deposit"', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });

      const response = await request(app)
        .post('/movements')
        .send({ amount: 1000.5, type: 'invalid' })
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error if there is an error retrieving current account balance', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });
      (getBalance as jest.Mock).mockResolvedValue({
        balance: null,
        error: true,
      });

      const response = await request(app)
        .post('/movements')
        .send({ amount: 1000, type: 'deposit' })
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(500);
    });

    it('should respond with an error if new balance would be less than 0', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });
      (getBalance as jest.Mock).mockResolvedValue({
        balance: 1000,
        error: false,
      });

      const response = await request(app)
        .post('/movements')
        .send({ amount: 10000, type: 'withdraw' })
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error if once validated next balance, the transaction for creating movement and updating account balance fails', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({
        error: false,
        username: 'user',
      });
      (getBalance as jest.Mock).mockResolvedValue({
        balance: 1000,
        error: false,
      });
      (transactionMovement as jest.Mock).mockResolvedValue({
        error: true,
      });

      const response = await request(app)
        .post('/movements')
        .send({ amount: 10000, type: 'deposit' })
        .set('Authorization', 'Bearer your_token_here');

      expect(response.statusCode).toBe(500);
    });
  });

  it('should respond with status code 200 if the whole process was successfull', async () => {
    (verifyJWT as jest.Mock).mockResolvedValue({
      error: false,
      username: 'user',
    });
    (getBalance as jest.Mock).mockResolvedValue({
      balance: 1000,
      error: false,
    });
    (transactionMovement as jest.Mock).mockResolvedValue({
      error: false,
    });

    const response = await request(app)
      .post('/movements')
      .send({ amount: 10000, type: 'deposit' })
      .set('Authorization', 'Bearer your_token_here');

    expect(response.statusCode).toBe(200);
  });
});
