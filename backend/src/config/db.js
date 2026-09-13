const { Pool } = require('pg');

let isDbAvailable = false;

// Determine host / socket configuration
const getDbHost = () => {
  if (process.env.INSTANCE_CONNECTION_NAME) {
    return `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }
  return process.env.DB_HOST || 'localhost';
};

const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'budget_db',
  host: getDbHost(),
  port: parseInt(process.env.DB_PORT || '5432', 10),
  // Optional timeouts for fast fallback
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 10000,
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Warning] Unexpected idle client error:', err.message);
  isDbAvailable = false;
});

const query = async (text, params) => {
  return pool.query(text, params);
};

const setDbAvailable = (status) => {
  isDbAvailable = Boolean(status);
};

const getIsDbAvailable = () => {
  return isDbAvailable;
};

module.exports = {
  pool,
  query,
  setDbAvailable,
  getIsDbAvailable,
};
