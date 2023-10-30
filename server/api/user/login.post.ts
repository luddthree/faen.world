import mysql from 'mysql2/promise';

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'ludvik',
  password: 'Password123#@!',
  database: 'linkbase',
};

export default defineEventHandler( async (event) => {
    let body =  JSON.parse(await readRawBody(event) || '{}');
    const connection = await mysql.createConnection(dbConfig);
    try {
      // Query the database to check if the username and password match
      const [rows] = await connection.execute(
        'SELECT * FROM user WHERE name = ? AND password = ?',
        [body.name, body.password]
      );
  
      // If a row is found, the login is successful
          // @ts-ignore

      if (rows.length > 0) {
            // @ts-ignore

        return rows[0];
      }
    } catch (error) {
      console.error('Error checking login:', error);
      return false;
    } finally {
      // Close the database connection
      connection.end();
    }
})

