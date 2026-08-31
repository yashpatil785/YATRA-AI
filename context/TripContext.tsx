'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CompleteItinerary,
  Destination,
  POI,
  TravelPreferences,
  LiveContextStatus,
  DynamicReplanProposal,
  ScoredPOI,
  TripCollaborator,
  TripComment,
  ExpenseRecord
} from '@/lib/types';
import { INDIAN_DESTINATIONS, ALL_POIS, PRESET_DEMO_ITINERARY, INITIAL_LIVE_CONTEXT } from '@/lib/data/mockData';
import { buildOptimizedItinerary } from '@/lib/engine/optimizer';
import { generateDynamicReplan, applyDynamicReplan } from '@/lib/engine/context';
import { encodeTripToDeepLink, decodeDeepLinkTrip } from '@/lib/shareUtils';

interface NotificationItem {
  id: string;
  timestamp: string;
  type: 'weather' | 'crowd' | 'traffic' | 'system' | 'collaborate';
  title: string;
  message: string;
  read: boolean;
}

interface TripContextType {
  currentItinerary: CompleteItinerary;
  setCurrentItinerary: (itinerary: CompleteItinerary) => void;
  destinations: Destination[];
  allPOIs: POI[];
  savedTrips: CompleteItinerary[];
  liveContext: LiveContextStatus;
  activeProposal: DynamicReplanProposal | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  collaborators: TripCollaborator[];
  addCollaborator: (name: string, email: string, role: 'co_planner' | 'viewer') => void;
  removeCollaborator: (id: string) => void;
  tripComments: TripComment[];
  addTripComment: (text: string, dayNumber?: number, poiId?: string) => void;
  likeTripComment: (id: string) => void;
  activityVotes: Record<string, number>;
  voteOnActivity: (activityId: string, delta: number) => void;
  getShareDeepLink: (collaboratorName?: string) => string;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  generateNewTrip: (preferences: TravelPreferences) => CompleteItinerary;
  triggerHeavyRainSimulation: () => void;
  triggerCrowdSurgeSimulation: () => void;
  resetWeatherToSunny: () => void;
  applyProposal: (proposal: DynamicReplanProposal) => void;
  dismissProposal: () => void;
  swapActivityInItinerary: (dayNumber: number, activityId: string, replacementPOI: POI) => void;
  loadDemoScenario: () => void;
  saveCurrentTrip: () => void;
  selectedPOIForDetail: POI | null;
  setSelectedPOIForDetail: (poi: POI | null) => void;
  activeMapPOI: POI | null;
  setActiveMapPOI: (poi: POI | null) => void;
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updated: Partial<ExpenseRecord>) => void;
  resetExpensesToItinerary: () => void;
  settleExpenses: (payer: string, receiver: string, amount: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [currentItinerary, setCurrentItinerary] = useState<CompleteItinerary>(PRESET_DEMO_ITINERARY);
  const [savedTrips, setSavedTrips] = useState<CompleteItinerary[]>([PRESET_DEMO_ITINERARY]);
  const [liveContext, setLiveContext] = useState<LiveContextStatus>(INITIAL_LIVE_CONTEXT);
  const [activeProposal, setActiveProposal] = useState<DynamicReplanProposal | null>(null);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedPOIForDetail, setSelectedPOIForDetail] = useState<POI | null>(null);
  const [activeMapPOI, setActiveMapPOI] = useState<POI | null>(null);

  // Collaborators list with avatars
  const [collaborators, setCollaborators] = useState<TripCollaborator[]>([
    {
      id: 'collab-1',
      name: 'Yash Patil (You)',
      email: 'yashsubhashpatil1234@gmail.com',
      role: 'owner',
      avatarBg: 'from-amber-500 to-orange-500',
      joinedAt: 'Creator',
      status: 'active'
    },
    {
      id: 'collab-2',
      name: 'Aarav Mehta',
      email: 'aarav.travel@gmail.com',
      role: 'co_planner',
      avatarBg: 'from-teal-500 to-emerald-500',
      joinedAt: 'Joined 2h ago',
      status: 'active'
    },
    {
      id: 'collab-3',
      name: 'Riya Sen',
      email: 'riya.sen@outlook.com',
      role: 'viewer',
      avatarBg: 'from-purple-500 to-pink-500',
      joinedAt: 'Invited',
      status: 'invited'
    }
  ]);

  // Collaborative Group Discussion Comments
  const [tripComments, setTripComments] = useState<TripComment[]>([
    {
      id: 'comm-1',
      authorName: 'Aarav Mehta',
      authorRole: 'co_planner',
      avatarBg: 'from-teal-500 to-emerald-500',
      text: 'Mandovi sunset river cruise is definitely a must on Day 1 evening! The upper-deck views of Panjim lights are unbeatable.',
      timestamp: '2 hours ago',
      targetDayNumber: 1,
      likes: 3
    },
    {
      id: 'comm-2',
      authorName: 'Yash Patil',
      authorRole: 'owner',
      avatarBg: 'from-amber-500 to-orange-500',
      text: 'For Day 2, remember that Sahakari Spice Farm includes traditional buffet lunch so we can save on outside food budget.',
      timestamp: '1 hour ago',
      targetDayNumber: 2,
      likes: 2
    }
  ]);

  // Activity Votes from Travelers
  const [activityVotes, setActivityVotes] = useState<Record<string, number>>({
    'act-1-1': 4,
    'act-1-2': 3,
    'act-1-3': 5,
    'act-2-1': 4,
    'act-2-2': 2,
    'act-2-3': 5
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      timestamp: '10:15 AM',
      type: 'weather',
      title: 'Optimal Travel Weather',
      message: 'Sunny skies (31°C) across Panjim & North Goa coastal circuits.',
      read: false,
    },
    {
      id: 'notif-2',
      timestamp: '09:30 AM',
      type: 'traffic',
      title: 'Minor Congestion near Baga',
      message: '12-min slowdown detected on Calangute-Baga road. Route optimizer has adjusted transit time.',
      read: false,
    }
  ]);

  // Initial Logged Expenses for the trip
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([
    {
      id: 'exp-1',
      title: 'Airport Prepaid Cab (Dabolim to Candolim)',
      amount: 1400,
      category: 'transport',
      date: 'Day 1',
      dayNumber: 1,
      paidBy: 'Yash Patil (You)',
      splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
      paymentMethod: 'UPI',
      notes: 'Includes airport toll & luggage handling'
    },
    {
      id: 'exp-2',
      title: 'Candolim Beach Villa Stay Advance',
      amount: 4800,
      category: 'stay',
      date: 'Day 1',
      dayNumber: 1,
      paidBy: 'Aarav Mehta',
      splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
      paymentMethod: 'Card',
      notes: '2 nights shared ocean-view cottage'
    },
    {
      id: 'exp-3',
      title: 'Aguada Fort & Lighthouse Entry Passes',
      amount: 350,
      category: 'activities',
      date: 'Day 1',
      dayNumber: 1,
      paidBy: 'Yash Patil (You)',
      splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
      paymentMethod: 'UPI',
      notes: 'ASI digital ticketing QR'
    },
    {
      id: 'exp-4',
      title: "Fisherman's Wharf Goan Seafood Lunch",
      amount: 2150,
      category: 'food',
      date: 'Day 1',
      dayNumber: 1,
      paidBy: 'Riya Sen',
      splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
      paymentMethod: 'UPI',
      notes: 'Prawn curry rice & kokum solkadhi'
    },
    {
      id: 'exp-5',
      title: 'Mandovi Sunset River Cruise Deluxe Pass',
      amount: 1500,
      category: 'activities',
      date: 'Day 1',
      dayNumber: 1,
      paidBy: 'Aarav Mehta',
      splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
      paymentMethod: 'NetBanking',
      notes: 'Upper deck with Goan folk dance performance'
    },
    {
      id: 'exp-6',
      title: 'Sahakari Spice Farm Tour & Organic Buffet',
      amount: 1800,
      category: 'food',
      date: 'Day 2',
      dayNumber: 2,
      paidBy: 'Yash Patil (You)',
      splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
      paymentMethod: 'Cash',
      notes: 'Guided botanical tour with cashew feni tasting'
    },
    {
      id: 'exp-7',
      title: 'Anjuna Flea Market Handicrafts & Cashews',
      amount: 950,
      category: 'shopping',
      date: 'Day 2',
      dayNumber: 2,
      paidBy: 'Riya Sen',
      splitAmong: ['Riya Sen'],
      paymentMethod: 'UPI',
      notes: 'Personal souvenir purchase'
    },
    {
      id: 'exp-8',
      title: 'Rain Poncho & Monsoon Waterproof Covers',
      amount: 320,
      category: 'misc',
      date: 'Day 1',
      dayNumber: 1,
      paidBy: 'Yash Patil (You)',
      splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
      paymentMethod: 'Cash',
      notes: 'Weather contingency protection'
    }
  ]);

  const addExpense = (expense: Omit<ExpenseRecord, 'id'>) => {
    const newRecord: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newRecord, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-exp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        title: '💰 Expense Logged',
        message: `Added ₹${expense.amount.toLocaleString()} for '${expense.title}' under ${expense.category.toUpperCase()}.`,
        read: false
      },
      ...prev
    ]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, updated: Partial<ExpenseRecord>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const resetExpensesToItinerary = () => {
    // Generate initial estimates from current itinerary activities
    const generated: ExpenseRecord[] = [];
    currentItinerary.days.forEach(day => {
      day.activities.forEach(act => {
        const fee = act.poi.entryFeeINR || act.poi.averageSpendINR || 0;
        if (fee > 0) {
          generated.push({
            id: `exp-gen-${act.id}`,
            title: `${act.poi.name} Entry/Activity Fee`,
            amount: fee * Math.max(1, currentItinerary.preferences.travelersCount),
            category: act.poi.category === 'culinary' ? 'food' : 'activities',
            date: `Day ${day.dayNumber}`,
            dayNumber: day.dayNumber,
            paidBy: 'Yash Patil (You)',
            splitAmong: ['Yash Patil (You)', 'Aarav Mehta', 'Riya Sen'],
            paymentMethod: 'UPI',
            isPlannedEstimate: true
          });
        }
      });
    });
    setExpenses(generated);
  };

  const settleExpenses = (payer: string, receiver: string, amount: number) => {
    const newRecord: ExpenseRecord = {
      id: `exp-settle-${Date.now()}`,
      title: `⚡ Settle Up: ${payer} ➔ ${receiver}`,
      amount: amount,
      category: 'misc',
      date: `Day ${selectedDay}`,
      dayNumber: selectedDay,
      paidBy: payer,
      splitAmong: [receiver],
      paymentMethod: 'UPI',
      notes: `Debt settlement via UPI payment`
    };
    setExpenses(prev => [newRecord, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-settle-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        title: '🤝 Settlement Recorded',
        message: `${payer} paid ₹${amount.toLocaleString()} to ${receiver} via UPI.`,
        read: false
      },
      ...prev
    ]);
  };

  // Deep Link URL detection on client load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedPlan = urlParams.get('plan') || urlParams.get('share');
        
        if (sharedPlan) {
          const decoded = decodeDeepLinkTrip(sharedPlan);
          const loadedItinerary = decoded.itinerary;
          if (loadedItinerary) {
            setCurrentItinerary(loadedItinerary);
            setActiveTab('itinerary');
            setSelectedDay(1);
            
            setNotifications(prev => [
              {
                id: `notif-share-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'collaborate',
                title: '🌟 Shared Itinerary Loaded!',
                message: `Opened ${loadedItinerary.title} shared via deep link (${decoded.shareCode || 'Shared'}). You are collaborating on this plan.`,
                read: false
              },
              ...prev
            ]);
          }
        }
      } catch (e) {
        console.error('Error parsing shared plan from URL:', e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const addCollaborator = (name: string, email: string, role: 'co_planner' | 'viewer') => {
    const bgGradients = [
      'from-rose-500 to-red-500',
      'from-cyan-500 to-blue-500',
      'from-emerald-500 to-teal-500',
      'from-violet-500 to-purple-500',
      'from-amber-500 to-yellow-500'
    ];
    const randomBg = bgGradients[Math.floor(Math.random() * bgGradients.length)];

    const newCollaborator: TripCollaborator = {
      id: `collab-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role,
      avatarBg: randomBg,
      joinedAt: 'Just now',
      status: 'invited'
    };

    setCollaborators(prev => [...prev, newCollaborator]);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'collaborate',
        title: 'Collaborator Invited',
        message: `Sent collaboration invite to ${email} as ${role === 'co_planner' ? 'Co-Planner' : 'Viewer'}.`,
        read: false
      },
      ...prev
    ]);
  };

  const removeCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  const addTripComment = (text: string, dayNumber?: number, poiId?: string) => {
    if (!text.trim()) return;

    const newComment: TripComment = {
      id: `comm-${Date.now()}`,
      authorName: 'Yash Patil',
      authorRole: 'owner',
      avatarBg: 'from-amber-500 to-orange-500',
      text: text.trim(),
      timestamp: 'Just now',
      targetDayNumber: dayNumber,
      targetPOIId: poiId,
      likes: 1
    };

    setTripComments(prev => [newComment, ...prev]);
  };

  const likeTripComment = (id: string) => {
    setTripComments(prev =>
      prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c)
    );
  };

  const voteOnActivity = (activityId: string, delta: number) => {
    setActivityVotes(prev => ({
      ...prev,
      [activityId]: Math.max(0, (prev[activityId] || 0) + delta)
    }));
  };

  const getShareDeepLink = (collaboratorName: string = 'Yash Patil'): string => {
    if (typeof window === 'undefined') return '';
    const encoded = encodeTripToDeepLink(currentItinerary, collaboratorName);
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?plan=${encoded}`;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const generateNewTrip = (preferences: TravelPreferences): CompleteItinerary => {
    const dest = INDIAN_DESTINATIONS.find(d => d.id === preferences.destinationId) || INDIAN_DESTINATIONS[0];
    const newItinerary = buildOptimizedItinerary(dest, preferences, ALL_POIS, liveContext);
    setCurrentItinerary(newItinerary);
    setSelectedDay(1);
    setActiveTab('itinerary');
    
    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        title: 'New Itinerary Generated',
        message: `Successfully crafted ${newItinerary.days.length}-day smart itinerary for ${dest.name}.`,
        read: false
      },
      ...prev
    ]);

    return newItinerary;
  };

  const triggerHeavyRainSimulation = () => {
    const updatedContext: LiveContextStatus = {
      ...liveContext,
      currentWeather: {
        condition: 'heavy_rain',
        tempC: 26,
        humidity: 94,
        rainProbability: 90,
        windSpeedKmh: 35,
        alert: 'IMD Doppler Radar: Severe Monsoon Thunderstorm & High Tide Warning'
      },
      activeAlerts: [
        {
          id: `alert-${Date.now()}`,
          severity: 'critical',
          title: 'Heavy Rainfall Warning',
          message: 'Intense 45mm/hr rain detected across coastal beaches. Water sports suspended.',
          affectedPOIs: ['goa-baga-beach', 'goa-fort-aguada', 'goa-anjuna-flea-market'],
          suggestedAction: 'Switch to sheltered indoor heritage museums and culinary experiences.'
        }
      ]
    };

    setLiveContext(updatedContext);

    // Generate Proposal for Day 2 outdoor activity (Baga Beach)
    const proposal = generateDynamicReplan(currentItinerary, updatedContext, {
      dayNumber: 2,
      activityId: 'act-2-2',
      reason: 'Monsoon Heavy Downpour at 2:00 PM'
    });

    if (proposal) {
      setActiveProposal(proposal);
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'weather',
          title: '⚠️ Weather Alert: Dynamic Replan Ready',
          message: 'Heavy rain detected. YatraAI has calculated a sheltered indoor alternative.',
          read: false
        },
        ...prev
      ]);
    }
  };

  const triggerCrowdSurgeSimulation = () => {
    const updatedContext: LiveContextStatus = {
      ...liveContext,
      crowdAlerts: [
        {
          poiId: 'goa-baga-beach',
          poiName: 'Baga Beach',
          surgeLevel: 'extreme',
          waitTimeMinutes: 65,
          recommendation: 'Extreme holiday crowd surge; average wait time exceeds 1 hour.'
        }
      ]
    };
    setLiveContext(updatedContext);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'crowd',
        title: 'Crowd Surge Detected',
        message: 'Extreme footfall at Baga Beach (65-min queue). Consider shifting to sunset slot.',
        read: false
      },
      ...prev
    ]);
  };

  const resetWeatherToSunny = () => {
    setLiveContext(INITIAL_LIVE_CONTEXT);
    setActiveProposal(null);
  };

  const applyProposal = (proposal: DynamicReplanProposal) => {
    const updated = applyDynamicReplan(currentItinerary, proposal);
    setCurrentItinerary(updated);
    setActiveProposal(null);
    setSelectedDay(proposal.affectedDayNumber);
    setActiveTab('itinerary');

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        title: 'Dynamic Replan Applied',
        message: `Replaced ${proposal.affectedActivity.poi.name} with ${proposal.replacementActivity.poi.name}. Route re-optimized.`,
        read: false
      },
      ...prev
    ]);
  };

  const dismissProposal = () => {
    setActiveProposal(null);
  };

  const swapActivityInItinerary = (dayNumber: number, activityId: string, replacementPOI: POI) => {
    const updatedDays = currentItinerary.days.map(day => {
      if (day.dayNumber !== dayNumber) return day;

      const updatedActivities = day.activities.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            poi: replacementPOI,
            matchReason: `Manually customized replacement aligned with your interest in ${replacementPOI.category}.`,
            isWeatherVulnerable: !replacementPOI.isIndoor
          };
        }
        return act;
      });

      return {
        ...day,
        activities: updatedActivities
      };
    });

    setCurrentItinerary({
      ...currentItinerary,
      days: updatedDays
    });
  };

  const loadDemoScenario = () => {
    setCurrentItinerary(PRESET_DEMO_ITINERARY);
    setSelectedDay(2); // Focus on Day 2 for rain demo
    setActiveTab('demo');
  };

  const saveCurrentTrip = () => {
    setSavedTrips(prev => {
      const exists = prev.some(t => t.id === currentItinerary.id);
      if (exists) {
        return prev.map(t => t.id === currentItinerary.id ? currentItinerary : t);
      }
      return [currentItinerary, ...prev];
    });
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        title: 'Trip Saved to Profile',
        message: `'${currentItinerary.title}' has been safely stored.`,
        read: false
      },
      ...prev
    ]);
  };

  return (
    <TripContext.Provider
      value={{
        currentItinerary,
        setCurrentItinerary,
        destinations: INDIAN_DESTINATIONS,
        allPOIs: ALL_POIS,
        savedTrips,
        liveContext,
        activeProposal,
        activeTab,
        setActiveTab,
        selectedDay,
        setSelectedDay,
        isAssistantOpen,
        setIsAssistantOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        collaborators,
        addCollaborator,
        removeCollaborator,
        tripComments,
        addTripComment,
        likeTripComment,
        activityVotes,
        voteOnActivity,
        getShareDeepLink,
        notifications,
        markNotificationRead,
        clearNotifications,
        generateNewTrip,
        triggerHeavyRainSimulation,
        triggerCrowdSurgeSimulation,
        resetWeatherToSunny,
        applyProposal,
        dismissProposal,
        swapActivityInItinerary,
        loadDemoScenario,
        saveCurrentTrip,
        selectedPOIForDetail,
        setSelectedPOIForDetail,
        activeMapPOI,
        setActiveMapPOI,
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        resetExpensesToItinerary,
        settleExpenses
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
