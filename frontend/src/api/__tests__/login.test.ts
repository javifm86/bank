import http from '../../utils/http';
import postLogin from '../login';

jest.mock('../../utils/http');

describe('postLogin', () => {
  it('should return token on successful login', async () => {
    (http.post as jest.Mock).mockResolvedValue({
      data: { token: 'test token' },
      error: false,
    });

    const { data, error } = await postLogin({
      username: 'user',
      password: 'password',
    });

    expect(data).toStrictEqual({ token: 'test token' });
    expect(error).toBe(false);
  });

  it('should handle error', async () => {
    (http.post as jest.Mock).mockRejectedValue({
      error: true,
    });

    const { data, error } = await postLogin({
      username: 'user',
      password: 'password',
    });

    expect(data).toBe(null);
    expect(error).toBe(true);
  });
});
