import http from '../utils/http';

interface GetMovementsParams {
  user: string;
}

interface GetMovementsResponse {
  date: string;
  type: 'withdraw' | 'deposit';
  amount: number;
  balance: number;
}

interface PostDepositParams {
  user: string;
  amount: number;
  type: 'withdraw' | 'deposit';
}

async function getMovements(params: GetMovementsParams) {
  try {
    const { data } = await http.get<GetMovementsResponse[]>('/movements', {
      params,
    });
    return {
      error: false,
      data,
    };
  } catch (error) {
    return {
      error: true,
      data: null,
    };
  }
}

async function postMovements(params: PostDepositParams) {
  try {
    await http.post<GetMovementsResponse[]>('/movements', {
      params,
    });
    return {
      error: false,
    };
  } catch (error) {
    return {
      error: true,
    };
  }
}

export { getMovements, postMovements };
export type { GetMovementsResponse };
