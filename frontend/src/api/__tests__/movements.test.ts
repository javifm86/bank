import http from '../../utils/http';
import { getMovements, postMovements } from '../movements';

jest.mock('../../utils/http');

describe('postMovements', () => {
  it('should return error=false', async () => {
    (http.post as jest.Mock).mockResolvedValue({
      error: false,
    });

    const { error } = await postMovements({
      amount: 1000,
      type: 'deposit',
    });

    expect(error).toBe(false);
  });

  it('should handle error', async () => {
    (http.post as jest.Mock).mockRejectedValue({
      error: true,
    });

    const { error } = await postMovements({
      amount: 1000,
      type: 'deposit',
    });

    expect(error).toBe(true);
  });
});

describe('getMovements', () => {
  it('should return movements', async () => {
    (http.get as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    const { data, error } = await getMovements();

    expect(data).toStrictEqual([]);
    expect(error).toBe(false);
  });

  it('should handle error', async () => {
    (http.get as jest.Mock).mockRejectedValue({
      error: true,
    });

    const { data, error } = await getMovements();

    expect(data).toBe(null);
    expect(error).toBe(true);
  });
});
