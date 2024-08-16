const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'Password',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'ev_db'
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }

  console.log('Connected to the database');

  // Release the client back to the pool
  release();
});

module.exports = pool;
