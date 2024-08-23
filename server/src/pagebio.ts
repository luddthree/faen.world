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

export async function list(userId:string) {
  const connection: PoolConnection = await pool.getConnection();
  try {
    // @ts-ignore
    const [ rows ]: Bio[] = await connection.query('SELECT * FROM pages where id="' + userId
    + '"');
    return rows;
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
      'UPDATE pages SET bio = ? WHERE id = ?',
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
