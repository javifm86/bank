import MockAdapter from 'axios-mock-adapter';
import http, { setSessionToken } from '../http';

describe('http client', () => {
  const mock = new MockAdapter(http);
  const testUrl = '/test';
  const testToken = 'test-token';

  beforeEach(() => {
    mock.reset();
    setSessionToken('');
  });

  it('should not set Authorization header if no token is provided', async () => {
    mock.onGet(testUrl).reply(200);

    const response = await http.get(testUrl);

    expect(response.config.headers.Authorization).toBeUndefined();
  });

  it('should set Authorization header if token is provided', async () => {
    setSessionToken(testToken);
    mock.onGet(testUrl).reply(200);

    const response = await http.get(testUrl);

    expect(response.config.headers.Authorization).toBe(`Bearer ${testToken}`);
  });

  it('should handle request errors correctly', async () => {
    mock.onGet(testUrl).networkError();

    try {
      await http.get(testUrl);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
