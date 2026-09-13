import React from 'react';
import { CheckCircle2, AlertTriangle, TrendingDown, ArrowUpRight, Clock } from 'lucide-react';

export default function StatusBanner({ result }) {
  if (!result) return null;

  const { isSafe, message, metrics, summary } = result;

  return (
    <div
      className={`rounded-2xl p-6 mb-6 transition-all duration-500 transform border shadow-2xl ${
        isSafe
          ? 'bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-slate-900/90 border-emerald-500/40 shadow-emerald-950/50 text-emerald-100'
          : 'bg-gradient-to-br from-rose-950/80 via-rose-900/40 to-slate-900/90 border-rose-500/40 shadow-rose-950/50 text-rose-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-4 border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl ${
              isSafe ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'
            }`}
          >
            {isSafe ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1 ${
                isSafe ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isSafe ? 'Safe to Buy' : 'Warning: Exceeds Safe Budget'}
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">
              {isSafe ? 'Go Ahead! Item Fits Budget' : 'Caution: Budget Overdraft Risk'}
            </h2>
          </div>
        </div>

        <div className="flex items-baseline gap-1 bg-black/30 px-4 py-2 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400 uppercase font-semibold">Remaining Daily:</span>
          <span
            className={`text-xl font-black font-mono ${
              isSafe ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            ₹{metrics?.dailyDisposableAfterPurchase?.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400">/ day</span>
        </div>
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-medium mb-4">
        {message}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
          <span className="text-slate-400 block mb-0.5">Days to Payday</span>
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {summary?.daysUntilPayday} Days
          </span>
        </div>
        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
          <span className="text-slate-400 block mb-0.5">Disposable Total (After)</span>
          <span className={`font-semibold ${isSafe ? 'text-emerald-300' : 'text-rose-300'}`}>
            ₹{metrics?.disposableAfterPurchase?.toFixed(2)}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-black/20 p-2.5 rounded-lg border border-white/5">
          <span className="text-slate-400 block mb-0.5">Previous Daily Cash</span>
          <span className="font-semibold text-slate-300">
            ₹{metrics?.dailyDisposableBeforePurchase?.toFixed(2)} / day
          </span>
        </div>
      </div>
    </div>
  );
}
