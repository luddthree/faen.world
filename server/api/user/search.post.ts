import mysql from 'mysql2/promise';

// MySQL database configuration
const dbConfig = {
  host: '127.0.0.1',
  user: 'ludvik',
  password: 'Password123#@!',
  database: 'linkbase',
};

export default defineEventHandler(async (event) => {
  let body = JSON.parse(await readRawBody(event) || '{}');
  const connection = await mysql.createConnection(dbConfig);
  try {
      // Only select the fields that should be returned in the response
      const [rows] = await connection.execute(
          'SELECT id, name, bio FROM user WHERE name = ?',
          [body.name]
      );

      // If a row is found, the login is successful
      if (rows.length > 0) {
          return rows[0];
      }
  } catch (error) {
      console.error('Error checking login:', error);
      return false;
  } finally {
      // Close the database connection
      connection.end();
  }
});
