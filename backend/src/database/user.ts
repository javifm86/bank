import db from '../database/connect';

interface User {
  username: string;
  password: string;
}

async function getUser(username: string) {
  let passwordHash: string | null = null;
  let user: string | null = null;

  try {
    const results = await db.any<User>(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (results.length) {
      passwordHash = results[0].password;
      user = results[0].username;
    }

    return {
      passwordHash,
      username: user,
      error: false,
    };
  } catch (error) {
    return { passwordHash, username: user, error: true };
  }
}

export { getUser };
