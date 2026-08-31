'use client';

import React from 'react';
import { Destination } from '@/lib/types';
import { useTrip } from '@/context/TripContext';
import { MapPin, ArrowRight, Sparkles, Calendar, IndianRupee } from 'lucide-react';
import Image from 'next/image';

interface DestinationCardProps {
  destination: Destination;
  onPlanTrip?: (dest: Destination) => void;
}

export default function DestinationCard({ destination, onPlanTrip }: DestinationCardProps) {
  const { setActiveTab } = useTrip();

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/20 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-between text-white">
      <div>
        {/* Photo Banner */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-slate-950/30 to-transparent" />
          
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-xl bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
            {destination.state}
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-xl font-extrabold tracking-tight">{destination.name}</h3>
            <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">{destination.tagline}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {destination.knownFor.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/5 text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Best: {destination.bestMonths.slice(0, 3).join(', ')}</span>
            </span>
            <span className="font-bold text-teal-300">
              Avg ₹{destination.averageDailyCostINR.moderate}/day
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0">
        <button
          onClick={() => {
            if (onPlanTrip) {
              onPlanTrip(destination);
            } else {
              setActiveTab('planner');
            }
          }}
          className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-orange-500 text-white font-bold text-xs shadow-md border border-white/10 group-hover:border-orange-500 transition-all flex items-center justify-center space-x-1.5 cursor-pointer backdrop-blur-md"
        >
          <span>Plan {destination.name} Trip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
