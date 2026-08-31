'use client';

import React, { useState } from 'react';
import { useTrip } from '@/context/TripContext';
import { TravelPreferences, Destination } from '@/lib/types';
import { INDIAN_DESTINATIONS } from '@/lib/data/mockData';
import {
  Sparkles,
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Compass,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  Flame,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

const INTEREST_OPTIONS = [
  { id: 'heritage', label: 'Heritage & History', icon: '🏛️' },
  { id: 'beaches', label: 'Beaches & Coastal', icon: '🏖️' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
  { id: 'street_food', label: 'Authentic Street Food', icon: '🍲' },
  { id: 'nightlife', label: 'Nightlife & Lounges', icon: '🍸' },
  { id: 'spiritual', label: 'Temples & Spiritual', icon: '🛕' },
  { id: 'photography', label: 'Scenic Photography', icon: '📸' },
  { id: 'adventure', label: 'Adventure & Treks', icon: '🧗' },
  { id: 'shopping', label: 'Handicrafts & Markets', icon: '🛍️' },
  { id: 'museums', label: 'Art & Museums', icon: '🎨' },
  { id: 'wellness', label: 'Ayurveda & Wellness', icon: '🧘' },
  { id: 'cruises', label: 'Boating & Cruises', icon: '⛵' }
];

export default function TripPlannerWizard() {
  const { generateNewTrip, destinations } = useTrip();

  const [step, setStep] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<TravelPreferences>({
    destinationId: 'dest-goa',
    durationDays: 3,
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    interests: ['heritage', 'beaches', 'street_food', 'photography', 'nightlife'],
    travelPace: 'moderate',
    budgetTier: 'moderate',
    totalBudget: 18000,
    travelGroup: 'friends',
    travelersCount: 2,
    preferredTransport: 'cab'
  });

  const selectedDestination = destinations.find(d => d.id === preferences.destinationId) || destinations[0];

  const filteredDestinations = destinations.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.knownFor.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleInterest = (interestId: string) => {
    setPreferences(prev => {
      const exists = prev.interests.includes(interestId);
      const updated = exists
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests: updated };
    });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateNewTrip(preferences);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Wizard Step Progress Bar */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 text-white border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase text-orange-400 tracking-wider">
            Step {step} of 4 • {step === 1 ? 'Destination' : step === 2 ? 'Schedule & Group' : step === 3 ? 'Interests & Vibe' : 'Budget & Optimization'}
          </span>
          <span className="text-xs text-slate-400 font-bold">{Math.round((step / 4) * 100)}% Complete</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 rounded-full shadow-md"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white">
        
        {/* STEP 1: Select Destination */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Where do you want to explore?</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select from 12 curated Indian tourism hubs backed by real-time telemetry and 70+ attractions.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Goa, Jaipur, Varanasi, Kerala, Ladakh..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-orange-400 backdrop-blur-md transition-colors"
              />
            </div>

            {/* Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredDestinations.map(dest => {
                const isSelected = preferences.destinationId === dest.id;
                return (
                  <div
                    key={dest.id}
                    onClick={() => setPreferences({ ...preferences, destinationId: dest.id })}
                    className={`relative rounded-2xl overflow-hidden p-3 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-32 ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-lg bg-orange-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <Image
                      src={dest.imageUrl}
                      alt={dest.name}
                      fill
                      className="object-cover -z-10 brightness-[0.4] transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex items-center justify-between text-white">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md border border-white/10">
                        {dest.state}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow">
                          ✓
                        </div>
                      )}
                    </div>

                    <div className="text-white">
                      <h4 className="font-extrabold text-sm leading-tight">{dest.name}</h4>
                      <p className="text-[11px] text-slate-200 line-clamp-1">{dest.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Duration, Dates & Travel Group */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Trip Schedule & Group</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Customize your journey duration and companion dynamics for tailored pace calculations.
              </p>
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wide text-slate-300">
                Duration: <strong className="text-orange-400">{preferences.durationDays} Days</strong>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, durationDays: d })}
                    className={`py-3 rounded-2xl font-black text-xs border transition-all ${
                      preferences.durationDays === d
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-white/20 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Group */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wide text-slate-300">
                Traveling With
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'solo', label: 'Solo Traveler', icon: '🎒', count: 1 },
                  { id: 'couple', label: 'Couple / Duo', icon: '👫', count: 2 },
                  { id: 'friends', label: 'Friends Group', icon: '🎉', count: 4 },
                  { id: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧', count: 3 }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPreferences({
                      ...preferences,
                      travelGroup: g.id as any,
                      travelersCount: g.count
                    })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      preferences.travelGroup === g.id
                        ? 'bg-orange-500/20 border-orange-400/60 ring-1 ring-orange-500/40 text-orange-200 font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                    }`}
                  >
                    <span className="text-xl block mb-1">{g.icon}</span>
                    <span className="text-xs block font-bold">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Pace */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wide text-slate-300">
                Desired Travel Pace
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'relaxed', label: 'Relaxed & Scenic', sub: '2-3 stops/day' },
                  { id: 'moderate', label: 'Balanced & Optimal', sub: '3-4 stops/day' },
                  { id: 'fast-paced', label: 'Action-Packed', sub: '5+ stops/day' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, travelPace: p.id as any })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      preferences.travelPace === p.id
                        ? 'bg-white/20 border-white/30 text-white shadow-lg font-black'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{p.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Vibes */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">What are your interests?</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select themes to calibrate our 6-Factor Recommendation Engine ({preferences.interests.length} selected).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {INTEREST_OPTIONS.map(opt => {
                const isSelected = preferences.interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-white/20 text-white font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs leading-tight font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Budget & Optimization */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Budget & Final Calibration</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                YatraAI will optimize activity choices, dining recommendations, and transit modes within your target spend.
              </p>
            </div>

            {/* Budget Tier */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wide text-slate-300">
                Budget Tier
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'budget', label: 'Backpacker / Budget', budget: 9000, desc: 'Public transit & street food' },
                  { id: 'moderate', label: 'Comfort / Moderate', budget: 18000, desc: 'Cabs, boutique stays & cafes' },
                  { id: 'luxury', label: 'Premium / Luxury', budget: 35000, desc: 'Private chauffeur & heritage fine dining' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setPreferences({
                      ...preferences,
                      budgetTier: b.id as any,
                      totalBudget: b.budget
                    })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      preferences.budgetTier === b.id
                        ? 'bg-white/20 border-white/30 text-white shadow-xl ring-1 ring-white/30 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{b.label}</span>
                    <span className="text-base font-black text-teal-300 block mt-1">₹{b.budget.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optimization Engine Summary Box */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start space-x-3 shadow-lg">
              <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <p className="font-bold text-white">Optimization Engine Ready</p>
                <p className="mt-0.5 leading-relaxed">
                  Targeting <strong>{selectedDestination.name}</strong> for <strong>{preferences.durationDays} days</strong> with <strong>{preferences.travelGroup}</strong>. Calculating 6-factor POI rankings, proximity clustering, and opening hour alignments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 shadow-md transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-950/40 border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Computing Optimal Route...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Smart Itinerary</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
