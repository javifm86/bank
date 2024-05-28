import { getMovementsDb, transactionMovement } from '../movements';
import db from '../../database/connect';
import { updateBalance } from '../account';

jest.mock('../../database/connect');
jest.mock('../account');

describe('getMovementsDb', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return movements for a given username', async () => {
    const mockMovements = [
      { username: 'testUser', type: 'deposit', amount: 100, balance: 200 },
      { username: 'testUser', type: 'withdraw', amount: 50, balance: 150 },
    ];
    (db.any as jest.Mock).mockResolvedValue(mockMovements);

    const result = await getMovementsDb('testUser');

    expect(result).toEqual({ error: false, movements: mockMovements });
  });

  it('should handle database errors', async () => {
    (db.any as jest.Mock).mockRejectedValue(new Error('Database error'));

    const result = await getMovementsDb('testUser');
    expect(result).toEqual({ error: true, movements: [] });
  });
});

describe('transactionMovement', () => {
  let t: any;

  beforeEach(() => {
    t = {
      none: jest.fn(),
      batch: jest.fn(),
    };
    (db.tx as jest.Mock).mockImplementation((callback) => callback(t));
    (updateBalance as jest.Mock).mockResolvedValue(Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should complete the transaction successfully', async () => {
    const t = {
      none: jest.fn(),
      batch: jest.fn(),
    };

    (db.tx as jest.Mock).mockImplementation((callback) => callback(t));
    (updateBalance as jest.Mock).mockResolvedValue(Promise.resolve());
    t.none.mockResolvedValue(Promise.resolve());
    t.batch.mockResolvedValue(Promise.resolve());

    const result = await transactionMovement('testUser', 'deposit', 100, 200);

    expect(result).toEqual({ error: false });
    expect(t.none).toHaveBeenCalledWith(
      'INSERT INTO movements (username, date, type, amount, balance) VALUES ($1, NOW(), $2, $3, $4)',
      ['testUser', 'deposit', 100, 200]
    );
    expect(updateBalance).toHaveBeenCalledWith(t, 'testUser', 200);
    expect(t.batch).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should handle database errors', async () => {
    (db.tx as jest.Mock).mockRejectedValue(new Error('Database error'));
    const result = await transactionMovement('testUser', 'deposit', 100, 200);

    expect(result).toEqual({ error: true });
  });
});
