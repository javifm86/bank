import db from '../database/connect';

interface Movement {
  username: string;
  date: string;
  type: string;
  amount: number;
  balance: number;
}

async function getMovementsDb(user: string) {
  try {
    const results = await db.any<Movement>(
      'SELECT date, type, amount, balance FROM movements WHERE username = $1 ORDER BY date DESC',
      [user]
    );

    return {
      movements: results,
      error: false,
    };
  } catch (error) {
    return { movements: [], error: true };
  }
}

export { getMovementsDb };
