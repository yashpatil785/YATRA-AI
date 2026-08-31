'use client';

import React, { useState } from 'react';
import { useTrip } from '@/context/TripContext';
import { Sparkles, ShieldCheck, Zap, ArrowRight, X, Cpu, RefreshCw, Award } from 'lucide-react';

export default function SIHInnovationBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { loadDemoScenario } = useTrip();

  if (!isVisible) return null;

  return (
    <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 sm:px-6 relative overflow-hidden text-white shadow-xs">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-teal-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 relative z-10">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 font-black shrink-0">
            <Award className="w-3.5 h-3.5 text-orange-400" />
            <span>SIH 2026 Innovation</span>
          </div>

          <p className="text-slate-300 font-medium leading-tight">
            <strong className="text-white font-bold">Adaptive Context Engine</strong> with 6-Factor Algorithmic Scoring & Real-Time Dynamic Replanning.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={loadDemoScenario}
            className="flex items-center space-x-1.5 px-3.5 py-1 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-md shadow-teal-950/40 transition-all hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Launch Judge Demo</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors hover:bg-white/10"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
