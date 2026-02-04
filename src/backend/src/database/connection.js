// Database connection
// NOTE: This uses a simple approach - consider connection pooling for production

const { Pool } = require('pg');

// Sometimes we use DATABASE_URL, sometimes individual vars
// This inconsistency is intentional - the contractor couldn't decide
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log connection errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  // TODO: Add proper error handling
});

// Helper to run queries
// NOTE: This doesn't handle errors consistently - sometimes throws, sometimes returns null
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    // Uncomment for debugging:
    // console.log('Query executed', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error; // Sometimes we throw, sometimes we don't - inconsistent!
  }
}

// Get a client for transactions
// WARNING: Make sure to release the client!
async function getClient() {
  const client = await pool.connect();
  return client;
}

// Different export styles used in this codebase
module.exports = {
  query,
  getClient,
  pool, // Exposing pool directly - not ideal but contractor did it
};

// Also export as default for ESM-style imports (inconsistent!)
module.exports.default = { query, getClient, pool };
