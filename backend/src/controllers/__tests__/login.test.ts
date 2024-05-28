import request from 'supertest';
import app from '../../app';
import { getUser } from '../../database/user';
import { comparePassword, getJWT } from '../../services/login';

jest.mock('../../database/user');
jest.mock('../../services/login');

describe('Login', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should respond with an error if username is not provided', async () => {
    const response = await request(app).post('/login').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'username and password are required',
    });
  });

  it('should respond with an error if password is not provided', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'test' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'username and password are required',
    });
  });

  it('should respond with an error if there is an error retrieving user information', async () => {
    (getUser as jest.Mock).mockResolvedValue({ error: true });

    const response = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'test' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'an error ocurred retrieving username information',
    });
  });

  it('should respond with an error if user or password are not found in database ', async () => {
    (getUser as jest.Mock).mockResolvedValue({
      error: false,
      username: null,
      passwordHash: null,
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'test' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: 'invalid username or password',
    });
  });

  it('should respond with an error if password is not correct for the user ', async () => {
    (getUser as jest.Mock).mockResolvedValue({
      error: false,
      username: 'test',
      passwordHash: 'fakehash',
    });
    (comparePassword as jest.Mock).mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'test' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: 'invalid username or password',
    });
  });

  it('should respond with 200 if password is correct for the user ', async () => {
    (getUser as jest.Mock).mockResolvedValue({
      error: false,
      username: 'test',
      passwordHash: 'fakehash',
    });
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (getJWT as jest.Mock).mockReturnValue('inventedToken');

    const response = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'test' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  // Add more tests here for successful login, incorrect password, etc.
});
