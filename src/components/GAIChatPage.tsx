import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { UserPreferences } from '../types/onboarding';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imagePreview?: string; // base64 data URL for uploaded image
  groundingSources?: { title?: string; uri?: string }[];
}

interface LocationDetails {
  lat: number;
  lng: number;
  placeName: string;
  isInsideGoa: boolean;
}

interface AttachedImage {
  base64Data: string;
  mimeType: string;
  dataUrl: string;
}

interface GAIChatPageProps {
  preferences: UserPreferences;
  onBack: () => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  { label: 'Nearby food?', icon: '🍴', prompt: 'What are the best authentic Goan food spots closest to my current spot right now?' },
  { label: 'Sunset spots?', icon: '🌅', prompt: 'What is the closest and best sunset viewpoint to visit from here?' },
  { label: 'Scooter/cab rates?', icon: '🛵', prompt: 'How much does scooter rental and private taxi cost around here?' },
  { label: 'Historic churches?', icon: '📍', prompt: 'What are the closest historic churches and Portuguese heritage sights near me?' },
  { label: 'Safety & emergency', icon: '🛡️', prompt: 'What are emergency contacts, lifeguard flags and safety rules around here?' },
];

/** Helper to render inline markdown: **bold** and *italic* */
function renderInlineMarkdown(text: string): React.ReactNode {
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

/** Determines accurate Goan locality from coordinates */
function getGoaLocality(lat: number, lng: number): { placeName: string; isInsideGoa: boolean } {
  if (lat < 14.80 || lat > 15.85 || lng < 73.60 || lng > 74.40) {
    return {
      placeName: 'Outside Goa (Simulating North Goa stay)',
      isInsideGoa: false,
    };
  }

  if (lat >= 15.65) return { placeName: 'Morjim / Arambol / Mandrem (North Goa)', isInsideGoa: true };
  if (lat >= 15.58 && lat < 15.65) return { placeName: 'Vagator / Anjuna / Assagao (North Goa)', isInsideGoa: true };
  if (lat >= 15.53 && lat < 15.58) return { placeName: 'Calangute / Baga / Parra (North Goa)', isInsideGoa: true };
  if (lat >= 15.48 && lat < 15.53) return { placeName: 'Candolim / Sinquerim / Nerul (North Goa)', isInsideGoa: true };
  if (lat >= 15.44 && lat < 15.48) return { placeName: 'Panaji / Miramar / Dona Paula (Central Goa)', isInsideGoa: true };
  if (lat >= 15.40 && lat < 15.44) return { placeName: 'Old Goa / Ribandar (Heritage Zone)', isInsideGoa: true };
  if (lat >= 15.34 && lat < 15.40) return { placeName: 'Vasco / Bogmalo / Dabolim (Central Goa)', isInsideGoa: true };
  if (lat >= 15.24 && lat < 15.34) return { placeName: 'Margao / Colva / Benaulim (South Goa)', isInsideGoa: true };
  if (lat >= 15.15 && lat < 15.24) return { placeName: 'Cavelossim / Varca (South Goa)', isInsideGoa: true };
  return { placeName: 'Palolem / Agonda / Canacona (Far South Goa)', isInsideGoa: true };
}

/** Optimizes and compresses uploaded images for API transmission */
const processImageFile = (file: File): Promise<AttachedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1024;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type || 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.85);
        const base64Data = dataUrl.split(',')[1];

        resolve({ base64Data, mimeType, dataUrl });
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/** FormattedMessage: Renders crisp markdown and interactive action cards */
const FormattedMessage: React.FC<{
  content: string;
  userCoords?: { lat: number; lng: number } | null;
  groundingSources?: { title?: string; uri?: string }[];
  onQuickAction?: (prompt: string) => void;
}> = ({ content, userCoords, groundingSources, onQuickAction }) => {
  const lines = content.split('\n');
  const nonTransportLines: string[] = [];
  let carInfo: string | null = null;
  let busInfo: string | null = null;
  let locationInfo: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const carMatch = trimmed.match(/^(?:[-*•]\s*)?(?:###\s*)?(?:By\s+Car(?:\/Auto)?(?:\/Scooter)?):\s*(.*)/i);
    const busMatch = trimmed.match(/^(?:[-*•]\s*)?(?:###\s*)?(?:By\s+Bus(?:\/Ferry)?):\s*(.*)/i);
    const locMatch = trimmed.match(/^(?:[-*•]\s*)?(?:###\s*)?(?:Location|Place):\s*(.*)/i);

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
  const targetPlace = locationInfo || 'Goa';

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

    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      currentBullets.push(line.replace(/^[-*•]\s+/, ''));
      return;
    }

    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      flushBullets(`b-flush-num-${index}`);
      renderedElements.push(
        <div key={`num-${index}`} className="flex items-start gap-2 my-1 text-[14px] leading-relaxed">
          <span className="font-bold text-[#FF6B4A] text-xs shrink-0 mt-0.5">
            {numMatch[1]}.
          </span>
          <span className="text-gray-800">{renderInlineMarkdown(numMatch[2])}</span>
        </div>
      );
      return;
    }

    if (line.startsWith('### ') || line.startsWith('## ')) {
      flushBullets(`b-flush-h-${index}`);
      const headingText = line.replace(/^#{2,3}\s+/, '');
      renderedElements.push(
        <h4 key={`h-${index}`} className="font-bold text-[14.5px] text-gray-900 mt-2 mb-1 tracking-tight">
          {renderInlineMarkdown(headingText)}
        </h4>
      );
      return;
    }

    flushBullets(`b-flush-p-${index}`);
    renderedElements.push(
      <p key={`p-${index}`} className="text-[14px] leading-relaxed text-gray-800 mb-1.5 last:mb-0">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  flushBullets('b-flush-final');

  return (
    <div className="space-y-1">
      {renderedElements}

      {/* Structured Transport & Location Card */}
      {hasTransportCard && (
        <div className="my-2.5 bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-xs space-y-2.5">
          {/* Car / Scooter Row */}
          {carInfo && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-bold text-gray-900 leading-tight">By Car / Scooter</div>
                <div className="text-[12px] text-gray-500 leading-snug mt-0.5">
                  {renderInlineMarkdown(carInfo)}
                </div>
              </div>
            </div>
          )}

          {/* Bus / Ferry Row */}
          {busInfo && (
            <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
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
                <div className="text-[12.5px] font-bold text-gray-900 leading-tight">By Bus / Ferry</div>
                <div className="text-[12px] text-gray-500 leading-snug mt-0.5">
                  {renderInlineMarkdown(busInfo)}
                </div>
              </div>
            </div>
          )}

          {/* Location row */}
          {locationInfo && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold text-gray-900 truncate">Destination</div>
                <div className="text-[11.5px] text-gray-500 truncate">{locationInfo}</div>
              </div>
            </div>
          )}

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-gray-100">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${targetPlace}, Goa`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#FFF0EC] text-[#FF6B4A] hover:bg-[#FFE4DC] active:scale-95 transition-all shadow-xs"
            >
              <span>📍 See on map</span>
              <span>↗</span>
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${targetPlace}, Goa`)}${
                userCoords ? `&origin=${userCoords.lat},${userCoords.lng}` : ''
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-95 transition-all shadow-xs"
            >
              <span>🧭 Directions</span>
              <span>↗</span>
            </a>

            {onQuickAction && (
              <button
                type="button"
                onClick={() => onQuickAction(`Best food and cafes near ${targetPlace}?`)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95 transition-all cursor-pointer border border-gray-200/60"
              >
                <span>🍴 Food nearby</span>
              </button>
            )}

            {onQuickAction && (
              <button
                type="button"
                onClick={() => onQuickAction(`Best time of day and photo spots at ${targetPlace}?`)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95 transition-all cursor-pointer border border-gray-200/60"
              >
                <span>📸 Photo tips</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Real-time Web Grounding Sources if present */}
      {groundingSources && groundingSources.length > 0 && (
        <div className="pt-2 border-t border-gray-100 space-y-1">
          <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <span>🌐 Web Search Sources</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {groundingSources.slice(0, 3).map((src, sIdx) => (
              <a
                key={sIdx}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium truncate max-w-[200px]"
              >
                <span className="truncate">{src.title || src.uri}</span>
                <span className="text-[10px]">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const GAIChatPage: React.FC<GAIChatPageProps> = ({ preferences, onBack, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${preferences.name || 'there'}! 🌴 I'm GAI, your real-time Goa travel assistant with live web search and vision analysis capabilities.\n\nAsk me for real-time directions, local prices, live events, or tap the clip icon below to upload photos of menus, landmarks, or beach signs for instant analysis!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);

  const promptSentRef = useRef(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Geolocation State
  const [locationState, setLocationState] = useState<LocationDetails>(() => {
    try {
      const saved = sessionStorage.getItem('goamitra_accurate_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      lat: 15.5428,
      lng: 73.7554,
      placeName: 'Calangute / Baga (North Goa)',
      isInsideGoa: true,
    };
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, attachedImage]);

  useEffect(() => {
    if (initialPrompt && !promptSentRef.current) {
      promptSentRef.current = true;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Request browser geolocation accurately and silently
  useEffect(() => {
    if (!navigator.geolocation) return;

    const onSuccess = async (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      let { placeName, isInsideGoa } = getGoaLocality(lat, lng);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const locality = data.locality || data.city || '';
          const state = data.principalSubdivision || '';

          if (locality) {
            if (state.toLowerCase().includes('goa') || locality.toLowerCase().includes('goa')) {
              placeName = `${locality}, Goa`;
              isInsideGoa = true;
            } else {
              placeName = `${locality}, ${state}`;
              isInsideGoa = false;
            }
          }
        }
      } catch {}

      const updatedLoc: LocationDetails = {
        lat,
        lng,
        placeName,
        isInsideGoa,
      };

      setLocationState(updatedLoc);
      try {
        sessionStorage.setItem('goamitra_accurate_location', JSON.stringify(updatedLoc));
      } catch {}
    };

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      () => {
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          () => {},
          { timeout: 8000, enableHighAccuracy: false }
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

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

      recognition.onerror = () => {
        setIsListening(false);
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
        } catch {}
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const processed = await processImageFile(file);
      setAttachedImage(processed);
      setIsAttachmentSheetOpen(false);
    } catch (err) {
      console.error('Image processing failed', err);
      setSpeechError('Failed to process image file');
      setTimeout(() => setSpeechError(null), 3000);
    } finally {
      e.target.value = '';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if ((!text && !attachedImage) || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentAttachment = attachedImage;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text || (currentAttachment ? 'Please analyze this photo for me.' : ''),
      timestamp: userTime,
      imagePreview: currentAttachment?.dataUrl,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('MISSING_API_KEY');
      }

      const ai = new GoogleGenAI({ apiKey });

      const userName = preferences.name || 'Traveler';
      const travelMonth = preferences.travelMonth || 'this season';
      const travelType = preferences.travelType || 'Exploring';
      const memberCount = preferences.memberCount || 2;
      const tourismTypes = (preferences.tourismTypes || []).join(', ') || 'Culture and Heritage';

      const now = new Date();
      const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentHour = now.getHours();
      let timeOfDay = 'Daytime';
      if (currentHour >= 5 && currentHour < 11) timeOfDay = 'Morning (Breakfast & Poee bread time)';
      else if (currentHour >= 11 && currentHour < 16) timeOfDay = 'Afternoon (Lunch & Susegad / shaded heritage spots)';
      else if (currentHour >= 16 && currentHour < 19) timeOfDay = 'Golden Hour / Sunset Time';
      else if (currentHour >= 19 && currentHour < 23) timeOfDay = 'Evening (Dinner shacks & night markets)';
      else timeOfDay = 'Late Night';

      const locationPrompt = locationState.isInsideGoa
        ? `USER REAL-TIME LOCATION IN GOA:
- Area: ${locationState.placeName}
- Coordinates: ${locationState.lat}, ${locationState.lng}
- Base all travel times, driving routes, and distances (in km) starting directly from ${locationState.placeName}!`
        : `USER REAL-TIME LOCATION:
- Currently at: ${locationState.placeName} (Lat: ${locationState.lat}, Lng: ${locationState.lng})
- Note: User is planning their Goa trip from ${locationState.placeName}. Provide distances assuming their arrival at Goa or answer distance from their city to Goa if asked.`;

      const systemInstruction = `You are GAI (Goa Artificial Intelligence), a smart, hyper-local AI travel companion for Goa, India with REAL-TIME GOOGLE SEARCH GROUNDING and MULTIMODAL VISION ANALYSIS.
User profile:
- Name: ${userName}
- Visiting in: ${travelMonth}
- Group: ${memberCount} members (${travelType})
- Interests: ${tourismTypes}

SITUATIONAL & TIME AWARENESS:
${locationPrompt}
- Current Local Time: ${currentTimeStr} (${timeOfDay})
- When the user asks for "nearby food", "sunset spots", "live events", or "places to visit", use this exact time of day and location to suggest spots that are open right now with realistic distances in km and driving times!

IMAGE & VISION ANALYSIS:
- If the user attaches an image, analyze it thoroughly! Identify Goan dishes, restaurant menus, beach signs, historic architecture, Portuguese villas, churches, maps, or scooter rental agreements.
- Give crisp, actionable answers about what is shown in the photo, including price estimations, history, dietary notes, or directions!

REAL-TIME GOOGLE SEARCH:
- Use Google Search to fetch up-to-the-minute info on Goa event schedules, current road conditions, ferry timings, restaurant opening status, and live weather.

CRITICAL RULES:
1. BREVITY & SMARTNESS: Keep responses punchy, concise, and scannable! Never write long essays or walls of text (maximum 2–3 short sentences for conversational intro). Let the structured card present route & action details!
2. GREETINGS: Do NOT start responses with "Dev Borem Korum" or repeated greetings. Get straight to the answer.
3. LANGUAGE RULE: ALWAYS reply in the EXACT SAME LANGUAGE and SCRIPT that the user writes to you in (English, Marathi, Konkani, Hindi, Romanized Hinglish).
4. IDENTITY: If asked who you are or who created you, reply ONLY with: "I am GAI (Goa AI), created by GoaMitra. I'm a prototype specifically designed and structured by Khethana, Himanshu, Siddhi and Abhishekkumar."
5. STRUCTURED DIRECTIONS:
   By Car/Auto/Scooter: <approximate time and km distance from user's location, route advice>
   By Bus/Ferry: <bus routes, stops or ferry crossing>
   Location: <Exact Place Name in Goa>`;

      // Construct Gemini Contents Array
      const historyContents: any[] = [];

      messages.forEach((m) => {
        if (m.id === 'welcome-1') return;
        historyContents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        });
      });

      // Turn Parts
      const currentParts: any[] = [];

      if (currentAttachment) {
        currentParts.push({
          inlineData: {
            mimeType: currentAttachment.mimeType,
            data: currentAttachment.base64Data,
          },
        });
      }

      currentParts.push({ text: text || 'Please analyze this attached photo and tell me what you see in Goa!' });

      historyContents.push({
        role: 'user',
        parts: currentParts,
      });

      // Call Gemini 3.8 Flash model with Realtime Web Search Grounding
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: historyContents,
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction,
            temperature: 0.6,
          },
        });
      } catch (searchErr) {
        console.warn('Fallback standard generateContent without search tool', searchErr);
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: historyContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
      }

      const content = response.text || 'I could not analyze the request. Please try again.';
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Extract Grounding Chunks if present
      let groundingSources: { title?: string; uri?: string }[] = [];
      try {
        const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (searchChunks && Array.isArray(searchChunks)) {
          groundingSources = searchChunks
            .map((chunk: any) => chunk.web)
            .filter((web: any) => web && web.uri);
        }
      } catch {}

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: botTime,
        groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('GAI Gemini error:', err);
      let errorResponse = "I'm momentarily catching my breath. Please try asking again in a moment!";

      if (err?.message === 'MISSING_API_KEY') {
        errorResponse = "⚠️ Please set VITE_GEMINI_API_KEY in your environment variables to enable real-time GAI responses.";
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
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#F7F7F5] flex flex-col justify-between max-w-[430px] mx-auto select-none relative overflow-hidden font-sans">
      {/* Hidden File Inputs for Camera and Gallery */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 100% Sticky Top Header */}
      <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
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
          <div className="flex items-center gap-1.5">
            <h1 className="text-[19px] font-black text-gray-900 tracking-tight leading-tight">
              GAI
            </h1>
            <span className="px-1.5 py-0.5 rounded-md bg-[#0284C7]/10 text-[#0284C7] font-extrabold text-[10px] tracking-wider uppercase">
              Live Search
            </span>
          </div>
          <span className="text-[11.5px] font-medium text-gray-500 leading-tight">
            Your Real-Time Goa AI Companion
          </span>
        </div>

        {/* Balance spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* Messages Feed */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Top Minimal Pill: Realtime Search Active */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E0F2FE]/80 border border-[#BAE6FD] text-[#0369A1] shadow-xs">
            <span className="text-xs">🌐</span>
            <span className="text-[11.5px] font-bold">Real-time Web Search & Vision</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-400">
            📍 {locationState.placeName.split('/')[0]}
          </span>
        </div>

        {/* Render Chat Messages */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex items-end justify-end gap-2 pl-8">
                {/* User Message Bubble */}
                <div className="flex flex-col items-end">
                  <div className="px-4 py-2.5 rounded-2xl rounded-tr-xs bg-[#FFE7E0] border border-[#FFD8CE] shadow-xs max-w-[285px] space-y-2">
                    {/* User Attached Image Preview */}
                    {msg.imagePreview && (
                      <div className="rounded-xl overflow-hidden border border-black/10 max-h-48 w-full bg-black/5">
                        <img
                          src={msg.imagePreview}
                          alt="User attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {msg.content && (
                      <p className="text-[14px] font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}
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
                <div className="w-8 h-8 rounded-full bg-[#FEE2D8] border border-[#FFD0C0] text-[#9A3412] flex items-center justify-center shrink-0 shadow-xs mb-3">
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
            <div key={msg.id} className="flex items-start gap-2.5 pr-2">
              {/* Bot Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
                </svg>
              </div>

              {/* Bot Message Bubble */}
              <div className="flex flex-col items-start max-w-[325px] min-w-0 flex-1">
                <div className="px-4 py-3 rounded-3xl rounded-tl-xs bg-[#F4F4F6] border border-gray-200/60 shadow-xs text-gray-900 w-full">
                  <FormattedMessage
                    content={msg.content}
                    userCoords={{ lat: locationState.lat, lng: locationState.lng }}
                    groundingSources={msg.groundingSources}
                    onQuickAction={(prompt) => handleSendMessage(prompt)}
                  />
                </div>

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
            <div className="w-8 h-8 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
              </svg>
            </div>
            <div className="px-4 py-2.5 rounded-2xl rounded-tl-xs bg-[#F4F4F6] border border-gray-200/60 shadow-xs flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">GAI is analyzing live web & vision...</span>
              <div className="flex items-center gap-1">
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
          </div>
        )}

        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </div>

      {/* Bottom Bar: Quick Chips, Attachment Preview & Input Bar */}
      <div className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-t border-gray-200/50 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] px-4 space-y-2">
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

        {/* Speech / File Error Banner */}
        {speechError && (
          <div className="text-[11px] text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-1 rounded-full text-center">
            {speechError}
          </div>
        )}

        {/* Attached Image Thumbnail Bar */}
        <AnimatePresence>
          {attachedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="p-2 bg-white rounded-2xl border border-gray-200/90 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                  <img
                    src={attachedImage.dataUrl}
                    alt="Attachment thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">Photo Attached</div>
                  <div className="text-[11px] text-gray-500 font-medium">Ready for GAI Vision analysis</div>
                </div>
              </div>

              {/* Remove Attachment Button */}
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 flex items-center justify-center text-xs font-bold transition-all cursor-pointer shrink-0"
                title="Remove photo"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar with Clip Icon, Input, Mic & Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Input Pill Container */}
          <div className="flex-1 rounded-full bg-white border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-3 py-1.5 flex items-center gap-2 focus-within:border-[#FF6B4A] focus-within:ring-2 focus-within:ring-[#FF6B4A]/15 transition-all">
            {/* PAPERCLIP / ATTACHMENT CLIP BUTTON (Replaces message icon) */}
            <button
              type="button"
              onClick={() => setIsAttachmentSheetOpen(true)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#FFE7E0] hover:text-[#FF6B4A] text-gray-600 flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Attach photo or take picture"
              aria-label="Attach photo or camera"
            >
              <svg
                className="w-4.5 h-4.5 rotate-[45deg]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            {/* Input Text Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening... speak now'
                  : attachedImage
                  ? 'Ask about this photo...'
                  : 'Ask GAI anything...'
              }
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
            disabled={(!input.trim() && !attachedImage) || isLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-md transition-all ${
              (input.trim() || attachedImage) && !isLoading
                ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] hover:brightness-105 active:scale-95 cursor-pointer shadow-[0_4px_12px_rgba(255,107,74,0.35)]'
                : 'bg-gray-300 text-gray-100 cursor-not-allowed shadow-none'
            }`}
            aria-label="Send message"
          >
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

      {/* ATTACHMENT OPTIONS BOTTOM SHEET */}
      <AnimatePresence>
        {isAttachmentSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAttachmentSheetOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Bottom Sheet Menu */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="w-full max-w-[430px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl relative z-10 space-y-4"
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Attach Media for GAI</h3>
                  <p className="text-xs text-gray-500">Analyze menus, beach landmarks, or maps</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAttachmentSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Action Buttons: Camera & Upload */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* 1. Camera Option */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-[#FFF3EE] border border-[#FFD0C0] hover:bg-[#FFE7DF] active:scale-98 transition-all flex flex-col items-center gap-2 text-center cursor-pointer shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B4A] text-white flex items-center justify-center text-xl shadow-xs">
                    📷
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">Take Photo</div>
                    <div className="text-[11px] font-semibold text-gray-500 mt-0.5">Use device camera</div>
                  </div>
                </button>

                {/* 2. Gallery Upload Option */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] hover:bg-[#E0F2FE] active:scale-98 transition-all flex flex-col items-center gap-2 text-center cursor-pointer shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center text-xl shadow-xs">
                    🖼️
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">Upload Photo</div>
                    <div className="text-[11px] font-semibold text-gray-500 mt-0.5">Choose from gallery</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
