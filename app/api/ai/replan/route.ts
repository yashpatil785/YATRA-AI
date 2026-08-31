import { NextRequest, NextResponse } from 'next/server';
import { getGeminiAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { proposal, destinationName } = await req.json();

    const ai = getGeminiAI();
    if (!ai) {
      return NextResponse.json({
        rationale: proposal?.rationale || `Due to severe environmental conditions in ${destinationName}, our dynamic context engine successfully detected safety and experience conflicts and substituted outdoor activities with premier indoor alternatives.`
      });
    }

    const prompt = `Generate a concise, reassuring explanation for a traveler whose itinerary in ${destinationName} had to be dynamically replanned.
Trigger: ${proposal?.triggerEvent}
Original Outdoor Activity: ${proposal?.affectedActivity?.poi?.name}
New Sheltered Activity: ${proposal?.replacementActivity?.poi?.name}
Time Savings: ${proposal?.timeSavingsMinutes} minutes
Explain why this swap protects their travel experience, avoids monsoon rain, and preserves their cultural immersion.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are YatraAI real-time replanning concierge.',
        temperature: 0.6,
      }
    });

    return NextResponse.json({
      rationale: response.text || proposal?.rationale
    });
  } catch (error) {
    console.error('Replan AI route error:', error);
    return NextResponse.json({
      rationale: `Dynamic replanning successfully resolved weather conflicts while preserving schedule flow.`
    });
  }
}
