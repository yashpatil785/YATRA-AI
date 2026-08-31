'use client';

import React, { useState } from 'react';
import { useTrip } from '@/context/TripContext';
import { POI } from '@/lib/types';
import POIRecommendationCard from './POIRecommendationCard';
import { Search, Filter, Sparkles, MapPin } from 'lucide-react';

interface AttractionsExplorerProps {
  onWhyClick: (poi: POI) => void;
}

export default function AttractionsExplorer({ onWhyClick }: AttractionsExplorerProps) {
  const { allPOIs, destinations, currentItinerary } = useTrip();

  const [selectedDestId, setSelectedDestId] = useState<string>(currentItinerary.destination.id);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'heritage', 'beach', 'nature', 'spiritual', 'market', 'museum', 'experience'];

  const filteredPOIs = allPOIs.filter(p => {
    const matchesDest = selectedDestId === 'all' || p.destinationId === selectedDestId;
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.famousFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDest && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Filter Header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Curated Attraction Catalog</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore 70+ attractions across India indexed with verified timings, entry fees, and crowd factors.
            </p>
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attractions, forts, beaches..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-orange-400 backdrop-blur-md transition-colors"
            />
          </div>
        </div>

        {/* Destination Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedDestId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
              selectedDestId === 'all'
                ? 'bg-white/20 text-white border border-white/20 shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            All India ({allPOIs.length})
          </button>
          {destinations.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDestId(d.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                selectedDestId === d.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/40 border border-white/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500/30 text-orange-300 border border-orange-400/40 shadow-xs'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* POI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPOIs.map(poi => (
          <POIRecommendationCard
            key={poi.id}
            poi={poi}
            score={Math.round(85 + (poi.rating * 2.5))}
            matchReason={`Highly rated in ${poi.category} category with ${poi.rating}★ rating.`}
            onWhyClick={onWhyClick}
          />
        ))}
      </div>

    </div>
  );
}
