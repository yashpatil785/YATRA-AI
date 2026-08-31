'use client';

import React from 'react';
import { useTrip } from '@/context/TripContext';
import {
  Award,
  Zap,
  CloudRain,
  Sun,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  Cpu,
  Flame,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

export default function DemoScenarioPage() {
  const {
    currentItinerary,
    liveContext,
    triggerHeavyRainSimulation,
    resetWeatherToSunny,
    activeProposal,
    applyProposal,
    setActiveTab,
    setSelectedDay
  } = useTrip();

  const isRaining = liveContext.currentWeather.condition === 'heavy_rain' || liveContext.currentWeather.condition === 'rainy';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* SIH Showcase Hero Card */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-teal-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-400/40 text-xs font-black uppercase tracking-wider shadow-sm">
              <Award className="w-4 h-4 text-orange-400" />
              <span>Smart India Hackathon 2026 Presentation</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-bold shadow-sm">
              Theme: AI-Driven Tourism & Context-Aware Systems
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            Real-Time Dynamic Replanning Showcase
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Standard travel planners generate static itineraries that fail when rain, traffic, or crowd spikes strike. 
            <strong className="text-white"> YatraAI</strong> continuously monitors live telemetry and automatically re-optimizes routes using a 6-factor weighted algorithm.
          </p>

          {/* Interactive Trigger Control Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={triggerHeavyRainSimulation}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer ${
                isRaining
                  ? 'bg-red-500 text-white ring-4 ring-red-500/30 animate-pulse border border-white/20'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white hover:scale-105 shadow-orange-950/40 border border-white/20'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>{isRaining ? '⛈️ Rain Active (Simulation Running)' : '⛈️ Step 1: Simulate Severe Monsoon Rain'}</span>
            </button>

            <button
              onClick={resetWeatherToSunny}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Reset to Clear Skies</span>
            </button>

            <button
              onClick={() => {
                setSelectedDay(2);
                setActiveTab('itinerary');
              }}
              className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs sm:text-sm border border-teal-400/40 backdrop-blur-md transition-colors cursor-pointer"
            >
              <span>View Full Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3-Step Demonstration Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Step 1 Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 text-white">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center justify-center font-black text-xs">
              01
            </span>
            <span className="text-[11px] font-black text-slate-400 uppercase">Baseline Plan</span>
          </div>
          <h3 className="text-base font-extrabold text-white">Curated 3-Day Goa Circuit</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Itinerary starts with Day 1 Old Goa Heritage, Day 2 North Goa Coastal Beaches, and Day 3 South Goa Spice Farms.
          </p>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <strong className="text-white">Day 2 Target:</strong> Baga Beach at 2:00 PM (Outdoor leisure & beach activities).
          </div>
        </div>

        {/* Step 2 Card */}
        <div className={`rounded-3xl p-6 border shadow-xl space-y-3 transition-all backdrop-blur-xl text-white ${
          isRaining
            ? 'bg-red-950/40 border-red-500/50 ring-2 ring-red-500/30 shadow-red-950/40'
            : 'bg-white/5 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
              isRaining ? 'bg-red-500 text-white animate-bounce shadow' : 'bg-white/10 text-slate-300 border border-white/10'
            }`}>
              02
            </span>
            <span className="text-[11px] font-black text-slate-400 uppercase">Live Sensor Trigger</span>
          </div>
          <h3 className="text-base font-extrabold text-white">Conflict Detection</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            IMD radar detects 45mm/hr torrential rain. YatraAI flags outdoor activities with an immediate hazard tag.
          </p>
          <div className={`p-3 rounded-2xl border text-xs ${
            isRaining ? 'bg-red-500/20 border-red-400/40 text-red-200 font-bold' : 'bg-white/5 border-white/10 text-slate-300'
          }`}>
            {isRaining ? '⚠️ Baga Beach flagged as weather-vulnerable.' : 'Waiting for trigger simulation...'}
          </div>
        </div>

        {/* Step 3 Card */}
        <div className={`rounded-3xl p-6 border shadow-xl space-y-3 transition-all backdrop-blur-xl text-white ${
          activeProposal || currentItinerary.isReplanned
            ? 'bg-teal-950/40 border-teal-400/50 ring-2 ring-teal-400/30 shadow-teal-950/40'
            : 'bg-white/5 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
              activeProposal || currentItinerary.isReplanned
                ? 'bg-teal-500 text-white shadow'
                : 'bg-white/10 text-slate-300 border border-white/10'
            }`}>
              03
            </span>
            <span className="text-[11px] font-black text-slate-400 uppercase">Dynamic Resolution</span>
          </div>
          <h3 className="text-base font-extrabold text-white">Algorithmic Re-Optimization</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Replaces Baga Beach with <strong className="text-teal-300">Goa Chitra Museum</strong> (Indoor, 94% Match, zero budget impact, saves 15 min transit).
          </p>
          <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-xs text-teal-200 font-bold">
            Seamless one-tap schedule re-sequencing.
          </div>
        </div>

      </div>

      {/* Active Proposal Live Action Card */}
      {activeProposal && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950/50 backdrop-blur-md text-white text-[11px] font-black uppercase border border-white/20">
                  Replan Ready
                </span>
                <span className="text-xs font-bold text-slate-100">
                  Day {activeProposal.affectedDayNumber} Substitution
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Swap {activeProposal.affectedActivity.poi.name} → {activeProposal.replacementActivity.poi.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-100 mt-1 max-w-xl">
                {activeProposal.rationale}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => applyProposal(activeProposal)}
                className="px-6 py-3 rounded-2xl bg-[#020617] hover:bg-slate-900 text-white font-black text-xs sm:text-sm shadow-xl border border-white/20 transition-all hover:scale-105 cursor-pointer"
              >
                Apply Replan & Update Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Algorithmic Foundation & Math Equation Box */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-orange-400">
          <Cpu className="w-4 h-4 text-orange-400" />
          <span>Core Recommendation Engine Math</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto">
          Score = 0.30 · InterestMatch + 0.20 · ContextSuitability + 0.15 · DistanceEfficiency + 0.15 · Rating + 0.10 · BudgetTier + 0.10 · Popularity
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xs">
            <span className="text-orange-400 font-bold">Interest Match (30%)</span>
            <p className="text-slate-400 text-[11px] mt-0.5">Category alignment against stated traveler tags.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xs">
            <span className="text-teal-400 font-bold">Context Suitability (20%)</span>
            <p className="text-slate-400 text-[11px] mt-0.5">Penalizes outdoor venues during rain / heat spikes.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xs">
            <span className="text-indigo-400 font-bold">Distance Efficiency (15%)</span>
            <p className="text-slate-400 text-[11px] mt-0.5">Haversine cluster optimization minimizing travel transit.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
