import React, { useState } from 'react';
import Header from './components/Header';
import PurchaseForm from './components/PurchaseForm';
import StatusBanner from './components/StatusBanner';
import MetricsBreakdown from './components/MetricsBreakdown';
import { AlertCircle, HelpCircle } from 'lucide-react';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Use VITE_API_URL or fallback to relative path /api (proxied by Vite) or http://localhost:5000/api
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/check-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details?.join(', ') || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to connect to backend server on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header />

      <main className="max-w-3xl mx-auto px-4">
        {/* Error Alert if API fails */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">API Connection Error</span>
              <span>{error}</span>
              <span className="block text-xs text-rose-300/80 mt-1">
                Make sure your backend Node server is running on port 5000 (`npm start` inside `/backend`).
              </span>
            </div>
          </div>
        )}

        {/* Input Form */}
        <PurchaseForm onCalculate={handleCalculate} loading={loading} />

        {/* Dynamic Status Banner */}
        <StatusBanner result={result} />

        {/* Metrics Breakdown */}
        <MetricsBreakdown result={result} />

        {/* Helper Footer Card */}
        <div className="glass-panel rounded-xl p-4 text-xs text-slate-400 border border-slate-800 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300">How safety is evaluated:</strong> The system subtracts fixed expenses and the item price from your current balance to find your remaining disposable funds. That amount is divided by the days remaining until payday to compute your new daily disposable budget. If your remaining disposable funds stay ≥ ₹0, the purchase is marked <span className="text-emerald-400 font-semibold">Safe to Buy</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
