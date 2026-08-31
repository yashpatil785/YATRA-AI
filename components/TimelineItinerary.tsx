'use client';

import React, { useState } from 'react';
import { useTrip } from '@/context/TripContext';
import { ItineraryActivity, POI } from '@/lib/types';
import {
  Clock,
  MapPin,
  Car,
  Footprints,
  IndianRupee,
  Sparkles,
  RefreshCw,
  Sun,
  CloudRain,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Navigation,
  CheckCircle,
  ExternalLink,
  Flame,
  AlertTriangle,
  Share2,
  ThumbsUp,
  Users
} from 'lucide-react';
import Image from 'next/image';

interface TimelineItineraryProps {
  onSwapClick?: (dayNumber: number, activity: ItineraryActivity) => void;
  onWhyClick?: (poi: POI) => void;
}

export default function TimelineItinerary({ onSwapClick, onWhyClick }: TimelineItineraryProps) {
  const {
    currentItinerary,
    selectedDay,
    setSelectedDay,
    liveContext,
    setActiveTab,
    setActiveMapPOI,
    setIsShareModalOpen,
    collaborators,
    activityVotes,
    voteOnActivity
  } = useTrip();

  const [expandedScores, setExpandedScores] = useState<Record<string, boolean>>({});

  const toggleScoreBreakdown = (activityId: string) => {
    setExpandedScores(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const day = currentItinerary.days.find(d => d.dayNumber === selectedDay) || currentItinerary.days[0];
  const isRaining = liveContext.currentWeather.condition === 'heavy_rain' || liveContext.currentWeather.condition === 'rainy';

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Day Selector and Share CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Day Selector Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin flex-1">
          {currentItinerary.days.map(d => {
            const isSelected = d.dayNumber === selectedDay;
            const hasVulnerable = d.activities.some(a => a.isWeatherVulnerable);
            return (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDay(d.dayNumber)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border text-left transition-all shrink-0 cursor-pointer backdrop-blur-xl ${
                  isSelected
                    ? 'bg-white/10 border-orange-500/80 shadow-lg ring-1 ring-orange-500/50 text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  isSelected ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'bg-white/10 text-slate-200'
                }`}>
                  D{d.dayNumber}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-white">{d.date}</span>
                    {isRaining && hasVulnerable && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="Weather impact on outdoor items" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                    <span>{d.activities.length} stops</span>
                    <span>•</span>
                    <span>{d.weatherForecast.tempC}°C</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Collaborators & Share Button */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {/* Avatar cluster */}
          <div
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center -space-x-2 bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-2xl border border-white/10 cursor-pointer transition-all"
            title="Collaborators on this trip"
          >
            {collaborators.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.avatarBg} border-2 border-[#020617] flex items-center justify-center text-[10px] font-black text-white shadow-sm`}
                title={`${c.name} (${c.role})`}
              >
                {c.name.slice(0, 1).toUpperCase()}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#020617] flex items-center justify-center text-[10px] font-bold text-slate-300">
                +{collaborators.length - 3}
              </div>
            )}
            <span className="ml-2 text-xs font-bold text-slate-300 pr-1 hidden md:inline">
              {collaborators.length} Travelers
            </span>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-950/40 border border-white/20 transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Trip</span>
          </button>
        </div>
      </div>

      {/* Selected Day Header Card */}
      {day && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-teal-500/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-400/30 text-[11px] font-black uppercase tracking-wider">
                  {day.theme}
                </span>
                {currentItinerary.isReplanned && (
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span>Dynamically Re-optimized</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{day.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {day.daySummary}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0 shadow-lg">
              <div className="text-center px-2">
                <p className="text-[10px] uppercase font-black text-slate-400">Total Distance</p>
                <p className="text-sm font-bold text-white mt-0.5">{day.totalDistanceKm} km</p>
              </div>
              <div className="h-7 w-px bg-white/10" />
              <div className="text-center px-2">
                <p className="text-[10px] uppercase font-black text-slate-400">Transit Time</p>
                <p className="text-sm font-bold text-white mt-0.5">{day.totalTransitTimeMinutes} min</p>
              </div>
              <div className="h-7 w-px bg-white/10" />
              <div className="text-center px-2">
                <p className="text-[10px] uppercase font-black text-slate-400">Day Cost</p>
                <p className="text-sm font-bold text-teal-300 mt-0.5">₹{day.totalEstimatedCostINR}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Activities Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-teal-500 before:to-slate-700">
        {day?.activities.map((activity, index) => {
          const isScoreExpanded = expandedScores[activity.id];
          const isOutdoorAndRaining = isRaining && activity.isWeatherVulnerable;

          return (
            <div key={activity.id} className="relative group">
              
              {/* Timeline Connector Dot */}
              <div className={`absolute -left-6 sm:-left-8 top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black shadow-md transition-transform group-hover:scale-110 ${
                isOutdoorAndRaining
                  ? 'bg-red-500 border-white text-white animate-pulse'
                  : 'bg-orange-500 border-white text-white'
              }`}>
                {index + 1}
              </div>

              {/* Transit step from previous (if any) */}
              {activity.transitFromPrevious && index > 0 && (
                <div className="mb-4 -mt-2 inline-flex items-center space-x-2 text-xs bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl shadow-xs">
                  <Car className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-bold text-white">{activity.transitFromPrevious.durationMinutes} min transit</span>
                  <span className="text-slate-400">({activity.transitFromPrevious.distanceKm} km via {activity.transitFromPrevious.mode.replace('_', ' ')})</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-teal-300">₹{activity.transitFromPrevious.estimatedCostINR}</span>
                </div>
              )}

              {/* Main Activity Card */}
              <div className={`rounded-3xl border transition-all duration-200 overflow-hidden shadow-xl hover:shadow-2xl backdrop-blur-xl text-white ${
                isOutdoorAndRaining
                  ? 'border-amber-400/80 bg-amber-950/30 ring-1 ring-amber-400/50'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}>
                <div className="p-5 sm:p-6">
                  
                  {/* Top Bar: Time & Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center space-x-2.5">
                      <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        <span>{activity.startTime} - {activity.endTime}</span>
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 uppercase tracking-wide">
                        {activity.slot}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Weather Safety Badge */}
                      {activity.poi.isIndoor ? (
                        <span className="flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                          <ShieldCheck className="w-3 h-3 text-teal-400" />
                          <span>Indoor / Sheltered</span>
                        </span>
                      ) : (
                        <span className={`flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isOutdoorAndRaining
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 animate-pulse'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-400/30'
                        }`}>
                          {isOutdoorAndRaining ? <AlertTriangle className="w-3 h-3 text-amber-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
                          <span>{isOutdoorAndRaining ? 'Weather Alert' : 'Outdoor Landmark'}</span>
                        </span>
                      )}

                      {/* 6-Factor Match Score Badge */}
                      <button
                        onClick={() => toggleScoreBreakdown(activity.id)}
                        className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-400/30 text-xs font-bold transition-colors cursor-pointer"
                        title="Click to view 6-factor score breakdown"
                      >
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span>{activity.matchScore}% Match</span>
                        {isScoreExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4">
                    
                    {/* Photo */}
                    <div className="md:col-span-4 relative h-44 rounded-2xl overflow-hidden shadow-inner group-hover:brightness-105 transition-all border border-white/10">
                      <Image
                        src={activity.poi.imageUrl}
                        alt={activity.poi.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold capitalize">
                        {activity.poi.category}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-300 text-[11px] font-bold">
                        ★ {activity.poi.rating} ({activity.poi.reviewCount.toLocaleString()})
                      </div>
                    </div>

                    {/* Information */}
                    <div className="md:col-span-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-extrabold text-white group-hover:text-orange-400 transition-colors">
                              {activity.poi.name}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              {activity.poi.subcategory} • Avg {activity.poi.averageDurationMinutes} min visit
                            </p>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {activity.poi.description}
                        </p>

                        <div className="mt-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-2 text-xs text-slate-300 backdrop-blur-xs">
                          <Info className="w-4 h-4 text-orange-400 shrink-0" />
                          <p className="line-clamp-1 font-medium">{activity.matchReason}</p>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400">
                          <span>Entry: <strong className="text-teal-300">{activity.poi.entryFeeINR === 0 ? 'Free' : `₹${activity.poi.entryFeeINR}`}</strong></span>
                          <span>•</span>
                          <span>Timings: {activity.poi.openingTime} - {activity.poi.closingTime}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Upvote button */}
                          <button
                            onClick={() => voteOnActivity(activity.id, 1)}
                            className="px-2.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/30 font-bold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                            title="Upvote activity for group plan"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-teal-400" />
                            <span>{activityVotes[activity.id] || 0}</span>
                          </button>

                          <button
                            onClick={() => onWhyClick && onWhyClick(activity.poi)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-bold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Why this place?</span>
                          </button>

                          <button
                            onClick={() => onSwapClick && onSwapClick(day.dayNumber, activity)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Swap Stop</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMapPOI(activity.poi);
                              setActiveTab('map');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border border-white/20 font-bold text-xs transition-all shadow-md flex items-center space-x-1 cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>View on Map</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible 6-Factor Scoring Breakdown */}
                  {isScoreExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                            <span>6-Factor Weighted Scoring Breakdown</span>
                          </span>
                          <span className="text-xs font-black text-orange-400">Total: {activity.matchScore}/100</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Interest Match (30%)</span>
                              <span className="font-bold text-white">27 / 30</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: '90%' }} />
                            </div>
                          </div>

                          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Context Suitability (20%)</span>
                              <span className="font-bold text-white">18 / 20</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-teal-400 rounded-full" style={{ width: '90%' }} />
                            </div>
                          </div>

                          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Distance Efficiency (15%)</span>
                              <span className="font-bold text-white">14 / 15</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-indigo-400 rounded-full" style={{ width: '93%' }} />
                            </div>
                          </div>

                          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Visitor Rating (15%)</span>
                              <span className="font-bold text-white">14 / 15</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: '93%' }} />
                            </div>
                          </div>

                          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Budget Tier (10%)</span>
                              <span className="font-bold text-white">10 / 10</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
                            </div>
                          </div>

                          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Footfall & Popularity (10%)</span>
                              <span className="font-bold text-white">9 / 10</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-purple-400 rounded-full" style={{ width: '90%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
