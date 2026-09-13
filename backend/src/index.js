const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/initDb');
const { checkPurchase, getTransactions } = require('./controllers/purchaseController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'Budget Manager API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      checkPurchase: 'POST /api/check-purchase',
      transactions: 'GET /api/transactions'
    }
  });
});

// Purchase Check & Transactions Endpoints
app.post('/api/check-purchase', checkPurchase);
app.get('/api/transactions', getTransactions);

// Fallback 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400)) {
    return res.status(400).json({ error: 'Invalid JSON payload in request body' });
  }
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize Database & Start Server
const startServer = async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Budget Manager Backend server running on port ${PORT}`);
  });
};

startServer();
