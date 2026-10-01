import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UserPreferences } from '../types/onboarding';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
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

/** Helper to render inline markdown: **bold** and *italic* */
function renderInlineMarkdown(text: string): React.ReactNode {
  // Split by bold (**bold**)
  const boldParts = text.split(/(\*\*.*?\*\*)/g);

  return boldParts.map((bPart, bIdx) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      const inner = bPart.slice(2, -2);
      return (
        <strong key={`b-${bIdx}`} className="font-bold text-gray-900">
          {renderItalic(inner, bIdx)}
        </strong>
      );
    }
    return <React.Fragment key={`nb-${bIdx}`}>{renderItalic(bPart, bIdx)}</React.Fragment>;
  });
}

function renderItalic(text: string, parentKey: number | string): React.ReactNode {
  const italicParts = text.split(/(\*.*?\*)/g);
  return italicParts.map((iPart, iIdx) => {
    if (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) {
      return (
        <em key={`i-${parentKey}-${iIdx}`} className="italic text-gray-800">
          {iPart.slice(1, -1)}
        </em>
      );
    }
    return iPart;
  });
}

/** Parses markdown text, extracts transport cards (Car, Bus, Location) and formats nicely */
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  // Extract transport cues if present
  const lines = content.split('\n');
  const nonTransportLines: string[] = [];
  let carInfo: string | null = null;
  let busInfo: string | null = null;
  let locationInfo: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const carMatch = trimmed.match(/^(?:[-*•]\s*)?(?:###\s*)?(?:By\s+Car(?:\/Auto)?(?:\/Scooter)?):\s*(.*)/i);
    const busMatch = trimmed.match(/^(?:[-*•]\s*)?(?:###\s*)?(?:By\s+Bus(?:\/Ferry)?):\s*(.*)/i);
    const locMatch = trimmed.match(/^(?:[-*•]\s*)?(?:###\s*)?(?:Location):\s*(.*)/i);

    if (carMatch) {
      carInfo = carMatch[1].replace(/^\*\*|\*\*$/g, '').trim();
    } else if (busMatch) {
      busInfo = busMatch[1].replace(/^\*\*|\*\*$/g, '').trim();
    } else if (locMatch) {
      locationInfo = locMatch[1].replace(/^\*\*|\*\*$/g, '').trim();
    } else {
      nonTransportLines.push(line);
    }
  }

  const hasTransportCard = Boolean(carInfo || busInfo || locationInfo);

  // Group non-transport lines into paragraphs and bullet lists
  const renderedElements: React.ReactNode[] = [];
  let currentBullets: string[] = [];

  const flushBullets = (key: string) => {
    if (currentBullets.length > 0) {
      renderedElements.push(
        <ul key={key} className="my-2 space-y-1.5 pl-1">
          {currentBullets.map((b, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[14px] leading-relaxed text-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] mt-2 shrink-0" />
              <span>{renderInlineMarkdown(b)}</span>
            </li>
          ))}
        </ul>
      );
      currentBullets = [];
    }
  };

  nonTransportLines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushBullets(`b-flush-${index}`);
      return;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      currentBullets.push(line.replace(/^[-*•]\s+/, ''));
      return;
    }

    // Numbered list items
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      flushBullets(`b-flush-num-${index}`);
      renderedElements.push(
        <div key={`num-${index}`} className="flex items-start gap-2 my-1.5 text-[14px] leading-relaxed">
          <span className="font-bold text-[#FF6B4A] text-xs shrink-0 mt-0.5">
            {numMatch[1]}.
          </span>
          <span className="text-gray-800">{renderInlineMarkdown(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Headings (###)
    if (line.startsWith('### ') || line.startsWith('## ')) {
      flushBullets(`b-flush-h-${index}`);
      const headingText = line.replace(/^#{2,3}\s+/, '');
      renderedElements.push(
        <h4 key={`h-${index}`} className="font-bold text-[14.5px] text-gray-900 mt-2.5 mb-1 tracking-tight">
          {renderInlineMarkdown(headingText)}
        </h4>
      );
      return;
    }

    // Regular paragraph
    flushBullets(`b-flush-p-${index}`);
    renderedElements.push(
      <p key={`p-${index}`} className="text-[14px] leading-relaxed text-gray-800 mb-2 last:mb-0">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  flushBullets('b-flush-final');

  return (
    <div className="space-y-1">
      {/* Intro & text paragraphs */}
      {renderedElements}

      {/* Styled Transport & Location Card (Matches reference screenshot) */}
      {hasTransportCard && (
        <div className="my-3 bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-xs space-y-3">
          {/* Car / Auto Row */}
          {carInfo && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-bold text-gray-900 leading-tight">By Car/Auto</div>
                <div className="text-[12px] text-gray-500 leading-snug mt-0.5">
                  {renderInlineMarkdown(carInfo)}
                </div>
              </div>
            </div>
          )}

          {/* Bus / Ferry Row */}
          {busInfo && (
            <div className="flex items-start gap-3 pt-2.5 border-t border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 6v6" />
                  <path d="M16 6v6" />
                  <path d="M4 12h16" />
                  <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                  <circle cx="7.5" cy="18.5" r="1.5" />
                  <circle cx="16.5" cy="18.5" r="1.5" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-bold text-gray-900 leading-tight">By Bus</div>
                <div className="text-[12px] text-gray-500 leading-snug mt-0.5">
                  {renderInlineMarkdown(busInfo)}
                </div>
              </div>
            </div>
          )}

          {/* Location & "View on map" button */}
          {locationInfo && (
            <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-gray-900 truncate">Location</div>
                  <div className="text-[11.5px] text-gray-500 truncate">{locationInfo}</div>
                </div>
              </div>

              {/* View on map link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${locationInfo}, Goa`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#FF6B4A] bg-[#FFF0EC] hover:bg-[#FFE4DC] active:scale-95 transition-all px-3 py-1.5 rounded-full shrink-0"
              >
                <span>View on map</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const GAIChatPage: React.FC<GAIChatPageProps> = ({ preferences, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${preferences.name || 'there'}! 🌴 I'm GAI, your personalized Goa travel assistant.\n\nWhether you need directions, local seafood spots, scooter rentals, or hidden spots for your ${preferences.travelMonth || 'Goa'} trip, ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works well with English, Hindi, Hinglish accents

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied');
        } else {
          setSpeechError('Could not capture audio');
        }
        setTimeout(() => setSpeechError(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Voice input not supported in this browser');
      setTimeout(() => setSpeechError(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start error', e);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('MISSING_API_KEY');
      }

      // Initialize GoogleGenAI with client-side key
      const ai = new GoogleGenAI({ apiKey });

      const userName = preferences.name || 'Traveler';
      const travelMonth = preferences.travelMonth || 'this season';
      const travelType = preferences.travelType || 'Exploring';
      const memberCount = preferences.memberCount || 2;
      const tourismTypes = (preferences.tourismTypes || []).join(', ') || 'Culture and Heritage';

      const systemInstruction = `You are GAI (Goa Artificial Intelligence), the dedicated, hyper-local AI travel companion for Goa, India.
User's profile:
- Name: ${userName}
- Visiting in: ${travelMonth}
- Group size: ${memberCount} members (${travelType})
- Primary interests: ${tourismTypes}

CRITICAL RULES:
1. GREETING RULE: Do NOT start responses with "Dev Borem Korum" or repetitive greetings! Get straight to the answer in a warm, friendly, natural tone.
2. LANGUAGE RULE: ALWAYS respond in the EXACT same language that the user writes to you in!
   - If the user writes in Marathi (मराठी) e.g., "कसे जायचे?", "प्रवेश फी आहे का?", respond completely in Marathi!
   - If the user writes in Konkani (कोंकणी), respond completely in Konkani!
   - If the user writes in Hindi (हिंदी) e.g., "कैसे पहुंचे?", respond completely in Hindi!
   - If the user writes in romanized Hinglish/Marathi/Konkani (e.g., "Parra church kase jayche?", "Entry fee kitna hai?"), respond in that EXACT same conversational romanized style!
   - If the user writes in English, respond in English.
3. FORMATTING RULE: Support markdown formatting. Use **bold** for key names and places, *italics* for local terms, bullet points for recommendations.
4. TRANSPORTATION/DIRECTIONS RULE: When asked how to reach a place, directions, or transport:
   Include these structured lines clearly:
   By Car/Auto/Scooter: <travel time, route, and driving/riding advice>
   By Bus/Ferry: <bus routes, stops or ferry crossing>
   Location: <exact place or landmark in Goa>
   Then provide any practical advice, entrance fees, or etiquette.`;

      // Build conversation history for Gemini API
      const contents = [...messages, userMsg].map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Call Gemini directly with gemini-2.5-flash
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const content = response.text || 'I could not generate a response. Please try again.';
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: botTime,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('GAI Gemini error:', err);
      let errorResponse = "I'm momentarily catching my breath. Please try asking again in a moment!";

      if (err?.message === 'MISSING_API_KEY') {
        errorResponse = "⚠️ Please set VITE_GEMINI_API_KEY in your environment variables (or Netlify site settings) to enable real-time GAI responses.";
      }

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: errorResponse,
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
                  <div className="px-4 py-3 rounded-2xl rounded-tr-xs bg-[#FFE7E0] border border-[#FFD8CE] shadow-xs max-w-[285px]">
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
            <div key={msg.id} className="flex items-start gap-2.5 pr-4">
              {/* Bot Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
                </svg>
              </div>

              {/* Bot Message Bubble with Markdown & Transport Card */}
              <div className="flex flex-col items-start max-w-[320px] min-w-0">
                <div className="px-4 py-3.5 rounded-3xl rounded-tl-xs bg-[#F4F4F6] border border-gray-200/60 shadow-xs text-gray-900 w-full">
                  <FormattedMessage content={msg.content} />
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

        {/* Speech Error Banner if any */}
        {speechError && (
          <div className="text-[11px] text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-1 rounded-full text-center">
            {speechError}
          </div>
        )}

        {/* Input Bar with Mic & Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Input Pill Container */}
          <div className="flex-1 rounded-full bg-white border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-3.5 py-2 flex items-center gap-2 focus-within:border-[#FF6B4A] focus-within:ring-2 focus-within:ring-[#FF6B4A]/15 transition-all">
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
              placeholder={isListening ? 'Listening... speak now' : 'Ask GAI anything...'}
              className="w-full bg-transparent text-[14.5px] font-medium text-gray-900 placeholder-gray-400 outline-none"
            />

            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'text-gray-400 hover:text-[#FF6B4A] hover:bg-gray-50'
              }`}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              aria-label="Voice input"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>
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
