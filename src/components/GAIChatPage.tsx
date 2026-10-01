import React, { useState, useRef, useEffect } from 'react';
import { UserPreferences } from '../types/onboarding';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredDetails?: {
    car?: string;
    bus?: string;
    location?: string;
  };
}

interface GAIChatPageProps {
  preferences: UserPreferences;
  onBack: () => void;
}

const QUICK_PROMPTS = [
  { label: 'Nearby food?', icon: '🍴', prompt: 'What are the best local food and seafood places in North Goa right now?' },
  { label: 'Best time to visit?', icon: '📷', prompt: 'What is the best time of day to visit beaches and forts in Goa?' },
  { label: 'Other churches nearby?', icon: '📍', prompt: 'Tell me about the famous historic churches and heritage spots nearby.' },
  { label: 'Hotels nearby?', icon: '🏨', prompt: 'What are recommended boutique stays or homestays in Goa for our trip?' },
  { label: 'Scooter/taxi rental?', icon: '🛵', prompt: 'How much does scooter rental cost in Goa and how does GoaMiles work?' },
  { label: 'Safety & emergency tips', icon: '🛡️', prompt: 'What are essential travel safety tips, emergency numbers and beach precautions in Goa?' },
];

export const GAIChatPage: React.FC<GAIChatPageProps> = ({ preferences, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${preferences.name || 'there'}! 🌴 I'm GAI, your personalized Goa travel companion.\n\nWhether you need directions to hidden beaches, authentic fish thali spots, scooter rentals, or local Konkani tips for your ${preferences.travelMonth || 'Goa'} trip, ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const conversationHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          userPreferences: preferences,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from GAI');
      }

      const data = await res.json();
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Check if response contains route/transport details to format nicely
      const content = data.content || '';
      let structuredDetails: ChatMessage['structuredDetails'] = undefined;

      // Extract transport cues if present
      const carMatch = content.match(/By Car\/Auto(?:\/Scooter)?:\s*([^\n]+)/i);
      const busMatch = content.match(/By Bus(?:\/Ferry)?:\s*([^\n]+)/i);
      const locMatch = content.match(/Location:\s*([^\n]+)/i);

      if (carMatch || busMatch || locMatch) {
        structuredDetails = {
          car: carMatch ? carMatch[1].trim() : undefined,
          bus: busMatch ? busMatch[1].trim() : undefined,
          location: locMatch ? locMatch[1].trim() : undefined,
        };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: content,
        timestamp: botTime,
        structuredDetails,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "Dev Borem Korum! I'm momentarily catching my breath like an afternoon susegad. Please try asking again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between max-w-[430px] mx-auto select-none relative">
      {/* Top App Header */}
      <header className="sticky top-0 z-20 bg-[#F7F7F5]/90 backdrop-blur-xl border-b border-gray-200/50 px-4 py-3 flex items-center justify-between">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          aria-label="Back to Homepage"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.5 15L7.5 10L12.5 5" />
          </svg>
        </button>

        {/* Title & Subtitle */}
        <div className="flex flex-col items-center">
          <h1 className="text-[19px] font-black text-gray-900 tracking-tight leading-tight">
            GAI
          </h1>
          <span className="text-[11.5px] font-medium text-gray-500 leading-tight">
            Your Goa Travel Assistant
          </span>
        </div>

        {/* Balance spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Top Floating Pill: Ask Anything */}
        <div className="flex items-center justify-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE]/80 border border-[#BAE6FD] text-[#0369A1] shadow-xs">
            <svg className="w-4 h-4 text-[#0284C7]" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[12.5px] font-semibold">Ask anything</span>
          </div>
        </div>

        {/* Render Chat Messages */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex items-end justify-end gap-2 pl-8">
                {/* User Message Bubble */}
                <div className="flex flex-col items-end">
                  <div className="px-4 py-3 rounded-2xl rounded-tr-xs bg-[#FFE7E0] border border-[#FFD8CE] shadow-xs max-w-[280px]">
                    <p className="text-[14.5px] font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  {/* Timestamp & double checkmarks */}
                  <div className="flex items-center gap-1 mt-1 pr-1">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {msg.timestamp}
                    </span>
                    <span className="text-[12px] font-bold text-[#FF6B4A]">✓✓</span>
                  </div>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#FEE2D8] border border-[#FFD0C0] text-[#9A3412] flex items-center justify-center shrink-0 shadow-xs mb-4">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            );
          }

          // Assistant (GAI) Bubble
          return (
            <div key={msg.id} className="flex items-start gap-2.5 pr-6">
              {/* Bot Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                {/* Cute Bot Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
                </svg>
              </div>

              {/* Bot Message Bubble */}
              <div className="flex flex-col items-start max-w-[310px]">
                <div className="px-4 py-3.5 rounded-3xl rounded-tl-xs bg-[#F4F4F6] border border-gray-200/60 shadow-xs text-gray-900">
                  <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.content}
                  </p>

                  {/* Rich Embedded Transport Card if structured info is available */}
                  {msg.structuredDetails && (
                    <div className="mt-3 bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs space-y-2.5">
                      {msg.structuredDetails.car && (
                        <div className="flex items-start gap-2.5">
                          <span className="text-lg">🚗</span>
                          <div>
                            <div className="text-[12px] font-bold text-gray-900">By Car/Auto</div>
                            <div className="text-[11.5px] text-gray-500 leading-tight">
                              {msg.structuredDetails.car}
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.structuredDetails.bus && (
                        <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
                          <span className="text-lg">🚌</span>
                          <div>
                            <div className="text-[12px] font-bold text-gray-900">By Bus</div>
                            <div className="text-[11.5px] text-gray-500 leading-tight">
                              {msg.structuredDetails.bus}
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.structuredDetails.location && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">📍</span>
                            <span className="text-[12px] font-bold text-gray-800 truncate max-w-[130px]">
                              {msg.structuredDetails.location}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-[#FF6B4A] bg-[#FFEAE5] px-2.5 py-1 rounded-full">
                            View on map ↗
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <span className="text-[11px] text-gray-400 font-medium mt-1 pl-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 pr-6">
            <div className="w-9 h-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-[#F4F4F6] border border-gray-200/60 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Bar: Quick Chips & Message Input */}
      <div className="sticky bottom-0 z-20 bg-[#F7F7F5]/95 backdrop-blur-xl border-t border-gray-200/50 pt-2 pb-5 px-4 space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {QUICK_PROMPTS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleSendMessage(chip.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-xs hover:border-[#FF6B4A]/50 hover:bg-[#FFF5F2] active:scale-95 transition-all text-xs font-semibold text-gray-700 whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar with Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Input Pill Container */}
          <div className="flex-1 rounded-full bg-white border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-[#FF6B4A] focus-within:ring-2 focus-within:ring-[#FF6B4A]/15 transition-all">
            {/* Chat Icon */}
            <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Input Text Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask GAI anything..."
              className="w-full bg-transparent text-[14.5px] font-medium text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-md transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] hover:brightness-105 active:scale-95 cursor-pointer shadow-[0_4px_12px_rgba(255,107,74,0.35)]'
                : 'bg-gray-300 text-gray-100 cursor-not-allowed shadow-none'
            }`}
            aria-label="Send message"
          >
            {/* Paper Airplane Send SVG */}
            <svg
              className="w-4 h-4 translate-x-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
