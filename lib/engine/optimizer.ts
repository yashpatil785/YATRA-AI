import { POI, TravelPreferences, Destination, CompleteItinerary, ItineraryDay, ItineraryActivity, TransportMode, LiveContextStatus } from '../types';
import { calculateDistanceKm, rankPOIs } from './recommendation';

/**
 * Calculates estimated transit duration, cost and traffic level.
 */
export function estimateTransit(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: TransportMode = 'cab'
) {
  const distanceKm = calculateDistanceKm(fromLat, fromLng, toLat, toLng);
  let durationMinutes = 10;
  let estimatedCostINR = 50;
  let trafficLevel: 'low' | 'moderate' | 'heavy' = 'low';

  switch (mode) {
    case 'walking':
      durationMinutes = Math.round(distanceKm * 12); // ~5 km/h
      estimatedCostINR = 0;
      trafficLevel = 'low';
      break;
    case 'auto_rickshaw':
      durationMinutes = Math.max(8, Math.round(distanceKm * 3.5 + 4));
      estimatedCostINR = Math.max(30, Math.round(25 + distanceKm * 15));
      trafficLevel = distanceKm > 10 ? 'moderate' : 'low';
      break;
    case 'rental_bike':
      durationMinutes = Math.max(8, Math.round(distanceKm * 2.8 + 2));
      estimatedCostINR = Math.max(20, Math.round(distanceKm * 8));
      trafficLevel = 'low';
      break;
    case 'metro':
      durationMinutes = Math.max(10, Math.round(distanceKm * 2.2 + 8));
      estimatedCostINR = Math.max(20, Math.round(10 + distanceKm * 4));
      trafficLevel = 'low';
      break;
    case 'cab':
    default:
      durationMinutes = Math.max(10, Math.round(distanceKm * 3.0 + 5));
      estimatedCostINR = Math.max(100, Math.round(80 + distanceKm * 22));
      trafficLevel = distanceKm > 15 ? 'heavy' : 'moderate';
      break;
  }

  return {
    distanceKm,
    durationMinutes,
    mode,
    estimatedCostINR,
    trafficLevel
  };
}

/**
 * Builds a complete optimized multi-day itinerary.
 */
export function buildOptimizedItinerary(
  destination: Destination,
  preferences: TravelPreferences,
  availablePOIs: POI[],
  liveContext?: LiveContextStatus
): CompleteItinerary {
  const daysCount = Math.max(1, Math.min(7, preferences.durationDays));
  const paceMaxActivities = {
    relaxed: 2,
    moderate: 3,
    'fast-paced': 4
  }[preferences.travelPace];

  // Rank all POIs for this destination
  const destPOIs = availablePOIs.filter(p => p.destinationId === destination.id);
  const scoredPOIs = rankPOIs(destPOIs, preferences, liveContext);

  const usedPOIIds = new Set<string>();
  const days: ItineraryDay[] = [];

  const slotSchedule = [
    { slot: 'morning', start: '09:00', end: '11:00' },
    { slot: 'afternoon', start: '12:00', end: '14:30' },
    { slot: 'sunset', start: '16:00', end: '17:45' },
    { slot: 'evening', start: '18:30', end: '20:30' }
  ] as const;

  const defaultHotel = preferences.hotelLocation || {
    name: `${destination.name} Central Stay`,
    lat: destination.lat,
    lng: destination.lng
  };

  let totalActivitiesCost = 0;
  let totalTransitCost = 0;

  for (let dayIdx = 0; dayIdx < daysCount; dayIdx++) {
    const dayNumber = dayIdx + 1;
    const activities: ItineraryActivity[] = [];
    let prevLocation = defaultHotel;
    let dayTransitTime = 0;
    let dayDistance = 0;
    let dayCost = 0;

    const slotsForDay = slotSchedule.slice(0, paceMaxActivities);

    for (const slotInfo of slotsForDay) {
      // Find highest scoring unused POI near prevLocation or best matching slot
      const candidates = scoredPOIs
        .filter(sp => !usedPOIIds.has(sp.poi.id))
        .map(sp => {
          const dist = calculateDistanceKm(prevLocation.lat, prevLocation.lng, sp.poi.lat, sp.poi.lng);
          // Combine original score with proximity penalty
          const proximityScore = Math.max(0, 100 - dist * 4);
          return {
            ...sp,
            adjustedScore: sp.totalScore * 0.7 + proximityScore * 0.3
          };
        })
        .sort((a, b) => b.adjustedScore - a.adjustedScore);

      const chosen = candidates[0];

      if (chosen) {
        usedPOIIds.add(chosen.poi.id);
        const transit = estimateTransit(
          prevLocation.lat,
          prevLocation.lng,
          chosen.poi.lat,
          chosen.poi.lng,
          preferences.preferredTransport
        );

        dayTransitTime += transit.durationMinutes;
        dayDistance += transit.distanceKm;
        dayCost += chosen.poi.entryFeeINR + chosen.poi.averageSpendINR + transit.estimatedCostINR;
        totalActivitiesCost += chosen.poi.entryFeeINR + chosen.poi.averageSpendINR;
        totalTransitCost += transit.estimatedCostINR;

        activities.push({
          id: `act-${dayNumber}-${activities.length + 1}`,
          poi: chosen.poi,
          startTime: slotInfo.start,
          endTime: slotInfo.end,
          slot: slotInfo.slot,
          transitFromPrevious: transit,
          matchScore: chosen.totalScore,
          matchReason: chosen.matchReason,
          isWeatherVulnerable: !chosen.poi.isIndoor,
          notes: chosen.poi.tips
        });

        prevLocation = { name: chosen.poi.name, lat: chosen.poi.lat, lng: chosen.poi.lng };
      }
    }

    const weatherForecasts: ItineraryDay['weatherForecast'][] = [
      { condition: 'sunny', tempC: 31, rainProbabilityPercent: 10, recommendation: 'Clear and pleasant, ideal for outdoor exploration.' },
      { condition: 'partly_cloudy', tempC: 29, rainProbabilityPercent: 20, recommendation: 'Mild breeze; carry a light water bottle.' },
      { condition: 'sunny', tempC: 32, rainProbabilityPercent: 15, recommendation: 'Warm daylight; keep sun protection handy.' },
      { condition: 'cloudy', tempC: 28, rainProbabilityPercent: 25, recommendation: 'Overcast skies; comfortable walking conditions.' },
      { condition: 'breezy' as any, tempC: 27, rainProbabilityPercent: 10, recommendation: 'Pleasant evening coastal atmosphere.' }
    ];

    const weather = weatherForecasts[dayIdx % weatherForecasts.length];

    days.push({
      dayNumber,
      date: `Day ${dayNumber}`,
      title: `${destination.name} Highlights - Circuit ${dayNumber}`,
      theme: dayNumber === 1 ? 'Heritage & Iconic Landmarks' : dayNumber === 2 ? 'Culture, Nature & Vibrant Markets' : 'Scenic Vistas & Local Immersion',
      daySummary: `Explore ${activities.map(a => a.poi.name).join(' -> ')} with optimized sequence to avoid cross-city traffic.`,
      activities,
      totalEstimatedCostINR: dayCost,
      totalTransitTimeMinutes: dayTransitTime,
      totalDistanceKm: parseFloat(dayDistance.toFixed(1)),
      weatherForecast: weather
    });
  }

  // Calculate realistic budget breakdowns
  const dailyFoodEstimate = {
    budget: 600,
    moderate: 1400,
    luxury: 3500
  }[preferences.budgetTier] * preferences.travelersCount;

  const dailyStayEstimate = {
    budget: 1200,
    moderate: 2800,
    luxury: 7000
  }[preferences.budgetTier];

  const totalFoodEstimate = dailyFoodEstimate * daysCount;
  const totalStayEstimate = dailyStayEstimate * Math.max(1, daysCount - 1);
  const totalBudgetCalculated = totalActivitiesCost + totalTransitCost + totalFoodEstimate + totalStayEstimate;

  return {
    id: `yatra-plan-${Date.now()}`,
    title: `${daysCount}-Day ${preferences.travelPace.toUpperCase()} ${destination.name} Experience`,
    destination,
    preferences,
    days,
    createdAt: new Date().toISOString(),
    totalEstimatedBudgetINR: {
      activities: totalActivitiesCost,
      transit: totalTransitCost,
      foodEstimate: totalFoodEstimate,
      stayEstimate: totalStayEstimate,
      total: totalBudgetCalculated
    },
    overallEfficiencyScore: 92,
    aiSummary: `Curated ${daysCount}-day itinerary for ${preferences.travelersCount} traveler(s) tailored to ${preferences.interests.join(', ')} with optimal route sequencing.`
  };
}
