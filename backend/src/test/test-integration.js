const express = require('express');
const cors = require('cors');
const http = require('http');
const { initDb } = require('../config/initDb');
const { checkPurchase, getTransactions } = require('../controllers/purchaseController');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.post('/api/check-purchase', checkPurchase);
app.get('/api/transactions', getTransactions);

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const runTest = async () => {
  await initDb();

  const server = app.listen(5002, async () => {
    console.log('Integration test server running on port 5002');

    try {
      // Step 1: Test POST /api/check-purchase
      console.log('\n--- Step 1: Testing POST /api/check-purchase ---');
      const postData = JSON.stringify({
        itemName: 'Ice Cream',
        currentBalance: 5000,
        nextPayDate: '2026-09-30',
        itemCost: 150,
        fixedExpenses: 1200
      });

      const checkRes = await makeRequest({
        hostname: 'localhost',
        port: 5002,
        path: '/api/check-purchase',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, postData);

      console.log('POST Check Response Status:', checkRes.statusCode);
      console.log('Saved Transaction:', checkRes.data.savedTransaction);

      if (checkRes.statusCode !== 200 || !checkRes.data.savedTransaction) {
        throw new Error('POST /api/check-purchase failed');
      }

      // Step 2: Test GET /api/transactions
      console.log('\n--- Step 2: Testing GET /api/transactions ---');
      const historyRes = await makeRequest({
        hostname: 'localhost',
        port: 5002,
        path: '/api/transactions',
        method: 'GET'
      });

      console.log('GET Transactions Response Status:', historyRes.statusCode);
      console.log('Transactions Source:', historyRes.data.source);
      console.log('Transactions Count:', historyRes.data.transactions?.length);

      if (historyRes.statusCode !== 200 || !Array.isArray(historyRes.data.transactions) || historyRes.data.transactions.length === 0) {
        throw new Error('GET /api/transactions failed or returned empty list');
      }

      console.log('\nSUCCESS: Database & Transactions API Integration Test Passed!');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('Integration Test Error:', err);
      server.close(() => process.exit(1));
    }
  });
};

runTest();
