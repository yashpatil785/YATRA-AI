'use client';

import React, { useState, useEffect } from 'react';
import { useTrip } from '@/context/TripContext';
import {
  AlertTriangle,
  Sparkles,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Clock,
  Car,
  IndianRupee,
  X,
  Zap,
  Check
} from 'lucide-react';
import Image from 'next/image';

export default function DynamicReplanningModal() {
  const { activeProposal, applyProposal, dismissProposal } = useTrip();
  const [activeStep, setActiveStep] = useState<number>(6); // Complete by default or animated

  if (!activeProposal) return null;

  const original = activeProposal.affectedActivity;
  const replacement = activeProposal.replacementActivity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#020617]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-black text-orange-400 tracking-wider">
                  Adaptive Travel Intelligence
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-400/30 text-[10px] font-black">
                  Day {activeProposal.affectedDayNumber} Replan Ready
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Dynamic Real-Time Replanning</h3>
            </div>
          </div>

          <button
            onClick={dismissProposal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Environmental Trigger Alert Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 backdrop-blur-md border border-indigo-400/40 flex items-start space-x-3 shadow-lg">
            <CloudRain className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-indigo-300 uppercase">Trigger Event Detected</p>
              <p className="text-sm font-bold text-white mt-0.5">{activeProposal.triggerEvent}</p>
              <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">{activeProposal.rationale}</p>
            </div>
          </div>

          {/* 6-Step Resolution Pipeline */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Automated 6-Step Resolution Pipeline</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeProposal.stepByStepResolution.map((step) => (
                <div
                  key={step.step}
                  className="p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start space-x-2 shadow-xs"
                >
                  <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-white leading-tight">{step.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Before vs After Comparison */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Activity Substitution Diff
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Original Outdoor Activity */}
              <div className="p-4 rounded-2xl bg-red-950/30 backdrop-blur-md border border-red-500/30 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-400/30">
                    Original Outdoor Plan
                  </span>
                  <span className="text-xs text-red-400 line-through font-semibold">
                    {original.startTime}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-red-500/20">
                    <Image
                      src={original.poi.imageUrl}
                      alt={original.poi.name}
                      fill
                      className="object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-300 line-through">{original.poi.name}</h4>
                    <p className="text-xs text-red-400">Suspended due to rain alert</p>
                  </div>
                </div>
              </div>

              {/* Proposed Sheltered Activity */}
              <div className="p-4 rounded-2xl bg-teal-950/30 backdrop-blur-md border border-teal-400/40 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    Optimized Replacement
                  </span>
                  <span className="text-xs text-teal-300 font-bold">
                    {replacement.startTime}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-teal-400/40">
                    <Image
                      src={replacement.poi.imageUrl}
                      alt={replacement.poi.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{replacement.poi.name}</h4>
                    <p className="text-xs text-teal-300">Sheltered indoor museum • {replacement.matchScore}% Match</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Efficiency Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Transit Time Impact</span>
              <p className="font-bold text-teal-300 mt-0.5">Saves ~{activeProposal.timeSavingsMinutes} min</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Budget Difference</span>
              <p className="font-bold text-white mt-0.5">
                {activeProposal.budgetDifferenceINR === 0 ? '₹0 (Exact match)' : `₹${activeProposal.budgetDifferenceINR} INR`}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 font-medium">Safety & Comfort</span>
              <p className="font-bold text-emerald-400 mt-0.5">100% Rain Protected</p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 sm:p-6 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={dismissProposal}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            Keep Original Schedule
          </button>

          <button
            onClick={() => applyProposal(activeProposal)}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-950/40 border border-white/20 transition-all hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>Apply Dynamic Replan Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}
