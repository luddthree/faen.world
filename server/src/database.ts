import { createPool, Pool, PoolConnection } from "mysql2/promise";

let pool: Pool;
let initialized = false;

export const getDatabase = async () => {
  if (!pool) {
    pool = createPool({
      host: "127.0.0.1",
      user: "ludvik",
      password: "Password123#@!",
      database: "linkbase",
      connectionLimit: 10, // Adjust as needed
    });
  }

  const connection: PoolConnection = await pool.getConnection();

  if (!initialized) {
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id VARCHAR(255) PRIMARY KEY,
            userId VARCHAR(255),
            url TEXT NOT NULL,
            icon_url TEXT NOT NULL,
            icon_version INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL
        );`);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS \`users\` (
            id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL,
            email TEXT,
            password TEXT
        );
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS pages (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          user_id VARCHAR(255)
        );`);

      initialized = true;
    } catch (error) {
      console.error("Error initializing database:", error);
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  }

  return pool;
};
