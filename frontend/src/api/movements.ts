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

export default getMovements;
export type { GetMovementsResponse };
