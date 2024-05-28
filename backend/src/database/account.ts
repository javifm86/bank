import pgPromise from 'pg-promise';
import db from '../database/connect';

interface Account {
  username: string;
  balance: number;
}

async function getBalance(username: string) {
  let balance: number | null = null;

  try {
    const results = await db.any<Account>(
      'SELECT balance FROM account WHERE username = $1',
      [username]
    );

    if (results.length) {
      balance = results[0].balance;
    }

    return {
      balance,
      error: false,
    };
  } catch (error) {
    console.error('An error ocurred retrieving balance', error);
    return {
      balance,
      error: true,
    };
  }
}

function updateBalance(
  t: pgPromise.ITask<{}>,
  username: string,
  newBalance: number
) {
  return t.none('UPDATE account SET balance = $1 WHERE username = $2', [
    newBalance,
    username,
  ]);
}

export { getBalance, updateBalance };
