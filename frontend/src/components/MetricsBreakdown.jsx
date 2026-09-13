import React from 'react';
import { DollarSign, Calendar, Tag, Shield, ArrowDownRight, Sparkles } from 'lucide-react';

export default function MetricsBreakdown({ result }) {
  if (!result || !result.metrics) return null;

  const { metrics, summary, isSafe } = result;

  const diffDaily = (metrics.dailyDisposableAfterPurchase - metrics.dailyDisposableBeforePurchase).toFixed(2);

  return (
    <div className="glass-panel rounded-2xl p-6 mb-6">
      <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        Detailed Impact Analysis
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Before Purchase */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Before Purchase</div>
          <div className="text-2xl font-bold text-slate-200">
            ₹{metrics.disposableBeforePurchase.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Daily Allowance:</span>
            <span className="font-semibold text-slate-300">₹{metrics.dailyDisposableBeforePurchase.toFixed(2)} / day</span>
          </div>
        </div>

        {/* Card 2: After Purchase */}
        <div className={`rounded-xl p-4 border ${isSafe ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'}`}>
          <div className="text-xs text-slate-400 font-medium mb-1">After Item Purchase</div>
          <div className={`text-2xl font-bold ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
            ₹{metrics.disposableAfterPurchase.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Daily Allowance:</span>
            <span className={`font-semibold ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{metrics.dailyDisposableAfterPurchase.toFixed(2)} / day
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>Daily Cash Impact per day:</span>
        <span className="font-semibold text-rose-400 flex items-center gap-1">
          <ArrowDownRight className="w-3.5 h-3.5" />
          -₹{Math.abs(diffDaily).toFixed(2)} / day
        </span>
      </div>
    </div>
  );
}
