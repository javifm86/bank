import { getBalance, updateBalance } from '../account';
import db from '../../database/connect';
import pgPromise from 'pg-promise';

jest.mock('../../database/connect');

describe('getBalance', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the balance for a given username', async () => {
    (db.any as jest.Mock).mockResolvedValue([{ balance: 100 }]);

    const result = await getBalance('testUser');

    expect(result).toEqual({ balance: 100, error: false });
  });

  it('should return null balance if user does not exist', async () => {
    (db.any as jest.Mock).mockResolvedValue([]);

    const result = await getBalance('testUser');

    expect(result).toEqual({ balance: null, error: false });
  });

  it('should handle database errors', async () => {
    (db.any as jest.Mock).mockRejectedValue(new Error('Database error'));

    const result = await getBalance('testUser');

    expect(result).toEqual({ balance: null, error: true });
  });
});

describe('getBalance', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should invoke the t.none method', async () => {
    const t = { none: jest.fn() };
    await updateBalance(t as unknown as pgPromise.ITask<{}>, 'testUser', 100);

    expect(t.none).toHaveBeenCalledWith(
      'UPDATE account SET balance = $1 WHERE username = $2',
      [100, 'testUser']
    );
  });
});
