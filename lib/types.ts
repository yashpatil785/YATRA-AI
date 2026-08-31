export type TravelPace = 'relaxed' | 'moderate' | 'fast-paced';
export type BudgetTier = 'budget' | 'moderate' | 'luxury';
export type TravelGroup = 'solo' | 'couple' | 'family' | 'friends';
export type TransportMode = 'walking' | 'auto_rickshaw' | 'cab' | 'metro' | 'rental_bike';

export interface TravelPreferences {
  destinationId: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelPace: TravelPace;
  budgetTier: BudgetTier;
  totalBudget: number;
  travelersCount: number;
  travelGroup: TravelGroup;
  interests: string[];
  dietaryPreference?: string;
  accessibilityNeeds?: boolean;
  preferredTransport: TransportMode;
  hotelLocation?: {
    name: string;
    lat: number;
    lng: number;
  };
  customNotes?: string;
}

export interface POI {
  id: string;
  destinationId: string;
  name: string;
  category: 'heritage' | 'nature' | 'beach' | 'adventure' | 'spiritual' | 'culinary' | 'culture' | 'shopping' | 'nightlife' | 'art';
  subcategory: string;
  description: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  averageDurationMinutes: number;
  entryFeeINR: number;
  averageSpendINR: number;
  openingTime: string; // "09:00"
  closingTime: string; // "18:00"
  bestTimeToVisit: 'morning' | 'afternoon' | 'sunset' | 'evening' | 'night' | 'any';
  isIndoor: boolean;
  crowdLevel: 'low' | 'moderate' | 'high' | 'very_high';
  crowdCurveByHour: number[]; // 24 values from 0-100
  tags: string[];
  imageUrl: string;
  famousFor: string;
  tips: string;
  idealWeather: ('sunny' | 'cloudy' | 'rainy' | 'cool' | 'breezy')[];
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  tagline: string;
  description: string;
  lat: number;
  lng: number;
  imageUrl: string;
  bestMonths: string[];
  knownFor: string[];
  averageDailyCostINR: {
    budget: number;
    moderate: number;
    luxury: number;
  };
  popularPOIsCount: number;
  heroHighlight: string;
}

export interface ScoredPOI {
  poi: POI;
  totalScore: number; // 0 to 100
  breakdown: {
    interestScore: number; // 0 to 30
    contextScore: number;  // 0 to 20
    distanceScore: number; // 0 to 15
    ratingScore: number;   // 0 to 15
    budgetScore: number;   // 0 to 10
    popularityScore: number; // 0 to 10
  };
  matchReason: string;
  aiExplanation?: string;
}

export interface ItineraryActivity {
  id: string;
  poi: POI;
  startTime: string; // "09:30"
  endTime: string;   // "11:30"
  slot: 'morning' | 'afternoon' | 'sunset' | 'evening' | 'night';
  transitFromPrevious?: {
    distanceKm: number;
    durationMinutes: number;
    mode: TransportMode;
    estimatedCostINR: number;
    trafficLevel: 'low' | 'moderate' | 'heavy';
  };
  matchScore: number;
  matchReason: string;
  isWeatherVulnerable: boolean;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  activities: ItineraryActivity[];
  daySummary: string;
  totalEstimatedCostINR: number;
  totalTransitTimeMinutes: number;
  totalDistanceKm: number;
  weatherForecast: {
    condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'heavy_rain' | 'thunderstorm';
    tempC: number;
    rainProbabilityPercent: number;
    recommendation: string;
  };
}

export interface CompleteItinerary {
  id: string;
  title: string;
  destination: Destination;
  preferences: TravelPreferences;
  days: ItineraryDay[];
  createdAt: string;
  totalEstimatedBudgetINR: {
    activities: number;
    transit: number;
    foodEstimate: number;
    stayEstimate: number;
    total: number;
  };
  overallEfficiencyScore: number; // 0 - 100
  aiSummary: string;
  isReplanned?: boolean;
  replanHistory?: {
    timestamp: string;
    reason: string;
    description: string;
  }[];
}

export interface LiveContextStatus {
  destinationId: string;
  currentWeather: {
    condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'heavy_rain' | 'thunderstorm';
    tempC: number;
    humidity: number;
    rainProbability: number;
    windSpeedKmh: number;
    alert?: string;
  };
  crowdAlerts: {
    poiId: string;
    poiName: string;
    surgeLevel: 'moderate' | 'high' | 'extreme';
    waitTimeMinutes: number;
    recommendation: string;
  }[];
  trafficStatus: {
    corridor: string;
    delayMinutes: number;
    status: 'normal' | 'congested' | 'gridlock';
  }[];
  activeAlerts: {
    id: string;
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    affectedPOIs: string[];
    suggestedAction: string;
  }[];
}

export interface DynamicReplanProposal {
  id: string;
  triggerEvent: string;
  affectedActivity: ItineraryActivity;
  affectedDayNumber: number;
  replacementActivity: ItineraryActivity;
  alternativeOptions: ScoredPOI[];
  rationale: string;
  timeSavingsMinutes: number;
  budgetDifferenceINR: number;
  stepByStepResolution: {
    step: number;
    title: string;
    status: 'completed' | 'active' | 'pending';
    detail: string;
  }[];
}

export interface TripCollaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'co_planner' | 'viewer';
  avatarBg: string;
  joinedAt: string;
  status: 'active' | 'invited';
}

export interface TripComment {
  id: string;
  authorName: string;
  authorRole: 'owner' | 'co_planner' | 'viewer';
  avatarBg: string;
  text: string;
  timestamp: string;
  targetDayNumber?: number;
  targetPOIId?: string;
  likes: number;
}

export interface ShareTripConfig {
  shareCode: string;
  expiresInDays: number;
  allowEdits: boolean;
  deepLinkUrl: string;
}

export type ExpenseCategory = 'transport' | 'stay' | 'food' | 'activities' | 'shopping' | 'misc';

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  dayNumber: number;
  paidBy: string; // collaborator name or 'You'
  splitAmong: string[]; // collaborator names
  paymentMethod: 'UPI' | 'Cash' | 'Card' | 'NetBanking';
  notes?: string;
  receiptImage?: string;
  isPlannedEstimate?: boolean;
}

