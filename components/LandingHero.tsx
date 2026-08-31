'use client';

import React from 'react';
import { useTrip } from '@/context/TripContext';
import DestinationCard from './DestinationCard';
import {
  Sparkles,
  Zap,
  Award,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CloudRain,
  MapPin,
  Clock,
  PieChart,
  Bot
} from 'lucide-react';
import Image from 'next/image';

export default function LandingHero() {
  const { setActiveTab, destinations, loadDemoScenario } = useTrip();

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-black uppercase tracking-wider shadow-inner">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Next-Gen Travel Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white">
            AI-Based Personalized Tourism &{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-teal-300 bg-clip-text text-transparent">
              Dynamic Real-Time Replanning
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Move beyond static travel guides. YatraAI leverages a <strong>6-factor recommendation engine</strong> and <strong>live environmental telemetry</strong> to create and dynamically adapt hyper-personalized itineraries across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-950/40 transition-all hover:scale-105 border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Custom Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={loadDemoScenario}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-teal-950/40 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Interactive Weather Simulation</span>
            </button>

            <button
              onClick={() => setActiveTab('itinerary')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-sm border border-white/10 transition-all backdrop-blur-md"
            >
              <Compass className="w-4 h-4 text-orange-400" />
              <span>Explore Live Itinerary</span>
            </button>
          </div>

          {/* Core Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 text-left">
            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Recommendation Engine</span>
              <p className="text-lg font-black text-orange-400 mt-0.5">6-Factor Scoring</p>
            </div>
            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Context Telemetry</span>
              <p className="text-lg font-black text-teal-400 mt-0.5">Live Weather & Radar</p>
            </div>
            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Replanning Pipeline</span>
              <p className="text-lg font-black text-amber-400 mt-0.5">Automated 6-Step</p>
            </div>
            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Destination Catalog</span>
              <p className="text-lg font-black text-indigo-400 mt-0.5">12 Hubs • 70+ POIs</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3 Core Pillars of YatraAI */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-orange-400">
            Platform Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Engineered for Real-World Indian Tourism
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Pillar 1 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white">6-Factor Weighted Personalization</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Balances Interest Match (30%), Context Suitability (20%), Route Efficiency (15%), Visitor Ratings (15%), Budget (10%), and Crowd Popularity (10%).
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Real-Time Context Telemetry</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ingests live weather forecasts, sudden monsoon rain alerts, local traffic delays, and holiday crowd surges to safeguard traveler safety.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Dynamic Replanning & Rationale</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detects conflicts and instantly suggests optimized indoor alternatives with clear AI rationale, time savings, and zero manual reschedule effort.
            </p>
          </div>

        </div>
      </div>

      {/* Featured Indian Destinations Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Popular Tourism Circuits</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select any destination to generate a smart context-aware itinerary.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Attractions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 6).map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onPlanTrip={() => {
                setActiveTab('planner');
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
