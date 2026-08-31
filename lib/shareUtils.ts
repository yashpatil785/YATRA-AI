import { CompleteItinerary, TravelPreferences } from '@/lib/types';
import { INDIAN_DESTINATIONS, ALL_POIS } from '@/lib/data/mockData';
import { buildOptimizedItinerary } from '@/lib/engine/optimizer';
import { INITIAL_LIVE_CONTEXT } from '@/lib/data/mockData';

export interface CompactSharePayload {
  v: number; // version
  code: string;
  destId: string;
  title: string;
  pref: TravelPreferences;
  replanned?: boolean;
  createdAt: string;
  collaboratorName?: string;
}

/**
 * Generates a memorable, unique trip share code (e.g. YATRA-GOA-8492)
 */
export function generateShareCode(destCode: string = 'TRIP'): string {
  const cleanCode = destCode.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'TRIP';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `YATRA-${cleanCode}-${randomNum}`;
}

/**
 * Encodes a complete itinerary into a URL-safe compact Base64 payload
 */
export function encodeTripToDeepLink(
  itinerary: CompleteItinerary,
  collaboratorName: string = 'Traveler'
): string {
  try {
    const payload: CompactSharePayload = {
      v: 1,
      code: generateShareCode(itinerary.destination.id),
      destId: itinerary.destination.id,
      title: itinerary.title,
      pref: itinerary.preferences,
      replanned: itinerary.isReplanned,
      createdAt: new Date().toISOString(),
      collaboratorName
    };

    const jsonStr = JSON.stringify(payload);
    if (typeof window !== 'undefined') {
      return btoa(encodeURIComponent(jsonStr));
    }
    return Buffer.from(encodeURIComponent(jsonStr)).toString('base64');
  } catch (err) {
    console.error('Failed to encode trip:', err);
    return '';
  }
}

/**
 * Decodes a URL-safe base64 payload into a restored CompleteItinerary
 */
export function decodeDeepLinkTrip(encodedPayload: string): {
  itinerary: CompleteItinerary | null;
  collaboratorName: string;
  shareCode: string;
} {
  try {
    let jsonStr = '';
    if (typeof window !== 'undefined') {
      jsonStr = decodeURIComponent(atob(encodedPayload));
    } else {
      jsonStr = decodeURIComponent(Buffer.from(encodedPayload, 'base64').toString());
    }

    const data: CompactSharePayload = JSON.parse(jsonStr);
    if (!data.destId || !data.pref) {
      return { itinerary: null, collaboratorName: 'Traveler', shareCode: '' };
    }

    const destination = INDIAN_DESTINATIONS.find(d => d.id === data.destId) || INDIAN_DESTINATIONS[0];
    const regenerated = buildOptimizedItinerary(destination, data.pref, ALL_POIS, INITIAL_LIVE_CONTEXT);

    return {
      itinerary: {
        ...regenerated,
        title: data.title || regenerated.title,
        isReplanned: data.replanned ?? false
      },
      collaboratorName: data.collaboratorName || 'Travel Partner',
      shareCode: data.code || 'SHARED-PLAN'
    };
  } catch (err) {
    console.error('Failed to decode deep link trip:', err);
    return { itinerary: null, collaboratorName: 'Traveler', shareCode: '' };
  }
}

/**
 * Formats a clean, text-based itinerary summary for WhatsApp, Telegram, or Notes.
 */
export function generateFormattedTripSummary(
  itinerary: CompleteItinerary,
  shareUrl: string
): string {
  const lines: string[] = [];

  lines.push(`🌍 *${itinerary.title.toUpperCase()}*`);
  lines.push(`📍 *Destination:* ${itinerary.destination.name}, India`);
  lines.push(`📅 *Duration:* ${itinerary.days.length} Days (${itinerary.preferences.travelersCount} Travelers)`);
  lines.push(`💰 *Estimated Budget:* ₹${itinerary.totalEstimatedBudgetINR.total.toLocaleString()} (${itinerary.preferences.budgetTier.toUpperCase()} Tier)`);
  lines.push(`✨ *AI Route Efficiency Score:* ${itinerary.overallEfficiencyScore}/100`);
  lines.push(``);
  lines.push(`🗺️ *DAY-BY-DAY HIGHLIGHTS:*`);

  itinerary.days.forEach(day => {
    lines.push(`\n*Day ${day.dayNumber}: ${day.title}* (${day.theme})`);
    day.activities.forEach(act => {
      const weatherTag = act.poi.isIndoor ? '🏛️ [Indoor]' : '☀️ [Outdoor]';
      lines.push(`  • ${act.startTime} - ${act.poi.name} ${weatherTag} (₹${act.poi.entryFeeINR})`);
    });
  });

  lines.push(``);
  lines.push(`🔗 *Collaborate & View Live Plan on YatraAI:*`);
  lines.push(shareUrl);
  lines.push(`_Context-Aware Travel Intelligence with Real-time Weather Replanning._`);

  return lines.join('\n');
}
