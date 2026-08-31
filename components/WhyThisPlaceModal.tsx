'use client';

import React, { useState, useEffect } from 'react';
import { useTrip } from '@/context/TripContext';
import { POI } from '@/lib/types';
import {
  Sparkles,
  X,
  ShieldCheck,
  Star,
  Clock,
  Compass,
  Tag,
  Info,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

interface WhyThisPlaceModalProps {
  poi: POI | null;
  onClose: () => void;
}

export default function WhyThisPlaceModal({ poi, onClose }: WhyThisPlaceModalProps) {
  const { currentItinerary, liveContext } = useTrip();
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!poi) return;
    const targetPoi = poi;
    let isMounted = true;

    async function fetchExplanation() {
      try {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            poi: targetPoi,
            preferences: currentItinerary.preferences,
            liveContext
          })
        });
        const data = await res.json();
        if (isMounted) {
          setExplanation(data.explanation || `${targetPoi.name} was chosen for its high cultural alignment, excellent ${targetPoi.rating}★ rating, and optimal location within your itinerary circuit.`);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setExplanation(`${targetPoi.name} is recommended because its ${targetPoi.category} nature strongly aligns with your interest tags. With ${targetPoi.rating}★ from thousands of travelers, it provides prime cultural immersion within your budget.`);
          setLoading(false);
        }
      }
    }

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [poi, currentItinerary, liveContext]);

  if (!poi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#020617]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header with Photo */}
        <div className="relative h-48 w-full">
          <Image
            src={poi.imageUrl}
            alt={poi.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-sm">
                {poi.category}
              </span>
              <span className="text-xs font-black text-amber-300">
                ★ {poi.rating} ({poi.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{poi.name}</h3>
          </div>
        </div>

        {/* AI Explanation Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-950/40 backdrop-blur-md border border-indigo-400/40 shadow-lg">
            <div className="flex items-center space-x-2 text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Personalized AI Match Rationale</span>
            </div>
            {loading ? (
              <div className="flex items-center space-x-2 text-xs text-slate-300 py-2">
                <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
                <span>Generating personalized AI breakdown...</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {explanation}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wide">Key Highlights & Tips</h4>
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-slate-300">
              <p className="font-bold text-white mb-1">Famous For:</p>
              <p className="leading-relaxed">{poi.famousFor}</p>
              <p className="font-bold text-white mt-2.5 mb-1">Insider Tip:</p>
              <p className="text-orange-300 font-medium leading-relaxed">{poi.tips}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400 font-medium">
            <span>Entry Fee: <strong className="text-teal-300">{poi.entryFeeINR === 0 ? 'Free' : `₹${poi.entryFeeINR}`}</strong></span>
            <span>Timings: <strong className="text-slate-200">{poi.openingTime} - {poi.closingTime}</strong></span>
          </div>
        </div>

        <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-950/40 border border-white/20 transition-all cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
}
