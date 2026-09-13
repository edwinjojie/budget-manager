/**
 * Controller for evaluating purchase safety, saving transactions, and retrieving transaction history.
 */

const { query, getIsDbAvailable } = require('../config/db');

// In-memory fallback storage when PostgreSQL is not connected
const inMemoryTransactions = [];
let nextInMemoryId = 1;

function calculateDaysUntil(nextPayDate) {
  const targetDate = new Date(nextPayDate);
  if (isNaN(targetDate.getTime())) {
    return null;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const diffMs = startOfTarget - startOfToday;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
}

exports.checkPurchase = async (req, res) => {
  const { currentBalance, nextPayDate, itemCost, fixedExpenses, itemName, item_name } = req.body;
  const name = itemName || item_name || 'Unnamed Item';

  // Validation
  const errors = [];
  if (typeof currentBalance !== 'number' || isNaN(currentBalance)) {
    errors.push('currentBalance must be a valid number.');
  }
  if (typeof itemCost !== 'number' || isNaN(itemCost) || itemCost < 0) {
    errors.push('itemCost must be a non-negative number.');
  }
  if (typeof fixedExpenses !== 'number' || isNaN(fixedExpenses) || fixedExpenses < 0) {
    errors.push('fixedExpenses must be a non-negative number.');
  }
  if (!nextPayDate) {
    errors.push('nextPayDate is required.');
  }

  const daysUntilPayday = calculateDaysUntil(nextPayDate);
  if (!nextPayDate || daysUntilPayday === null) {
    errors.push('nextPayDate must be a valid date string (e.g. YYYY-MM-DD).');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid request parameters',
      details: errors
    });
  }

  // Financial Calculations
  const disposableBeforePurchase = currentBalance - fixedExpenses;
  const dailyDisposableBeforePurchase = Number((disposableBeforePurchase / daysUntilPayday).toFixed(2));

  const disposableAfterPurchase = currentBalance - fixedExpenses - itemCost;
  const dailyDisposableAfterPurchase = Number((disposableAfterPurchase / daysUntilPayday).toFixed(2));

  const isSafe = disposableAfterPurchase >= 0;

  let message;
  if (isSafe) {
    message = `Purchase is safe! You will have ₹${dailyDisposableAfterPurchase.toFixed(2)} daily disposable cash remaining for the next ${daysUntilPayday} day(s) until your next payday.`;
  } else {
    const deficit = Math.abs(disposableAfterPurchase);
    message = `Warning: Exceeds Safe Budget! This item exceeds your disposable budget by ₹${deficit.toFixed(2)}. Your remaining daily cash would be -₹${Math.abs(dailyDisposableAfterPurchase).toFixed(2)}.`;
  }

  // Save transaction to DB or fallback memory
  let savedTransaction = null;
  if (getIsDbAvailable()) {
    try {
      const insertQuery = `
        INSERT INTO transactions (item_name, item_cost, is_safe)
        VALUES ($1, $2, $3)
        RETURNING id, item_name, item_cost, is_safe, created_at;
      `;
      const dbRes = await query(insertQuery, [name, itemCost, isSafe]);
      savedTransaction = dbRes.rows[0];
    } catch (err) {
      console.warn('[PostgreSQL Warning] Failed to insert transaction, storing in memory fallback:', err.message);
    }
  }

  // Fallback to in-memory if DB insert was skipped or failed
  if (!savedTransaction) {
    savedTransaction = {
      id: nextInMemoryId++,
      item_name: name,
      item_cost: itemCost,
      is_safe: isSafe,
      created_at: new Date().toISOString(),
      source: 'in_memory_fallback'
    };
    inMemoryTransactions.unshift(savedTransaction);
  }

  return res.json({
    isSafe,
    summary: {
      currentBalance,
      fixedExpenses,
      itemCost,
      nextPayDate,
      daysUntilPayday
    },
    metrics: {
      disposableBeforePurchase: Number(disposableBeforePurchase.toFixed(2)),
      dailyDisposableBeforePurchase,
      disposableAfterPurchase: Number(disposableAfterPurchase.toFixed(2)),
      dailyDisposableAfterPurchase
    },
    message,
    savedTransaction
  });
};

exports.getTransactions = async (req, res) => {
  if (getIsDbAvailable()) {
    try {
      const selectQuery = `
        SELECT id, item_name, item_cost, is_safe, created_at
        FROM transactions
        ORDER BY created_at DESC
        LIMIT 50;
      `;
      const dbRes = await query(selectQuery);
      return res.json({
        source: 'postgresql',
        transactions: dbRes.rows
      });
    } catch (err) {
      console.warn('[PostgreSQL Warning] Failed to fetch transactions from DB, returning in-memory fallback:', err.message);
    }
  }

  return res.json({
    source: 'in_memory_fallback',
    transactions: inMemoryTransactions
  });
};
