import React from 'react';
import { Wallet, ShieldCheck, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-6 px-4 mb-6 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Budget Manager
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <span>Safe Purchase Evaluator</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-400 font-semibold">INR (₹)</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Real-time Financial Safety</span>
        </div>
      </div>
    </header>
  );
}
