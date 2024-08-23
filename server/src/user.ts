import { Pool, PoolConnection, createPool } from 'mysql2/promise';
import { randomUUID } from 'node:crypto';
import z from 'zod';
import { generateIconURL } from './utils';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

interface AddOptions {
  url: string
  userId: string
  name: string
  password: string
  email: string
}

const pool: Pool = createPool({
  host: '127.0.0.1',
  user: 'ludvik',
  password: 'Password123#@!',
  database: 'linkbase',
  connectionLimit: 10, // Adjust as needed
});

export async function list(userId:string) {
  const connection: PoolConnection = await pool.getConnection();
  try {
    // @ts-ignore
    const [ rows ]: Bookmark[] = await connection.query('SELECT * FROM bookmarks where userId=' + userId);
    return rows;
  } finally {
    connection.release();
  }
}

export async function add(options: AddOptions) {
  const params = options;

  const Usr: User = {
    id: randomUUID(),
    username: params.name,
    email: params.email,
    password: params.password,
  };

  const connection: PoolConnection = await pool.getConnection();
  try {
    // Check if a user with the same username already exists
    // @ts-ignore
    const [existingUsers]: [User[]] = await connection.query(
      'SELECT * FROM user WHERE name = ?',
      [Usr.username]
    );

    if (existingUsers.length > 0) {
      // User with the same username already exists
      return { error: 'Username already taken.' };
    }

    // Insert new user since username is not taken
    await connection.execute(
      'INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)',
      [
        Usr.id,
        Usr.username,
        Usr.email,
        Usr.password,
      ]
    );
    return Usr;
  } finally {
    connection.release();
  }
}


interface DeleteOptions {
  id: string;
}

const deleteOptionsSchema = z.object({
  id: z.string(),
});

export async function deleteBookmark(options: DeleteOptions) {
  const params = deleteOptionsSchema.parse(options);

  const connection: PoolConnection = await pool.getConnection();
  try {
    const [ existingBookmark ] = await connection.query('SELECT id FROM bookmarks WHERE id = ?', [params.id]);
    
    // @ts-ignore
    if (!existingBookmark[0]) {
      return { message: `Bookmark with ID ${params.id} not found.` };
    }

    await connection.execute('DELETE FROM bookmarks WHERE id = ?', [params.id]);

    return { message: `Bookmark with ID ${params.id} has been deleted.` };
  } finally {
    connection.release();
  }
}
