'use client';

import React from 'react';
import { POI } from '@/lib/types';
import { useTrip } from '@/context/TripContext';
import {
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  Sun,
  CloudRain,
  Navigation
} from 'lucide-react';
import Image from 'next/image';

interface POIRecommendationCardProps {
  poi: POI;
  score?: number;
  matchReason?: string;
  onWhyClick?: (poi: POI) => void;
}

export default function POIRecommendationCard({
  poi,
  score = 92,
  matchReason,
  onWhyClick
}: POIRecommendationCardProps) {
  const { setActiveMapPOI, setActiveTab } = useTrip();

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between group text-white">
      <div>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={poi.imageUrl}
            alt={poi.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-slate-950/40 to-transparent" />

          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold capitalize">
            {poi.category}
          </div>

          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black flex items-center space-x-1 shadow-md border border-white/20">
            <Sparkles className="w-3 h-3" />
            <span>{score}% Match</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold mb-0.5">
              <span>★ {poi.rating}</span>
              <span className="text-slate-300 font-normal">({poi.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <h3 className="text-base font-extrabold tracking-tight truncate text-white">{poi.name}</h3>
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {poi.description}
          </p>

          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{poi.openingTime} - {poi.closingTime}</span>
            <span>•</span>
            <span className="text-teal-300 font-semibold">{poi.entryFeeINR === 0 ? 'Free Entry' : `₹${poi.entryFeeINR}`}</span>
          </div>

          {matchReason && (
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-orange-200 font-medium line-clamp-2 backdrop-blur-xs">
              {matchReason}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center space-x-2">
        <button
          onClick={() => onWhyClick && onWhyClick(poi)}
          className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs border border-white/10 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Why this?</span>
        </button>

        <button
          onClick={() => {
            setActiveMapPOI(poi);
            setActiveTab('map');
          }}
          className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border border-white/20 shadow-md transition-all cursor-pointer"
          title="View on Map"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
