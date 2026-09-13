const http = require('http');
const { checkPurchase } = require('../controllers/purchaseController');

// Test 1: Direct controller function test with safe purchase
console.log('--- Test 1: Controller Direct Test (Safe Purchase) ---');
const mockReqSafe = {
  body: {
    currentBalance: 1500,
    nextPayDate: '2026-09-25',
    itemCost: 200,
    fixedExpenses: 500
  }
};
const mockResSafe = {
  status: function(code) {
    console.log('Res Status:', code);
    return this;
  },
  json: function(data) {
    console.log('Res JSON:', JSON.stringify(data, null, 2));
    if (!data.isSafe) {
      console.error('FAILED Test 1: Expected isSafe to be true');
      process.exit(1);
    }
  }
};
checkPurchase(mockReqSafe, mockResSafe);

// Test 2: Controller Direct Test (Unsafe Purchase)
console.log('\n--- Test 2: Controller Direct Test (Unsafe Purchase) ---');
const mockReqUnsafe = {
  body: {
    currentBalance: 1000,
    nextPayDate: '2026-09-25',
    itemCost: 900,
    fixedExpenses: 500
  }
};
const mockResUnsafe = {
  status: function(code) {
    console.log('Res Status:', code);
    return this;
  },
  json: function(data) {
    console.log('Res JSON:', JSON.stringify(data, null, 2));
    if (data.isSafe) {
      console.error('FAILED Test 2: Expected isSafe to be false');
      process.exit(1);
    }
  }
};
checkPurchase(mockReqUnsafe, mockResUnsafe);

// Test 3: Validation Error Test
console.log('\n--- Test 3: Validation Error Test ---');
const mockReqInvalid = {
  body: {
    currentBalance: 'invalid',
    nextPayDate: '',
    itemCost: -50,
    fixedExpenses: 100
  }
};
const mockResInvalid = {
  statusCode: 200,
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('Res Status:', this.statusCode, 'JSON:', JSON.stringify(data, null, 2));
    if (this.statusCode !== 400) {
      console.error('FAILED Test 3: Expected 400 status code');
      process.exit(1);
    }
  }
};
checkPurchase(mockReqInvalid, mockResInvalid);

console.log('\nAll direct controller tests passed successfully!');
