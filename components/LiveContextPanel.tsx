'use client';

import React from 'react';
import { useTrip } from '@/context/TripContext';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Users,
  AlertTriangle,
  Car,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function LiveContextPanel() {
  const {
    liveContext,
    triggerHeavyRainSimulation,
    triggerCrowdSurgeSimulation,
    resetWeatherToSunny,
    activeProposal
  } = useTrip();

  const weather = liveContext.currentWeather;
  const isRaining = weather.condition === 'heavy_rain' || weather.condition === 'rainy';

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 text-white border border-white/10 shadow-2xl space-y-6">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-3 h-3 rounded-full ${isRaining ? 'bg-red-400 animate-ping' : 'bg-teal-400'}`} />
          <h3 className="font-black text-base tracking-tight text-white">Live Environmental Context</h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
          IMD & Sensor Feed
        </span>
      </div>

      {/* Weather Metric Card */}
      <div className={`p-4 rounded-2xl border transition-all backdrop-blur-md ${
        isRaining
          ? 'bg-indigo-950/60 border-indigo-400/50 shadow-inner'
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isRaining ? (
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/40 shadow">
                <CloudRain className="w-6 h-6 animate-bounce" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow">
                <Sun className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-xl font-black text-white">
                {isRaining ? 'Monsoon Downpour' : 'Clear & Sunny'}
              </p>
              <p className="text-xs text-slate-300 capitalize">{weather.tempC}°C Ambient Temperature</p>
            </div>
          </div>
          <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
            isRaining ? 'bg-red-500/20 text-red-300 border border-red-400/40' : 'bg-teal-500/20 text-teal-300 border border-teal-400/40'
          }`}>
            {weather.rainProbability}% Rain Probability
          </span>
        </div>

        {weather.alert && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-950/50 backdrop-blur-md border border-red-400/40 text-xs text-red-200 flex items-start space-x-2 shadow">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="font-medium">{weather.alert}</p>
          </div>
        )}

        {/* Environmental Telemetry */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Humidity: <strong className="text-white">{weather.humidity}%</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Wind className="w-4 h-4 text-teal-400" />
            <span>Wind: <strong className="text-white">{weather.windSpeedKmh} km/h</strong></span>
          </div>
        </div>
      </div>

      {/* Crowd & Footfall Monitor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-orange-400" />
            <span>Crowd Surge Status</span>
          </span>
        </div>

        {liveContext.crowdAlerts.map((alert, i) => (
          <div key={i} className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs flex items-center justify-between shadow-xs">
            <div>
              <p className="font-bold text-white">{alert.poiName}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{alert.recommendation}</p>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
              alert.surgeLevel === 'extreme'
                ? 'bg-red-500/20 text-red-300 border border-red-400/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
            }`}>
              {alert.surgeLevel} ({alert.waitTimeMinutes}m wait)
            </span>
          </div>
        ))}
      </div>

      {/* Traffic Monitoring */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-blue-400" />
            <span>Transit Corridor Delays</span>
          </span>
        </div>

        {liveContext.trafficStatus.map((t, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between">
            <span className="text-slate-300 font-medium truncate max-w-[180px]">{t.corridor}</span>
            <span className={`font-bold ${t.delayMinutes > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
              {t.delayMinutes > 0 ? `+${t.delayMinutes} min delay` : 'Smooth (0m delay)'}
            </span>
          </div>
        ))}
      </div>

      {/* SIH Presentation Simulator Controls */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <p className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
          Real-Time Context Simulator
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={triggerHeavyRainSimulation}
            className="px-3 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-200 text-xs font-black flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Trigger Heavy Rain</span>
          </button>

          <button
            onClick={resetWeatherToSunny}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Clear to Sunny</span>
          </button>
        </div>
      </div>

    </div>
  );
}
