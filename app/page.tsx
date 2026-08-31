'use client';

import React, { useState } from 'react';
import { TripProvider, useTrip } from '@/context/TripContext';
import Navbar from '@/components/Navbar';
import LandingHero from '@/components/LandingHero';
import TripPlannerWizard from '@/components/TripPlannerWizard';
import TimelineItinerary from '@/components/TimelineItinerary';
import InteractiveMap from '@/components/InteractiveMap';
import BudgetDashboard from '@/components/BudgetDashboard';
import LiveContextPanel from '@/components/LiveContextPanel';
import DynamicReplanningModal from '@/components/DynamicReplanningModal';
import AIAssistantDrawer from '@/components/AIAssistantDrawer';
import SwapActivityModal from '@/components/SwapActivityModal';
import WhyThisPlaceModal from '@/components/WhyThisPlaceModal';
import DemoScenarioPage from '@/components/DemoScenarioPage';
import AttractionsExplorer from '@/components/AttractionsExplorer';
import ShareTripModal from '@/components/ShareTripModal';
import { ItineraryActivity, POI } from '@/lib/types';
import {
  Calendar,
  Compass,
  MapPin,
  Map as MapIcon,
  IndianRupee,
  PieChart,
  Sparkles,
  Award,
  ChevronRight,
  Flame
} from 'lucide-react';

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    currentItinerary,
    liveContext
  } = useTrip();

  const [swapTarget, setSwapTarget] = useState<{ dayNumber: number; activity: ItineraryActivity } | null>(null);
  const [whyTarget, setWhyTarget] = useState<POI | null>(null);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col antialiased selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      
      {/* Frosted Glass Atmospheric Glowing Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-indigo-900/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-teal-900/20 rounded-full blur-[140px]" />
        <div className="absolute top-[25%] right-[5%] w-[35%] h-[35%] bg-orange-950/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[5%] w-[40%] h-[40%] bg-blue-950/30 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Workspace Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* TAB 1: LANDING & DISCOVER */}
          {activeTab === 'landing' && <LandingHero />}

          {/* TAB 2: TRIP PLANNER WIZARD */}
          {activeTab === 'planner' && <TripPlannerWizard />}

          {/* TAB 3: ITINERARY VIEW */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              
              {/* View Header with Mode Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">
                      Smart Itinerary Engine
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 text-[11px] font-bold">
                      {currentItinerary.days.length} Days • {currentItinerary.preferences.budgetTier}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{currentItinerary.title}</h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {currentItinerary.aiSummary}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 text-xs font-bold transition-all backdrop-blur-md"
                  >
                    Edit Preferences
                  </button>
                  <button
                    onClick={() => setActiveTab('budget')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg shadow-orange-950/40 cursor-pointer"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Open Budget Tracker</span>
                  </button>
                </div>
              </div>

              {/* Itinerary Grid Layout: Timeline + Context & Budget Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Main Timeline */}
                <div className="lg:col-span-8 space-y-6">
                  <TimelineItinerary
                    onSwapClick={(dayNumber, activity) => setSwapTarget({ dayNumber, activity })}
                    onWhyClick={(poi) => setWhyTarget(poi)}
                  />
                </div>

                {/* Right Sidebar: Live Context Telemetry + Budget Overview */}
                <div className="lg:col-span-4 space-y-6">
                  <LiveContextPanel />
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-white shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-white">Quick Budget Health</h3>
                      <button
                        onClick={() => setActiveTab('budget')}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        View Details →
                      </button>
                    </div>
                    <div className="space-y-2.5 pt-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Total Estimated:</span>
                        <strong className="text-white font-black">₹{currentItinerary.totalEstimatedBudgetINR.total.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Allocated Spend:</span>
                        <strong className="text-teal-400 font-black">₹{currentItinerary.preferences.totalBudget.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: ROUTE MAP VIEW */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Full Geographic Circuit Map</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visualized transit sequence and waypoint coordinates for {currentItinerary.destination.name}.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 text-xs font-bold transition-all backdrop-blur-md"
                >
                  Back to Timeline
                </button>
              </div>

              <InteractiveMap fullHeight />
            </div>
          )}

          {/* TAB 5: ATTRACTIONS EXPLORER */}
          {activeTab === 'explore' && (
            <AttractionsExplorer onWhyClick={(poi) => setWhyTarget(poi)} />
          )}

          {/* TAB 6: BUDGET INTELLIGENCE */}
          {activeTab === 'budget' && <BudgetDashboard />}

          {/* TAB 7: SIH DEMO SHOWCASE */}
          {activeTab === 'demo' && <DemoScenarioPage />}

        </main>

        {/* Dynamic Replanning Modal */}
        <DynamicReplanningModal />

        {/* Share Trip & Collaboration Modal */}
        <ShareTripModal />

        {/* Floating AI Concierge Drawer */}
        <AIAssistantDrawer />

        {/* Swap Activity Modal */}
        {swapTarget && (
          <SwapActivityModal
            dayNumber={swapTarget.dayNumber}
            activity={swapTarget.activity}
            onClose={() => setSwapTarget(null)}
          />
        )}

        {/* Why This Place AI Explanation Modal */}
        {whyTarget && (
          <WhyThisPlaceModal
            poi={whyTarget}
            onClose={() => setWhyTarget(null)}
          />
        )}

        {/* Footer */}
        <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl py-8 text-center text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="font-bold text-slate-300">
              YatraAI • AI-Based Personalized Tourism & Dynamic Real-Time Replanning Platform
            </p>
            <p className="text-slate-400">
              Built for Smart India Hackathon (SIH 2026) with 6-Factor Weighted Scoring & Live Context Engine.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <TripProvider>
      <MainAppContent />
    </TripProvider>
  );
}
