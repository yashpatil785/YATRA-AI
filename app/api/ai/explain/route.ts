import { NextRequest, NextResponse } from 'next/server';
import { getGeminiAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { poi, preferences, liveContext } = await req.json();

    if (!poi) {
      return NextResponse.json({ error: 'POI is required' }, { status: 400 });
    }

    const ai = getGeminiAI();
    if (!ai) {
      return NextResponse.json({
        explanation: `${poi.name} is recommended because its ${poi.category} classification strongly aligns with your stated preferences for ${preferences?.interests?.join(', ') || 'heritage and exploration'}. With a ${poi.rating}★ rating from ${poi.reviewCount?.toLocaleString()} travelers, it delivers prime cultural immersion within your ${preferences?.budgetTier || 'moderate'} budget tier.`
      });
    }

    const prompt = `Provide a concise 2-3 sentence personalized explanation for why "${poi.name}" (${poi.category}, rating ${poi.rating}/5) was recommended for a traveler with the following profile:
- Interests: ${preferences?.interests?.join(', ') || 'heritage, exploration'}
- Travel Pace: ${preferences?.travelPace || 'moderate'}
- Budget Tier: ${preferences?.budgetTier || 'moderate'}
- Travel Group: ${preferences?.travelGroup || 'friends'}
- Weather: ${liveContext?.currentWeather?.condition || 'sunny'}
Be persuasive, analytical, and reference specific features of the attraction.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an algorithmic travel personalization expert.',
        temperature: 0.6,
      }
    });

    return NextResponse.json({
      explanation: response.text || `${poi.name} is an ideal match for your travel group and interests.`
    });
  } catch (error) {
    console.error('Explain route error:', error);
    return NextResponse.json({
      explanation: `Selected by the 6-factor recommendation engine as an optimal match for your interests, travel pace, and time window.`
    });
  }
}
