import db from '../database/connect';
import { updateBalance } from './account';

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

async function transactionMovement(
  user: string,
  type: string,
  amount: number,
  newBalance: number
) {
  try {
    await db.tx(async (t) => {
      const queryMovement = t.none(
        'INSERT INTO movements (username, date, type, amount, balance) VALUES ($1, NOW(), $2, $3, $4)',
        [user, type, amount, newBalance]
      );

      const queryBalance = updateBalance(t, user, newBalance);

      await t.batch([queryMovement, queryBalance]);
    });

    return { error: false };
  } catch (error) {
    return { error: true };
  }
}

export { getMovementsDb, transactionMovement };
