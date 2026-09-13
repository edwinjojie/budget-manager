const { pool, setDbAvailable } = require('./db');

const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      item_name VARCHAR(255),
      item_cost NUMERIC(12, 2) NOT NULL,
      is_safe BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    try {
      await client.query(createTableQuery);
      setDbAvailable(true);
      console.log('[PostgreSQL] Database initialized successfully. "transactions" table is ready.');
    } finally {
      client.release();
    }
  } catch (err) {
    setDbAvailable(false);
    console.warn('[PostgreSQL Warning] Could not connect to PostgreSQL database:', err.message);
    console.warn('[PostgreSQL Warning] Operating in graceful in-memory fallback mode.');
  }
};

module.exports = { initDb };
