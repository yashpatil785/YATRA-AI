import { NextRequest, NextResponse } from 'next/server';
import { getGeminiAI } from '@/lib/gemini';
import { Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { destination, days, budget, interests, pace } = await req.json();

    const ai = getGeminiAI();
    if (!ai) {
      return NextResponse.json({
        success: false,
        message: 'Using algorithmic offline engine fallback'
      });
    }

    const prompt = `Create an intelligent ${days}-day travel itinerary for ${destination} in India.
Budget Tier: ${budget}
Travel Pace: ${pace}
Interests: ${interests?.join(', ')}

Return a structured JSON with:
- title: string
- highlights: array of strings
- dailySummary: array of strings (one per day)
- insiderTips: array of strings`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            dailySummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            insiderTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'highlights', 'dailySummary', 'insiderTips']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return NextResponse.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error('AI Generate route error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate via AI API, falling back to local optimization engine'
    });
  }
}
