import React, { useState } from 'react';
import { Wallet, Receipt, ShoppingBag, Calendar, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const PRESETS = [
  { name: '🍦 Ice Cream', cost: 150 },
  { name: '☕ Gourmet Coffee', cost: 350 },
  { name: '👟 New Sneakers', cost: 3500 },
  { name: '🎮 Video Game', cost: 4499 },
  { name: '📱 Smartphone', cost: 54999 },
];

export default function PurchaseForm({ onCalculate, loading }) {
  // Default date: 15 days from today
  const getDefaultPayday = () => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  };

  const [currentBalance, setCurrentBalance] = useState('45000');
  const [fixedExpenses, setFixedExpenses] = useState('18000');
  const [itemName, setItemName] = useState('Ice Cream');
  const [itemCost, setItemCost] = useState('250');
  const [nextPayDate, setNextPayDate] = useState(getDefaultPayday());

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      currentBalance: parseFloat(currentBalance) || 0,
      fixedExpenses: parseFloat(fixedExpenses) || 0,
      itemCost: parseFloat(itemCost) || 0,
      nextPayDate
    });
  };

  const handlePresetSelect = (preset) => {
    setItemName(preset.name.replace(/^[^\s]+\s/, '')); // strip emoji for name
    setItemCost(preset.cost.toString());
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 mb-6 shadow-xl">
      <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Financial Details
        </h2>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
          Currency: ₹ INR
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Bank Balance & Fixed Expenses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              Current Bank Balance (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                placeholder="e.g. 45000"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-rose-400" />
              Fixed Bills / Expenses (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={fixedExpenses}
                onChange={(e) => setFixedExpenses(e.target.value)}
                placeholder="e.g. 18000"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all font-mono font-medium text-sm"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Item Name & Item Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              Item Name
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Ice Cream, New Phone"
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
              Item Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={itemCost}
                onChange={(e) => setItemCost(e.target.value)}
                placeholder="e.g. 250"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-mono font-medium text-sm"
              />
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-all active:scale-95 flex items-center gap-1"
              >
                <span>{preset.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">₹{preset.cost}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Next Payday Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            Next Payday Date
          </label>
          <input
            type="date"
            required
            value={nextPayDate}
            onChange={(e) => setNextPayDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-sm font-mono"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold tracking-wide shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Evaluating Purchase Safety...
            </>
          ) : (
            <>
              Check Purchase Safety
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
