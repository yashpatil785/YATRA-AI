'use client';

import React, { useState } from 'react';
import { useTrip } from '@/context/TripContext';
import { ItineraryActivity, POI } from '@/lib/types';
import { ALL_POIS } from '@/lib/data/mockData';
import { rankPOIs } from '@/lib/engine/recommendation';
import {
  X,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Sun,
  CloudRain,
  IndianRupee,
  Clock,
  Check
} from 'lucide-react';
import Image from 'next/image';

interface SwapActivityModalProps {
  dayNumber: number;
  activity: ItineraryActivity;
  onClose: () => void;
}

export default function SwapActivityModal({ dayNumber, activity, onClose }: SwapActivityModalProps) {
  const { currentItinerary, swapActivityInItinerary, liveContext } = useTrip();

  // Find alternative POIs in same destination
  const destPOIs = ALL_POIS.filter(p => p.destinationId === currentItinerary.destination.id && p.id !== activity.poi.id);
  const rankedAlternatives = rankPOIs(
    destPOIs,
    currentItinerary.preferences,
    liveContext,
    activity.slot,
    { lat: activity.poi.lat, lng: activity.poi.lng }
  ).slice(0, 6);

  const handleSelectSwap = (replacementPOI: POI) => {
    swapActivityInItinerary(dayNumber, activity.id, replacementPOI);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#020617]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-black text-orange-400 tracking-wider">
              Customize Schedule
            </span>
            <h3 className="text-lg font-black text-white">Swap Activity on Day {dayNumber}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Replacing: <strong className="text-slate-200">{activity.poi.name}</strong> ({activity.startTime} - {activity.endTime})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alternatives List */}
        <div className="p-5 overflow-y-auto space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wide">
            Ranked Alternatives ({rankedAlternatives.length} Best Matches)
          </p>

          {rankedAlternatives.map(alt => (
            <div
              key={alt.poi.id}
              onClick={() => handleSelectSwap(alt.poi)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/60 cursor-pointer transition-all flex items-center justify-between gap-4 group backdrop-blur-md shadow-sm"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <Image
                    src={alt.poi.imageUrl}
                    alt={alt.poi.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/5">
                      {alt.poi.category}
                    </span>
                    <span className="text-xs font-black text-orange-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{alt.totalScore}% Match</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate mt-1 group-hover:text-orange-400 transition-colors">
                    {alt.poi.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{alt.matchReason}</p>
                </div>
              </div>

              <button className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shrink-0 flex items-center space-x-1 shadow-md border border-white/20">
                <Check className="w-3.5 h-3.5" />
                <span>Select</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
