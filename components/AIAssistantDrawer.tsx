'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTrip } from '@/context/TripContext';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RefreshCw,
  Compass,
  MapPin,
  Utensils,
  Sun,
  ShieldCheck,
  User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AIAssistantDrawer() {
  const { isAssistantOpen, setIsAssistantOpen, currentItinerary } = useTrip();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Namaste! I am YatraAI, your personalized travel intelligence concierge. I am context-aware of your itinerary for **${currentItinerary?.destination?.name || 'India'}**.\n\nAsk me about authentic street delicacies, packing tips, language basics, or how to customize your day schedule!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Recommend iconic local street food & cafes',
    'Packing checklist for current weather',
    'Tips to avoid peak crowd lines',
    'Cultural etiquette & temple dress code'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const msgIdCounter = useRef(1);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    msgIdCounter.current += 1;
    const currentCount = msgIdCounter.current;
    const userMsgId = `usr-${currentCount}`;

    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: 'Sent'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4),
          currentItinerary,
          destination: currentItinerary?.destination
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${currentCount + 1}`,
        role: 'assistant',
        content: data.reply || 'I am happy to assist your travel across India. How else can I tailor your schedule?',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ast-err-${currentCount + 1}`,
          role: 'assistant',
          content: 'I am here to guide your journey. You can adjust your itinerary timings, check local transport fares, or ask for hidden gems.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, messages, currentItinerary]);

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 h-full flex flex-col shadow-2xl text-white animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-950/40 border border-white/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm text-white">YatraAI Travel Concierge</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Context: {currentItinerary?.destination?.name} ({currentItinerary?.preferences?.durationDays}D Plan)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white border border-white/20'
                  : 'bg-white/10 text-amber-300 border border-white/10'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium rounded-tr-xs border border-white/10'
                  : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-xs'
              }`}>
                <div className="whitespace-pre-line">{msg.content}</div>
                <span className={`block text-[10px] mt-1.5 font-medium ${
                  msg.role === 'user' ? 'text-orange-200' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-300 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 w-max animate-pulse">
              <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
              <span>YatraAI is computing personalized insights...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-white/5 backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Suggested Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors text-left truncate max-w-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask YatraAI travel questions..."
            className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-orange-400 transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white shadow-md border border-white/20 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
