import { verifyToken } from '../auth';
import { verifyJWT } from '../../services/login';
import { NextFunction, Response, Request } from 'express';

jest.mock('../../services/login');

describe('verifyToken', () => {
  let mockRequest: Partial<Request>;
  let mockRequestLogin: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = { path: '/movements' };
    mockRequestLogin = { path: '/login' };
    mockResponse = {
      sendStatus: jest.fn(),
    };
  });

  it('should call next function if path is /login', async () => {
    await verifyToken(
      mockRequestLogin as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('should send 401 if no authorization header', async () => {
    mockRequest.headers = {};
    await verifyToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should call verifyJWT if authorization header is present', async () => {
    mockRequest.headers = { authorization: 'Bearer token' };
    (verifyJWT as jest.Mock).mockResolvedValue({
      error: null,
      username: 'test',
    });
    await verifyToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(verifyJWT).toHaveBeenCalledWith('token');
  });
});
