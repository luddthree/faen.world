import { Pool, PoolConnection, createPool } from 'mysql2/promise';
import { randomUUID } from 'node:crypto';
import z from 'zod';
import { generateIconURL } from './utils';

interface Bio {
  bio: string;
  id: string;
}

interface AddOptions {
  bios: string
  id: string
}

const pool: Pool = createPool({
  host: '127.0.0.1',
  user: 'ludvik',
  password: 'Password123#@!',
  database: 'linkbase',
  connectionLimit: 10, // Adjust as needed
});

export async function list(userId: string): Promise<Bio[]> {
  const connection = await pool.getConnection();
  try {
    const query = 'SELECT id, bio FROM user WHERE id = ?'; // Exclude sensitive fields like passwords
    const [rows]: [Bio[]] = await connection.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching user bio:', error);
    throw new Error('Failed to fetch user bio.');
  } finally {
    connection.release();
  }
}








export async function add(options: AddOptions) {
  const params = options;

  const addbio: Bio = {
    id: params.id,
    bio: params.bios,
  };

  // Log the addbio object to check its properties
  // console.log('addbio:', addbio);

  const connection: PoolConnection = await pool.getConnection();
  try {
    // Update the bio of the existing user with the provided id
    await connection.execute(
      'UPDATE user SET bio = ? WHERE id = ?',
      [params.bios, params.id]
    );

    return { id: params.id, bio: params.bios };
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
