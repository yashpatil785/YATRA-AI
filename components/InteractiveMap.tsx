'use client';

import React, { useState, useMemo } from 'react';
import { useTrip } from '@/context/TripContext';
import { POI, ItineraryActivity } from '@/lib/types';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Calendar,
  Compass,
  Car,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

interface InteractiveMapProps {
  fullHeight?: boolean;
}

export default function InteractiveMap({ fullHeight = false }: InteractiveMapProps) {
  const {
    currentItinerary,
    selectedDay,
    setSelectedDay,
    activeMapPOI,
    setActiveMapPOI
  } = useTrip();

  const [filterDay, setFilterDay] = useState<number | 'all'>(selectedDay);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedActivity, setSelectedActivity] = useState<ItineraryActivity | null>(null);

  // Collect activities to display based on filter
  const displayedActivities = useMemo(() => {
    if (filterDay === 'all') {
      return currentItinerary.days.flatMap(d => d.activities);
    }
    const dayObj = currentItinerary.days.find(d => d.dayNumber === filterDay);
    return dayObj ? dayObj.activities : currentItinerary.days[0]?.activities || [];
  }, [currentItinerary, filterDay]);

  // Compute bounding box and relative coordinate projection for smooth canvas SVG
  const mapCoordinates = useMemo(() => {
    const lats = displayedActivities.map(a => a.poi.lat);
    const lngs = displayedActivities.map(a => a.poi.lng);

    if (lats.length === 0) {
      return {
        points: [],
        minLat: 15.2, maxLat: 15.6, minLng: 73.7, maxLng: 74.3
      };
    }

    const minLat = Math.min(...lats) - 0.04;
    const maxLat = Math.max(...lats) + 0.04;
    const minLng = Math.min(...lngs) - 0.04;
    const maxLng = Math.max(...lngs) + 0.04;

    const points = displayedActivities.map((act, idx) => {
      const x = ((act.poi.lng - minLng) / (maxLng - minLng || 0.01)) * 80 + 10;
      // Invert Y because SVG coordinates increase downwards
      const y = (1 - (act.poi.lat - minLat) / (maxLat - minLat || 0.01)) * 75 + 12;
      return {
        activity: act,
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
        index: idx + 1
      };
    });

    return { points, minLat, maxLat, minLng, maxLng };
  }, [displayedActivities]);

  // Build SVG path string for the route polyline
  const polylinePath = useMemo(() => {
    if (mapCoordinates.points.length < 2) return '';
    return mapCoordinates.points
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
      .join(' ');
  }, [mapCoordinates]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#020617]/90 backdrop-blur-2xl shadow-2xl flex flex-col ${
      fullHeight ? 'h-[750px]' : 'h-[500px]'
    }`}>
      
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Day Filter Chips */}
        <div className="flex items-center space-x-1.5 bg-[#020617]/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-xl pointer-events-auto">
          <button
            onClick={() => setFilterDay('all')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterDay === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md border border-white/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            All Circuit
          </button>
          {currentItinerary.days.map(d => (
            <button
              key={d.dayNumber}
              onClick={() => {
                setFilterDay(d.dayNumber);
                setSelectedDay(d.dayNumber);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterDay === d.dayNumber
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md border border-white/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>

        {/* Legend / Metrics Pill */}
        <div className="hidden sm:flex items-center space-x-3 bg-[#020617]/80 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-white/10 text-xs font-bold text-slate-300 shadow-xl pointer-events-auto">
          <span className="flex items-center space-x-1 text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>{displayedActivities.length} Waypoints</span>
          </span>
          <span>•</span>
          <span className="text-slate-200 font-semibold">
            {currentItinerary.destination.name} Circuit
          </span>
        </div>
      </div>

      {/* Interactive Map Canvas */}
      <div className="relative w-full flex-1 overflow-hidden select-none bg-[#020617]">
        
        {/* Dynamic Stylized Map Background (Coastal / Urban Grid) */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        
        {/* Geographic Topographic Contour Accents */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C150,200 350,50 500,120 C650,190 900,100 1200,250 L1200,800 L0,800 Z" fill="#0f766e" />
          <path d="M0,300 C300,150 600,400 900,280 C1100,200 1300,350 1600,300 L1600,800 L0,800 Z" fill="#1e3a8a" />
        </svg>

        {/* Route Polylines and Markers */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-auto"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Route Glow Shadow */}
          {polylinePath && (
            <path
              d={polylinePath}
              fill="none"
              stroke="#f97316"
              strokeWidth="1.2"
              strokeOpacity="0.4"
              filter="url(#glow)"
            />
          )}

          {/* Animated Route Line */}
          {polylinePath && (
            <path
              d={polylinePath}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="0.8"
              strokeDasharray="2, 1"
              className="animate-[dash_20s_linear_infinite]"
            />
          )}
        </svg>

        {/* HTML Interactive Pin Overlays */}
        {mapCoordinates.points.map((pt) => {
          const isSelected = selectedActivity?.id === pt.activity.id || activeMapPOI?.id === pt.activity.poi.id;
          return (
            <div
              key={pt.activity.id}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
              onClick={() => {
                setSelectedActivity(pt.activity);
                setActiveMapPOI(pt.activity.poi);
              }}
            >
              {/* Outer Pulse */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-full bg-orange-500/40 animate-ping" />
              )}

              {/* Pin Body */}
              <div className={`flex items-center justify-center rounded-2xl shadow-xl transition-all duration-300 transform group-hover:scale-125 ${
                isSelected
                  ? 'w-10 h-10 bg-gradient-to-tr from-orange-500 to-amber-400 text-white ring-4 ring-orange-500/40 shadow-orange-500/50'
                  : 'w-8 h-8 bg-slate-950/90 text-white border-2 border-orange-500/80 hover:border-teal-400'
              }`}>
                <span className="font-extrabold text-xs">{pt.index}</span>
              </div>

              {/* Hover Tooltip Label */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-40">
                <div className="bg-[#020617]/95 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap">
                  {pt.activity.poi.name}
                  <span className="text-orange-400 ml-1">★ {pt.activity.poi.rating}</span>
                </div>
                <div className="w-2 h-2 bg-[#020617] rotate-45 -mt-1 border-r border-b border-white/10" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Waypoint Detail Card (Bottom Overlay) */}
      {selectedActivity && (
        <div className="absolute bottom-4 left-4 right-4 z-30 max-w-xl mx-auto bg-[#020617]/90 backdrop-blur-2xl rounded-2xl p-4 border border-white/15 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between gap-3">
            
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
              <Image
                src={selectedActivity.poi.imageUrl}
                alt={selectedActivity.poi.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-400/40 shadow-xs">
                  Stop #{displayedActivities.findIndex(a => a.id === selectedActivity.id) + 1}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedActivity.startTime} - {selectedActivity.endTime}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">{selectedActivity.poi.name}</h4>
              <p className="text-xs text-slate-300 truncate">{selectedActivity.poi.famousFor}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Bottom Map Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1.5">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2))}
          className="p-2 rounded-xl bg-[#020617]/80 hover:bg-[#020617] text-slate-300 hover:text-white border border-white/10 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
          className="p-2 rounded-xl bg-[#020617]/80 hover:bg-[#020617] text-slate-300 hover:text-white border border-white/10 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
