import { NextRequest, NextResponse } from 'next/server';
import { getGeminiAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message, history, currentItinerary, destination } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ai = getGeminiAI();
    if (!ai) {
      // Intelligent fallback when API key is not yet set in environment
      return NextResponse.json({
        reply: `Namaste! As your YatraAI Travel Assistant for ${destination?.name || 'India'}, I can help you customize your trip schedule, suggest iconic local street delicacies, calculate budget estimates, or prepare you for local weather conditions. How would you like to refine your journey?`,
        suggestedActions: [
          'What are the best street food spots nearby?',
          'Suggest packing essentials for this season',
          'How do I avoid peak crowds at popular monuments?'
        ]
      });
    }

    const systemInstruction = `You are YatraAI, an expert Indian tourism concierge and Smart India Hackathon (SIH) itinerary intelligence system.
You are helping the traveler plan or explore their trip to ${destination?.name || 'India'} (${destination?.state || ''}).
Current Itinerary context: ${currentItinerary ? `Title: ${currentItinerary.title}, Total Days: ${currentItinerary.days?.length}, Pace: ${currentItinerary.preferences?.travelPace}` : 'General Inquiry'}.

Provide concise, friendly, culturally rich, and highly practical travel advice. Mention local tips, exact timings, authentic delicacies (like Pyaaz Kachori in Jaipur, Bebinca in Goa, or Bun Maska in Mumbai), safety advice, and transport tips in India (Metro, Auto Rickshaw, Cabs).
Keep responses clear and well-structured with bullet points.`;

    const contents = [
      ...(history || []).map((h: { role: 'user' | 'assistant'; content: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || 'I am ready to help you optimize your Indian travel itinerary.';

    return NextResponse.json({
      reply: replyText,
      suggestedActions: [
        'Find authentic local eateries',
        'Suggest hidden gem attractions',
        'Check weather precautions'
      ]
    });
  } catch (error: any) {
    console.error('Chat AI route error:', error);
    return NextResponse.json({
      reply: 'I am here to guide your travel journey across India. Ask me anything about local attractions, transport, food, or weather adjustments!',
      suggestedActions: [
        'Suggest best photography spots',
        'What are the entry ticket timings?',
        'Recommend vegetarian dining options'
      ]
    });
  }
}
