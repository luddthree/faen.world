import { Pool, PoolConnection, createPool } from 'mysql2/promise';
import { randomUUID } from 'node:crypto';
import z from 'zod';
import { generateIconURL } from './utils';

interface Bookmark {
  id: string;
  pageId: string,
  url: string;
  icon_url: string;
  icon_version: number;
  createdAt: Date;
  updatedAt: Date;
  name: string

}

interface AddOptions {
  url: string
  pageId: string
  name: string

}

const pool: Pool = createPool({
  host: '127.0.0.1',
  user: 'ludvik',
  password: 'Password123#@!',
  database: 'linkbase',
  connectionLimit: 10, // Adjust as needed
});

export async function list(pageId:string) {
  const connection: PoolConnection = await pool.getConnection();
  try {
    // @ts-ignore
    const [ rows ]: Bookmark[] = await connection.query('SELECT * FROM pagelinks where pageId="' + pageId
    + '"');
    return rows;
  } finally {
    connection.release();
  }
}

export async function add(options: AddOptions) {
  const params = options;

  const bookmark: Bookmark = {
    id: randomUUID(),
    pageId: params.pageId,
    url: params.url,
    icon_url: generateIconURL(params.url),
    icon_version: Math.floor(Date.now() / 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: params.name,

  };

  const connection: PoolConnection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO pagelinks (id, pageId, url, icon_url, icon_version, created_at, updated_at, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        bookmark.id,
        bookmark.pageId,
        bookmark.url,
        bookmark.icon_url,
        bookmark.icon_version,
        bookmark.createdAt,
        bookmark.updatedAt,
        bookmark.name,

      ]
    );
    return bookmark;
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
    const [ existingBookmark ] = await connection.query('SELECT id FROM pagelinks WHERE id = ?', [params.id]);
    
    // @ts-ignore
    if (!existingBookmark[0]) {
      return { message: `Bookmark with ID ${params.id} not found.` };
    }

    await connection.execute('DELETE FROM pagelinks WHERE id = ?', [params.id]);

    return { message: `Bookmark with ID ${params.id} has been deleted.` };
  } finally {
    connection.release();
  }
}
