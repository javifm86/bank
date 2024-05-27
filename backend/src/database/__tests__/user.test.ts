import { getUser } from '../user';
import db from '../../database/connect';

jest.mock('../../database/connect');

describe('getUser', () => {
  it('should return user data for a given username', async () => {
    (db.any as jest.Mock).mockResolvedValue([
      { username: 'testUser', password: 'passwordHash' },
    ]);
    const result = await getUser('testUser');
    expect(result).toEqual({
      passwordHash: 'passwordHash',
      username: 'testUser',
      error: false,
    });
  });

  it('should return null user data if user does not exist', async () => {
    (db.any as jest.Mock).mockResolvedValue([]);
    const result = await getUser('testUser');
    expect(result).toEqual({
      passwordHash: null,
      username: null,
      error: false,
    });
  });

  it('should handle database errors', async () => {
    (db.any as jest.Mock).mockRejectedValue(new Error('Database error'));
    const result = await getUser('testUser');
    expect(result).toEqual({ passwordHash: null, username: null, error: true });
  });
});
