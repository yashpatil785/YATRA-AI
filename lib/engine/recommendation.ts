import { POI, TravelPreferences, ScoredPOI, LiveContextStatus } from '../types';

/**
 * Calculates distance in kilometers between two lat/lng points using the Haversine formula.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * 6-Factor Weighted Scoring Algorithm:
 * Score = 0.30 * I + 0.20 * C + 0.15 * D + 0.15 * R + 0.10 * B + 0.10 * P
 */
export function scorePOI(
  poi: POI,
  preferences: TravelPreferences,
  liveContext?: LiveContextStatus,
  targetSlot: 'morning' | 'afternoon' | 'sunset' | 'evening' | 'night' = 'morning',
  currentLocation?: { lat: number; lng: number }
): ScoredPOI {
  // 1. Interest Match (Weight: 30%)
  let interestMatches = 0;
  const userInterests = preferences.interests.map(i => i.toLowerCase());
  const poiTags = [...poi.tags, poi.category, poi.subcategory.toLowerCase()];
  
  userInterests.forEach(interest => {
    if (poiTags.some(t => t.toLowerCase().includes(interest) || interest.includes(t.toLowerCase()))) {
      interestMatches += 1;
    }
  });
  
  const interestRatio = Math.min(1, (interestMatches + 0.2) / Math.max(1, userInterests.length));
  const interestScore = parseFloat((interestRatio * 30).toFixed(1));

  // 2. Context Match (Weight: 20%)
  // Factors: Weather condition suitability, crowd curve at slot, time of day alignment
  let contextRatio = 0.7; // baseline
  const weather = liveContext?.currentWeather?.condition || 'sunny';
  
  if (weather === 'rainy' || weather === 'heavy_rain' || weather === 'thunderstorm') {
    if (poi.isIndoor) {
      contextRatio += 0.3; // bonus for indoor in rain
    } else {
      contextRatio -= 0.4; // penalty for outdoor in rain
    }
  } else if (weather === 'sunny' || weather === 'partly_cloudy') {
    if (!poi.isIndoor) {
      contextRatio += 0.2;
    }
  }

  // Time slot suitability
  if (poi.bestTimeToVisit === targetSlot || poi.bestTimeToVisit === 'any') {
    contextRatio += 0.15;
  }

  // Crowd mitigation
  const slotHourMap = { morning: 9, afternoon: 13, sunset: 17, evening: 19, night: 21 };
  const targetHour = slotHourMap[targetSlot] || 12;
  const hourCrowd = poi.crowdCurveByHour[targetHour] || 50;
  if (hourCrowd < 50) {
    contextRatio += 0.1;
  } else if (hourCrowd > 85) {
    contextRatio -= 0.15;
  }

  contextRatio = Math.max(0.1, Math.min(1, contextRatio));
  const contextScore = parseFloat((contextRatio * 20).toFixed(1));

  // 3. Distance Score (Weight: 15%)
  let distanceKm = 5;
  const origin = currentLocation || preferences.hotelLocation || { lat: poi.lat, lng: poi.lng };
  distanceKm = calculateDistanceKm(origin.lat, origin.lng, poi.lat, poi.lng);
  
  // Exponential decay for distance: 0km = 1.0, 10km = 0.7, 30km = 0.3
  const distanceRatio = Math.max(0.1, Math.exp(-distanceKm / 20));
  const distanceScore = parseFloat((distanceRatio * 15).toFixed(1));

  // 4. Rating Score (Weight: 15%)
  // Normalized 4.0 - 5.0 rating into [0, 1]
  const normalizedRating = Math.max(0, (poi.rating - 3.5) / 1.5);
  const ratingScore = parseFloat((normalizedRating * 15).toFixed(1));

  // 5. Budget Compatibility (Weight: 10%)
  const dailyBudgetPerPerson = preferences.totalBudget / (preferences.durationDays * preferences.travelersCount);
  const activityCost = poi.entryFeeINR + poi.averageSpendINR;
  let budgetRatio = 1.0;
  if (preferences.budgetTier === 'budget' && activityCost > 500) {
    budgetRatio = 0.5;
  } else if (preferences.budgetTier === 'luxury') {
    budgetRatio = 1.0;
  } else if (activityCost > dailyBudgetPerPerson * 0.4) {
    budgetRatio = 0.7;
  }
  const budgetScore = parseFloat((budgetRatio * 10).toFixed(1));

  // 6. Popularity Score (Weight: 10%)
  // Based on review count & historical footfall
  const popularityRatio = Math.min(1, Math.log10(Math.max(10, poi.reviewCount)) / 5);
  const popularityScore = parseFloat((popularityRatio * 10).toFixed(1));

  // Total Score (0 - 100)
  const totalScore = Math.min(100, Math.round(
    interestScore + contextScore + distanceScore + ratingScore + budgetScore + popularityScore
  ));

  // Natural Language match reason
  let matchReason = `Matches your ${poi.category} interest with a high ${poi.rating}★ visitor rating.`;
  if (poi.isIndoor && (weather === 'rainy' || weather === 'heavy_rain')) {
    matchReason = `Sheltered indoor venue ideal for current rainy weather with high cultural interest.`;
  } else if (distanceKm < 3) {
    matchReason = `Close proximity (${distanceKm} km) with strong alignment to your travel preferences.`;
  }

  return {
    poi,
    totalScore,
    breakdown: {
      interestScore,
      contextScore,
      distanceScore,
      ratingScore,
      budgetScore,
      popularityScore
    },
    matchReason
  };
}

/**
 * Ranks and filters a list of POIs according to user preferences and live context.
 */
export function rankPOIs(
  pois: POI[],
  preferences: TravelPreferences,
  liveContext?: LiveContextStatus,
  targetSlot: 'morning' | 'afternoon' | 'sunset' | 'evening' | 'night' = 'morning',
  currentLocation?: { lat: number; lng: number }
): ScoredPOI[] {
  return pois
    .map(p => scorePOI(p, preferences, liveContext, targetSlot, currentLocation))
    .sort((a, b) => b.totalScore - a.totalScore);
}
