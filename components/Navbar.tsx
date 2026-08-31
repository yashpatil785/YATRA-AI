'use client';

import React, { useState } from 'react';
import { useTrip } from '@/context/TripContext';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Map as MapIcon,
  IndianRupee,
  PieChart,
  Bell,
  CloudRain,
  Sun,
  Bot,
  Layers,
  ChevronRight,
  Flame,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    liveContext,
    triggerHeavyRainSimulation,
    resetWeatherToSunny,
    notifications,
    markNotificationRead,
    clearNotifications,
    isAssistantOpen,
    setIsAssistantOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    loadDemoScenario,
    currentItinerary
  } = useTrip();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSimMenu, setShowSimMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isRaining = liveContext.currentWeather.condition === 'heavy_rain' || liveContext.currentWeather.condition === 'rainy';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-teal-500 flex items-center justify-center shadow-lg shadow-orange-950/40 border border-white/20">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-amber-300 via-orange-300 to-teal-300 bg-clip-text text-transparent">
                  YatraAI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Context-Aware Adaptive Travel Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'landing'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'planner'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>

            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'itinerary'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Itinerary</span>
              {currentItinerary && (
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'budget'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Budget Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'explore'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Attractions</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Share Trip Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-teal-300 font-bold text-xs shadow-md backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
              title="Share Trip & Collaborate"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Share Trip</span>
            </button>

            {/* Live Context Weather Trigger Pill */}
            <div className="relative">
              <button
                onClick={() => setShowSimMenu(!showSimMenu)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all ${
                  isRaining
                    ? 'bg-indigo-950/60 border-indigo-400/50 text-indigo-200 animate-pulse shadow-lg shadow-indigo-950/50'
                    : 'bg-white/10 hover:bg-white/15 border-white/10 text-amber-300'
                }`}
                title="Simulate Real-Time Context"
              >
                {isRaining ? (
                  <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="hidden xs:inline">{isRaining ? 'Monsoon Storm' : 'Sunny 31°C'}</span>
              </button>

              {/* Simulation Dropdown */}
              {showSimMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#020617]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1">
                    Live Context Simulator
                  </div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        triggerHeavyRainSimulation();
                        setShowSimMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <CloudRain className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="font-bold">Simulate Heavy Rain</p>
                          <p className="text-[10px] text-indigo-300/70">Triggers dynamic indoor replanning</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                    </button>

                    <button
                      onClick={() => {
                        resetWeatherToSunny();
                        setShowSimMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-amber-400" />
                        <div>
                          <p className="font-bold">Reset to Clear Weather</p>
                          <p className="text-[10px] text-slate-400">Restore default environmental state</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-[10px] font-black text-white flex items-center justify-center animate-bounce shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-[#020617]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3.5 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-xs text-white">Live Travel Alerts</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold border border-white/10">
                        {notifications.length}
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-slate-400 hover:text-orange-400 font-bold transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No active notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.read
                              ? 'bg-white/5 border-white/5 text-slate-400'
                              : 'bg-white/10 border-white/15 text-slate-200 hover:border-orange-500/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-orange-400 flex items-center gap-1">
                              {n.type === 'weather' ? '⛈️ Weather' : n.type === 'traffic' ? '🚗 Traffic' : '✨ Itinerary'}
                            </span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="font-bold text-white mb-0.5">{n.title}</p>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Floating Toggle */}
            <button
              onClick={() => setIsAssistantOpen(!isAssistantOpen)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-950/40 border border-white/20 transition-all hover:scale-105"
            >
              <Bot className="w-3.5 h-3.5 animate-bounce" />
              <span>AI Concierge</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
