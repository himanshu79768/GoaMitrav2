import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { UserPreferences, SavedItineraryItem, SavedPlaceItem } from '../types/onboarding';
import { ALL_DESTINATIONS } from './DestinationsPage';
import { ACCURATE_VERIFIED_STAYS } from './StayPage';
import { REAL_RESTAURANTS } from './FoodPage';

export interface ExecutedAction {
  type: 'saved_itinerary' | 'navigated' | 'saved_place' | 'updated_name' | 'updated_preferences' | 'removed_itinerary' | 'removed_place';
  title: string;
  subtitle: string;
  badge?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imagePreview?: string; // base64 data URL for uploaded image
  groundingSources?: { title?: string; uri?: string }[];
  executedAction?: ExecutedAction;
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
  onSaveItinerary?: (item: SavedItineraryItem) => void;
  onRemoveItinerary?: (id: string) => void;
  savedItineraries?: SavedItineraryItem[];
  savedPlaces?: SavedPlaceItem[];
  onToggleSavePlace?: (place: SavedPlaceItem) => void;
  onNavigateScreen?: (
    screen: 'my_goa' | 'stay' | 'destinations' | 'travel' | 'food' | 'culture' | 'emergency' | 'coupons' | 'homepage',
    initialTab?: 'itineraries' | 'saved_places'
  ) => void;
  onUpdateName?: (newName: string) => void;
  onUpdatePreferences?: (partial: Partial<UserPreferences>) => void;
}

const QUICK_PROMPTS = [
  { label: 'Prepare 3-Day Itinerary', icon: '🗺️', prompt: 'Please prepare a complete 3-day itinerary for my Goa trip based on my preferences. Format it clearly by day with morning, afternoon, and evening plans.' },
  { label: 'Nearby food?', icon: '🍴', prompt: 'What are the best authentic Goan food spots closest to my current spot right now?' },
  { label: 'Sunset spots?', icon: '🌅', prompt: 'What is the closest and best sunset viewpoint to visit from here?' },
  { label: 'Scooter/cab rates?', icon: '🛵', prompt: 'How much does scooter rental and private taxi cost around here?' },
  { label: 'Historic churches?', icon: '📍', prompt: 'What are the closest historic churches and Portuguese heritage sights near me?' },
];

/** Helper to match places, stays, or restaurants from user input */
function findPlaceByName(query: string): SavedPlaceItem | null {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return null;

  // 1. Destinations & Forts & Beaches
  const dest = ALL_DESTINATIONS.find((d) => {
    const dName = d.name.toLowerCase();
    return dName.includes(q) || q.includes(dName);
  });
  if (dest) {
    return {
      id: dest.id,
      title: dest.name,
      category: 'destination',
      subtitle: dest.location,
      location: dest.location,
      image: dest.image,
      ratingOrPrice: dest.entryFee || 'Landmark',
      tags: dest.tags,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  }

  // 2. Stays & Resorts
  const stay = ACCURATE_VERIFIED_STAYS.find((s) => {
    const sName = s.name.toLowerCase();
    return sName.includes(q) || q.includes(sName);
  });
  if (stay) {
    return {
      id: stay.id,
      title: stay.name,
      category: 'stay',
      subtitle: stay.locality,
      location: stay.locality,
      image: stay.image,
      ratingOrPrice: `₹${stay.basePricePerRoom.toLocaleString('en-IN')}/night • ${stay.starsDisplay}`,
      tags: [stay.starsDisplay, stay.type],
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  }

  // 3. Restaurants & Dining
  const rest = REAL_RESTAURANTS.find((r) => {
    const rName = r.name.toLowerCase();
    return rName.includes(q) || q.includes(rName);
  });
  if (rest) {
    return {
      id: rest.id,
      title: rest.name,
      category: 'food',
      subtitle: rest.location,
      location: rest.location,
      image: rest.image,
      ratingOrPrice: `${rest.priceCategory} • ${rest.dietaryType === 'veg' ? 'Pure Veg' : 'Seafood & Multi-cuisine'}`,
      tags: [rest.cuisineStyle === 'goan_authentic' ? 'Authentic Goan' : 'Multi-cuisine'],
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  }

  return null;
}

/** Safe Haptic Vibration Helper */
function triggerHaptic(pattern: number | number[] = 12) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
}

/** Formats current time into clean 12-hour format (e.g. 10:15 AM) */
function format12HourTime(date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

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

/** Parses markdown tables into clean styled HTML table elements */
function renderMarkdownTable(tableLines: string[]): React.ReactNode {
  if (tableLines.length === 0) return null;

  // Filter out formatting lines like |---|---|
  const dataLines = tableLines.filter((line) => !line.match(/^\|?\s*:?-+:?\s*(\||\+)/));
  if (dataLines.length === 0) return null;

  const splitCells = (line: string) => {
    const raw = line.split('|').map((c) => c.trim());
    if (raw.length > 1) {
      // Drop empty leading/trailing array entries from outer pipes
      if (raw[0] === '') raw.shift();
      if (raw[raw.length - 1] === '') raw.pop();
    }
    return raw;
  };

  const headerCells = splitCells(dataLines[0]);
  const bodyRows = dataLines.slice(1).map((line) => splitCells(line));

  return (
    <div className="my-2.5 overflow-x-auto rounded-[16px] bg-black/[0.03] border border-black/[0.04] p-1 shadow-2xs max-w-full">
      <table className="w-full text-left border-collapse text-[12.5px]">
        {headerCells.length > 0 && (
          <thead className="bg-black/[0.04] text-gray-900 font-bold rounded-t-[12px]">
            <tr>
              {headerCells.map((cell, idx) => (
                <th key={idx} className="px-3 py-2 border-r last:border-r-0 border-black/[0.04] whitespace-nowrap">
                  {renderInlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {bodyRows.length > 0 && (
          <tbody className="divide-y divide-black/[0.03] text-gray-800">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/60 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 border-r last:border-r-0 border-black/[0.03] font-normal">
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
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

/** Determines if a message is a prepared itinerary / travel plan rather than a general answer */
export function isItineraryContent(content: string): boolean {
  if (!content || content.length < 80) return false;

  const lower = content.toLowerCase();

  // 1. Explicit title indicators
  const hasExplicitTitle =
    /(?:^|\n)#+\s*(?:.*\bitinerary\b|.*trip plan|.*day plan|.*tour plan|.*schedule)/i.test(content) ||
    /^(?:itinerary|trip plan):/im.test(content);

  // 2. Multi-day patterns (Day 1, Day 2 or ### Day 1, etc.)
  const dayMatches = content.match(/(?:^|\n)\s*(?:###?\s*|\*\*\s*)?Day\s*\d+\b/gi);
  const hasMultipleDays = Boolean(dayMatches && dayMatches.length >= 2);
  const hasDayWithTimeBlocks = Boolean(
    dayMatches &&
      dayMatches.length >= 1 &&
      (lower.includes('morning') || lower.includes('afternoon') || lower.includes('evening'))
  );

  // 3. Single-day full schedule with morning, afternoon and evening blocks
  const hasFullDaySchedule =
    lower.includes('itinerary') &&
    lower.includes('morning') &&
    (lower.includes('afternoon') || lower.includes('evening'));

  return Boolean(hasExplicitTitle || hasMultipleDays || hasDayWithTimeBlocks || hasFullDaySchedule);
}

/** FormattedMessage: Full Markdown renderer (H1-H4, bullets, numbered lists, tables, transport cards) */
const FormattedMessage: React.FC<{
  content: string;
  userCoords?: { lat: number; lng: number } | null;
  groundingSources?: { title?: string; uri?: string }[];
  onQuickAction?: (prompt: string) => void;
}> = ({ content, userCoords, groundingSources, onQuickAction }) => {
  const lines = content.split('\n');
  let nonTransportLines: string[] = [];
  let carInfo: string | null = null;
  let busInfo: string | null = null;
  let locationInfo: string | null = null;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      nonTransportLines.push(rawLine);
      continue;
    }

    // Strip markdown bullets, numbers, pipe characters, hashtags and leading asterisks/underscores
    const clean = trimmed
      .replace(/^[|#*•\-\d.\s]+/, '')
      .replace(/^[*_]+/, '')
      .trim();

    // Check for Car / Auto transit (matching bullets, bold, colons, or pipes)
    const carMatch = clean.match(/^(?:(?:\*\*|\*)?(?:🚗|🚘)?\s*(?:By\s+)?(?:Car(?:\s*[\/|&]\s*(?:Auto|Cab|Taxi|Scooter))?|Auto|Cab|Taxi|Scooter|Drive|Road)(?:\s*[\/|&]\s*(?:Car|Auto|Cab|Taxi|Scooter))?)(?:\*\*|\*)?\s*[:|]\s*(.*)/i);

    // Check for Bus / Public transit (matching bullets, bold, colons, or pipes)
    const busMatch = clean.match(/^(?:(?:\*\*|\*)?(?:🚌|🚎|⛴|🚢)?\s*(?:By\s+)?(?:Bus(?:\s*[\/|&]\s*(?:Ferry|Auto))?|Ferry|Public\s*Transit|Local\s*Bus))(?:\*\*|\*)?\s*[:|]\s*(.*)/i);

    // Check for Location / Destination (matching bullets, bold, colons, or pipes)
    const locMatch = clean.match(/^(?:(?:\*\*|\*)?(?:📍|🏛|🏖|📌)?\s*(?:Location|Place|Destination|Address))(?:\*\*|\*)?\s*[:|]\s*(.*)/i);

    if (carMatch && !carInfo) {
      carInfo = carMatch[1].replace(/^[|*_]+|[|*_]+$/g, '').replace(/\|.*$/, '').trim();
    } else if (busMatch && !busInfo) {
      busInfo = busMatch[1].replace(/^[|*_]+|[|*_]+$/g, '').replace(/\|.*$/, '').trim();
    } else if (locMatch && !locationInfo) {
      locationInfo = locMatch[1].replace(/^[|*_]+|[|*_]+$/g, '').replace(/\|.*$/, '').trim();
    } else {
      nonTransportLines.push(rawLine);
    }
  }

  const hasTransportCard = Boolean(carInfo || busInfo || locationInfo);

  // If a transport card was found, remove any lingering table header rows like "| Mode | Details |" or "|---|---|"
  if (hasTransportCard) {
    nonTransportLines = nonTransportLines.filter((l) => {
      const text = l.trim().toLowerCase();
      if (text.includes('|') && (text.includes('mode') || text.includes('transport') || text.includes('transit') || text.includes('route') || text.includes('details') || /^\|[-:\s|]+\|?$/.test(text))) {
        return false;
      }
      return true;
    });
  }

  // Deducing destination place for location row & View on map button
  let targetPlace = locationInfo ? locationInfo.replace(/[.,]+$/, '').trim() : '';
  if (!targetPlace) {
    const introLine = nonTransportLines.find((l) => l.trim().length > 0) || '';
    const match = introLine.match(/^([A-Za-z0-9\s'&]+?(?:Church|Beach|Fort|Temple|Waterfall|Market|Resort|Shack|Palace|Sanctuary|Lake|Caves)?(?:\s*\([^)]+\))?)/i);
    if (match && match[1].length < 50) {
      targetPlace = match[1].trim();
    } else {
      targetPlace = 'Goa';
    }
  }

  const renderedElements: React.ReactNode[] = [];
  let currentBullets: string[] = [];
  let currentTableLines: string[] = [];

  const flushBullets = (key: string) => {
    if (currentBullets.length > 0) {
      renderedElements.push(
        <ul key={key} className="my-2 space-y-1.5 pl-1">
          {currentBullets.map((b, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[14px] leading-relaxed text-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] mt-2 shrink-0" />
              <span>{renderInlineMarkdown(b)}</span>
            </li>
          ))}
        </ul>
      );
      currentBullets = [];
    }
  };

  const flushTable = (key: string) => {
    if (currentTableLines.length > 0) {
      const tableNode = renderMarkdownTable(currentTableLines);
      if (tableNode) {
        renderedElements.push(<React.Fragment key={key}>{tableNode}</React.Fragment>);
      }
      currentTableLines = [];
    }
  };

  nonTransportLines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    // Handle Markdown Table Rows (lines containing '|')
    if (line.includes('|')) {
      flushBullets(`b-flush-t-${index}`);
      currentTableLines.push(line);
      return;
    } else {
      flushTable(`tbl-flush-${index}`);
    }

    if (!line) {
      flushBullets(`b-flush-${index}`);
      return;
    }

    // Bullet Lists
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      currentBullets.push(line.replace(/^[-*•]\s+/, ''));
      return;
    }

    // Numbered Lists
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

    // Headings: H1 (#), H2 (##), H3 (###), H4 (####)
    if (line.startsWith('# ')) {
      flushBullets(`b-flush-h1-${index}`);
      const headingText = line.replace(/^#\s+/, '');
      renderedElements.push(
        <h1 key={`h1-${index}`} className="font-extrabold text-[18px] text-gray-900 mt-3 mb-1.5 leading-snug">
          {renderInlineMarkdown(headingText)}
        </h1>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushBullets(`b-flush-h2-${index}`);
      const headingText = line.replace(/^##\s+/, '');
      renderedElements.push(
        <h2 key={`h2-${index}`} className="font-extrabold text-[16px] text-gray-900 mt-2.5 mb-1 leading-snug">
          {renderInlineMarkdown(headingText)}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      flushBullets(`b-flush-h3-${index}`);
      const headingText = line.replace(/^###\s+/, '');
      renderedElements.push(
        <h3 key={`h3-${index}`} className="font-bold text-[15px] text-gray-900 mt-2 mb-1 leading-tight">
          {renderInlineMarkdown(headingText)}
        </h3>
      );
      return;
    }

    if (line.startsWith('#### ')) {
      flushBullets(`b-flush-h4-${index}`);
      const headingText = line.replace(/^####\s+/, '');
      renderedElements.push(
        <h4 key={`h4-${index}`} className="font-bold text-[14px] text-gray-800 mt-1.5 mb-0.5">
          {renderInlineMarkdown(headingText)}
        </h4>
      );
      return;
    }

    // Standard Paragraph
    flushBullets(`b-flush-p-${index}`);
    renderedElements.push(
      <p key={`p-${index}`} className="text-[14px] leading-relaxed text-gray-800 mb-1.5 last:mb-0">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  flushBullets('b-flush-final');
  flushTable('tbl-flush-final');

  return (
    <div className="space-y-1">
      {renderedElements}

      {/* Structured Transport & Location Table Card (As in reference image) */}
      {hasTransportCard && (
        <div className="my-3 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3">
          {/* Row 1: By Car / Auto */}
          {carInfo && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-gray-900 leading-tight">By Car/Auto</div>
                <div className="text-[12px] text-gray-500 leading-snug mt-0.5">
                  {renderInlineMarkdown(carInfo)}
                </div>
              </div>
            </div>
          )}

          {/* Row 2: By Bus */}
          {busInfo && (
            <div className="flex items-start gap-3 pt-2.5 border-t border-gray-100/90">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 6v6" />
                  <path d="M16 6v6" />
                  <path d="M4 12h16" />
                  <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                  <circle cx="7.5" cy="18.5" r="1.5" />
                  <circle cx="16.5" cy="18.5" r="1.5" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-gray-900 leading-tight">By Bus</div>
                <div className="text-[12px] text-gray-500 leading-snug mt-0.5">
                  {renderInlineMarkdown(busInfo)}
                </div>
              </div>
            </div>
          )}

          {/* Row 3: Location with Peach View on map button */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-gray-100/90">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-gray-900 leading-tight">Location</div>
                <div className="text-[12px] text-gray-500 leading-snug mt-0.5 truncate">
                  {locationInfo || targetPlace}
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${targetPlace}, Goa`)}${
                userCoords ? `&origin=${userCoords.lat},${userCoords.lng}` : ''
              }`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic(10)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold bg-[#FFECE6] hover:bg-[#FFE0D6] text-[#E05333] transition-all active:scale-95 shrink-0 cursor-pointer shadow-2xs"
            >
              <span>View on map</span>
              <span className="text-[12px]">↗</span>
            </a>
          </div>

          {/* Contextual Quick Suggestions */}
          {onQuickAction && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-gray-100/90">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  onQuickAction(`Best food and cafes near ${targetPlace}?`);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer border border-gray-200/60 shadow-2xs"
              >
                <span>🍴 Nearby food?</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  onQuickAction(`Best time to visit and photo spots at ${targetPlace}?`);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer border border-gray-200/60 shadow-2xs"
              >
                <span>📷 Best time to visit?</span>
              </button>
            </div>
          )}
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
                onClick={() => triggerHaptic(8)}
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

/** TypewriterFormattedMessage: Animates text typing smoothly with haptic vibrations */
const TypewriterFormattedMessage: React.FC<{
  msg: ChatMessage;
  isLatestBot: boolean;
  userCoords?: { lat: number; lng: number } | null;
  onQuickAction?: (prompt: string) => void;
  onScrollNeeded?: () => void;
}> = ({ msg, isLatestBot, userCoords, onQuickAction, onScrollNeeded }) => {
  const [displayedLength, setDisplayedLength] = useState(() =>
    isLatestBot ? 0 : msg.content.length
  );
  const [isTyping, setIsTyping] = useState(() => isLatestBot && msg.content.length > 0);

  useEffect(() => {
    if (!isLatestBot || displayedLength >= msg.content.length) {
      setIsTyping(false);
      return;
    }

    // Trigger haptic vibration when AI begins typing answer
    if (displayedLength === 0) {
      triggerHaptic([30, 45, 30]);
    }

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        const step = Math.max(2, Math.floor((msg.content.length - prev) / 12) + 1); // smooth organic acceleration
        const next = Math.min(prev + step, msg.content.length);

        // Subtle haptic pulse every ~35 chars during typing
        if (next % 35 < step) {
          triggerHaptic(6);
        }

        if (next >= msg.content.length) {
          clearInterval(interval);
          setIsTyping(false);
          triggerHaptic(18); // completion tap
        }
        return next;
      });

      if (onScrollNeeded) {
        onScrollNeeded();
      }
    }, 22);

    return () => clearInterval(interval);
  }, [msg.content, isLatestBot]);

  const displayedContent = isLatestBot ? msg.content.slice(0, displayedLength) : msg.content;

  const handleSkipTyping = () => {
    if (isTyping) {
      setDisplayedLength(msg.content.length);
      setIsTyping(false);
      triggerHaptic(12);
    }
  };

  return (
    <div onClick={handleSkipTyping} className={isTyping ? 'cursor-pointer' : ''}>
      <FormattedMessage
        content={displayedContent}
        userCoords={userCoords}
        groundingSources={!isTyping ? msg.groundingSources : undefined}
        onQuickAction={onQuickAction}
      />
      {isTyping && (
        <span className="inline-flex items-center gap-1.5 mt-2 text-[#177F91] text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#177F91] animate-ping" />
          <span className="text-[#177F91]/90 italic">GAI typing...</span>
        </span>
      )}
    </div>
  );
};

export const GAIChatPage: React.FC<GAIChatPageProps> = ({
  preferences,
  onBack,
  initialPrompt,
  onSaveItinerary,
  onRemoveItinerary,
  savedItineraries,
  savedPlaces,
  onToggleSavePlace,
  onNavigateScreen,
  onUpdateName,
  onUpdatePreferences,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${preferences.name || 'there'}! 🌴 Warm greetings and welcome to Goa. How may I help you today?`,
      timestamp: format12HourTime(),
    },
  ]);

  const [latestBotMessageId, setLatestBotMessageId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const inputRef = useRef(input);
  inputRef.current = input;

  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Message Interaction States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);

  const handleSaveItineraryFromMessage = (msg: { id: string; content: string }): SavedItineraryItem | null => {
    const existing = savedItineraries?.find((i) => i.id === msg.id);
    if (existing) {
      setToastMessage('Already saved in My Goa! 🌴');
      setTimeout(() => setToastMessage(null), 2500);
      return existing;
    }

    const lines = msg.content.split('\n').filter((l) => l.trim().length > 0);
    let title = `Goa Itinerary (${preferences.travelMonth || 'Trip'})`;
    for (const l of lines) {
      const clean = l.replace(/[*#]/g, '').trim();
      if (
        clean.length > 5 &&
        clean.length < 65 &&
        (clean.toLowerCase().includes('itinerary') ||
          clean.toLowerCase().includes('plan') ||
          clean.toLowerCase().includes('day') ||
          clean.toLowerCase().includes('goa'))
      ) {
        title = clean.replace(/^(?:itinerary|trip plan):\s*/i, '').trim() || title;
        break;
      }
    }

    const cleanContent = msg.content.replace(/\[ACTION:[^\]]+\]/g, '').trim();

    const item: SavedItineraryItem = {
      id: msg.id,
      title,
      content: cleanContent,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      season: preferences.travelMonth || 'Goa Plan',
    };

    if (onSaveItinerary) {
      onSaveItinerary(item);
    }

    triggerHaptic([15, 30]);
    setToastMessage('Itinerary saved to My Goa! 🌴');
    setTimeout(() => setToastMessage(null), 2500);

    return item;
  };

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

  // Cleanup Speech Recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    triggerHaptic(12);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Voice typing is not supported in this browser.');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please enable microphone permissions in your browser.');
        } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
          setErrorMessage('Voice input error. Please try again.');
        }
        setIsListening(false);
        setTimeout(() => setErrorMessage(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start error:', err);
      setIsListening(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      triggerHaptic(15);
      const processed = await processImageFile(file);
      setAttachedImage(processed);
      setIsAttachmentSheetOpen(false);
    } catch (err) {
      console.error('Image processing failed', err);
      setErrorMessage('Failed to process image file');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      e.target.value = '';
    }
  };

  const handleCopy = (id: string, text: string) => {
    triggerHaptic(10);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (text: string) => {
    triggerHaptic(10);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GAI Goa Travel Tip',
          text,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied travel recommendation to clipboard!');
    }
  };

  const toggleLike = (id: string) => {
    triggerHaptic(10);
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setDislikedIds((prev) => prev.filter((i) => i !== id));
  };

  const toggleDislike = (id: string) => {
    triggerHaptic(10);
    setDislikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setLikedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if ((!text && !attachedImage) || isLoading) return;

    triggerHaptic(15);

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    const userTime = format12HourTime();
    const currentAttachment = attachedImage;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text || (currentAttachment ? 'Please analyze this photo for me.' : ''),
      timestamp: userTime,
      imagePreview: currentAttachment?.dataUrl,
    };

    setLatestBotMessageId(null);
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    // Check for user direct action intent
    const isSaveItineraryIntent =
      /(?:^|\b)(?:save(?:\s+it|\s+this|\s+the|\s+my)?(?:\s+(?:itinerary|plan|trip|schedule|days?))?|add(?:\s+it|\s+this)?\s+to\s+my\s+goa|bookmark(?:\s+it|\s+this|\s+itinerary)?|keep(?:\s+it|\s+this)?|store(?:\s+it|\s+this)?|yes(?:\s+please)?\s+save(?:\s+it)?|save\s+for\s+me)\b/i.test(
        text
      );

    let preSavedItinerary: SavedItineraryItem | null = null;
    if (isSaveItineraryIntent) {
      const latestItineraryMsg = [...messages].reverse().find(
        (m) => m.role === 'assistant' && isItineraryContent(m.content)
      );
      if (latestItineraryMsg) {
        preSavedItinerary = handleSaveItineraryFromMessage(latestItineraryMsg);
      }
    }

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
      const currentTimeStr = format12HourTime(now);
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

      const systemInstruction = `You are GAI (Goa Artificial Intelligence), a smart, hyper-local AI travel companion for Goa, India with real-time location grounding and multimodal vision analysis.
User profile:
- Name: ${userName}
- Visiting in: ${travelMonth}
- Group: ${memberCount} members (${travelType})
- Interests: ${tourismTypes}

SITUATIONAL & TIME AWARENESS:
${locationPrompt}
- Current Local Time: ${currentTimeStr} (${timeOfDay})

CRITICAL RESPONSE RULES:
1. LIGHTNING FAST & CONCISE (AVOID LENGTHY PARAGRAPHS):
   - Keep all responses short, sweet, crisp, and to the point.
   - Avoid long, dense blocks of text. Use 2–4 clean bullet points or 1–2 brief paragraphs (2-3 sentences max).
   - Answer directly and immediately without unnecessary fluff.

2. SWEET & FORMAL TONE:
   - Maintain a courteous, warm, refined, and sweet formal tone throughout.
   - Be polite and helpful (e.g., "Certainly, here is the recommendation for you...", "It is a pleasure to assist you...").

3. LANGUAGE & SCRIPT RULES (STRICT):
   - If the user asks in English (or Roman script / Roman English): **ALWAYS STICK TO ROMAN ENGLISH.** Do NOT use Devanagari script for English queries.
   - ONLY use Devanagari script if the user explicitly asks or writes in Hindi, Marathi, or Konkani:
     * Hindi (हिन्दी / Hinglish): Reply in sweet, formal **Devanagari Hindi (देवनागरी हिन्दी)**.
     * Marathi (मराठी): Reply in polite, formal **Devanagari Marathi (देवनागरी मराठी)**.
     * Konkani (कोंकणी): Reply in authentic, sweet **Devanagari Konkani (देवनागरी कोंकणी)**.

4. TABLES & CLEAN FORMATTING:
   - When comparing multiple beaches, stays, or transportation options, render a clean Markdown table.
   - Use bold titles and structured bullet points for readability.

5. IDENTITY:
   - If asked who you are or who created you, reply with: "I am GAI (Goa AI), created by GoaMitra. I'm a prototype specifically designed and structured by Khethana, Himanshu, Siddhi and Abhishekkumar."

6. REFERENCE RESPONSE FORMAT (STRICTLY FOLLOW FOR ALL ANSWERS):
   - When asked how to reach a landmark/beach/church (e.g., "Parra church kase jayche?", "How to get to Chapora Fort?"):
     * CRITICAL: NEVER USE BULLET POINTS (* or -) OR NUMBERED LISTS! Do NOT format transit as bullet items.
     * 1st sentence: State the place and region in one clear line (e.g. "Parra Church (St. Anne’s Church) is in Parra, North Goa.")
     * Then immediately write these exact lines without bullets or asterisks around the labels:
       By Car/Auto: <Time duration from prominent hub/landmark via specific road>
       By Bus: <Specific bus routes & connecting local transit steps>
       Location: <Exact place name and locality, Goa>
   - When asked factual / entry / timing / tips questions (e.g., "Is there an entry fee? / तेथे प्रवेश फी आहे का ?"):
     * 1st sentence: Direct, clear answer with relevant emoji (e.g., "No, Parra Church is open for all and there is no entry fee. ⛪")
     * 2nd sentence: 1 concise tip or etiquette rule (e.g., "However, it’s a place of worship, so please maintain silence and dress modestly.")
     * Keep the response under 2-3 short, crisp sentences. Zero fluff.

7. EXPLICIT ACTION TAGS (ONLY WHEN USER EXPLICITLY COMMANDS):
   ONLY append action command tags at the very end when the user EXPLICITLY tells you to save or navigate (e.g. "save it", "save to my goa", "open food page", "take me to hotels"). Never append navigate or save tags for general questions or recommendations:
   [ACTION:SAVE_ITINERARY] -> Saves generated itinerary to My Goa (only when user says "save it").
   [ACTION:SAVE_PLACE:Exact Place Name] -> Bookmarks place to My Goa.
   [ACTION:REMOVE_PLACE:Exact Place Name] -> Removes place from My Goa.
   [ACTION:NAVIGATE:my_goa] -> Opens My Goa.
   [ACTION:NAVIGATE:stay] -> Opens Stays & Hotels.
   [ACTION:NAVIGATE:destinations] -> Opens Destinations.
   [ACTION:NAVIGATE:travel] -> Opens Travel transit.
   [ACTION:NAVIGATE:food] -> Opens Food & Dining.
   [ACTION:NAVIGATE:culture] -> Opens Culture & Festivals.
   [ACTION:NAVIGATE:emergency] -> Opens Emergency.
   [ACTION:NAVIGATE:coupons] -> Opens Coupons.
   [ACTION:UPDATE_NAME:NewName] -> Updates user name.`;

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

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: historyContents,
          config: {
            systemInstruction,
            temperature: 0.4,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          },
        });
      } catch (liteErr) {
        console.warn('Fallback standard generateContent', liteErr);
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: historyContents,
          config: {
            systemInstruction,
            temperature: 0.4,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });
      }

      let content = response.text || 'I could not analyze the request. Please try again.';
      const botTime = format12HourTime();

      let groundingSources: { title?: string; uri?: string }[] = [];
      try {
        const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (searchChunks && Array.isArray(searchChunks)) {
          groundingSources = searchChunks
            .map((chunk: any) => chunk.web)
            .filter((web: any) => web && web.uri);
        }
      } catch {}

      // Autonomous Action Parsing and Execution on behalf of the user
      let executedAction: ExecutedAction | undefined = undefined;

      // 1. SAVE ITINERARY ONLY WHEN USER EXPLICITLY ASKS FOR IT
      const isItineraryBotResponse = isItineraryContent(content);
      if (isSaveItineraryIntent && onSaveItinerary) {
        const targetItinerary =
          preSavedItinerary ||
          [...messages].reverse().find((m) => m.role === 'assistant' && isItineraryContent(m.content)) ||
          (isItineraryBotResponse ? { id: `bot-${Date.now()}`, content } : null);

        const savedItem = targetItinerary ? (preSavedItinerary || handleSaveItineraryFromMessage(targetItinerary)) : null;

        if (savedItem) {
          executedAction = {
            type: 'saved_itinerary',
            title: 'Itinerary Saved to My Goa',
            subtitle: `Saved "${savedItem.title}" to your dashboard`,
            buttonText: 'Open My Goa',
            onButtonClick: () => {
              triggerHaptic(12);
              onNavigateScreen?.('my_goa', 'itineraries');
            },
          };
        }
      } else if (isItineraryBotResponse) {
        // If an itinerary was generated without explicit save request, show an interactive "Save to My Goa" button
        executedAction = {
          type: 'saved_itinerary',
          title: 'Custom Itinerary Ready',
          subtitle: 'Tap to save this itinerary to your My Goa dashboard',
          buttonText: 'Save Itinerary',
          onButtonClick: () => {
            triggerHaptic([15, 30]);
            handleSaveItineraryFromMessage({ id: `bot-${Date.now()}`, content });
          },
        };
      }

      // 2. SAVE PLACE / STAY / RESTAURANT (ONLY WHEN EXPLICITLY REQUESTED)
      const savePlaceTagMatch = content.match(/\[ACTION:SAVE_PLACE:([^\]]+)\]/i);
      const userSavePlaceMatch = text.match(
        /(?:^|\b)(?:save|bookmark|add|favorite)\s+([A-Za-z0-9\s'&]+?)(?:\s+to\s+(?:my\s+goa|favorites?|saved|places?)|$)/i
      );

      const placeNameToSave = (
        (userSavePlaceMatch && !isSaveItineraryIntent ? userSavePlaceMatch[1] : (userSavePlaceMatch ? savePlaceTagMatch?.[1] : '')) || ''
      ).trim();

      if (placeNameToSave && placeNameToSave.length > 2 && onToggleSavePlace && !executedAction) {
        const matchedPlace = findPlaceByName(placeNameToSave) || {
          id: `saved-${Date.now()}`,
          title: placeNameToSave,
          category:
            placeNameToSave.toLowerCase().includes('hotel') ||
            placeNameToSave.toLowerCase().includes('resort') ||
            placeNameToSave.toLowerCase().includes('stay')
              ? 'stay'
              : placeNameToSave.toLowerCase().includes('rest') ||
                placeNameToSave.toLowerCase().includes('cafe') ||
                placeNameToSave.toLowerCase().includes('dish') ||
                placeNameToSave.toLowerCase().includes('food')
              ? 'food'
              : 'destination',
          subtitle: 'Goa spot',
          location: 'Goa',
          image:
            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
          ratingOrPrice: 'Saved by GAI',
          savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };

        onToggleSavePlace(matchedPlace);
        triggerHaptic([15, 30]);
        setToastMessage(`Saved "${matchedPlace.title}" to My Goa! ❤️`);
        setTimeout(() => setToastMessage(null), 2500);

        executedAction = {
          type: 'saved_place',
          title: `Saved "${matchedPlace.title}" to My Goa`,
          subtitle: `Added to Liked Places (${matchedPlace.location || 'Goa'})`,
          buttonText: 'View in My Goa',
          onButtonClick: () => {
            triggerHaptic(12);
            onNavigateScreen?.('my_goa', 'saved_places');
          },
        };
      }

      // 3. REMOVE PLACE
      const removePlaceTagMatch = content.match(/\[ACTION:REMOVE_PLACE:([^\]]+)\]/i);
      const userRemovePlaceMatch = text.match(
        /(?:^|\b)(?:remove|unsave|delete)\s+([A-Za-z0-9\s'&]+?)(?:\s+from\s+(?:my\s+goa|saved|favorites?)|$)/i
      );
      const placeNameToRemove = (removePlaceTagMatch?.[1] || userRemovePlaceMatch?.[1] || '').trim();

      if (placeNameToRemove && savedPlaces && onToggleSavePlace && !executedAction) {
        const target = savedPlaces.find((p) =>
          p.title.toLowerCase().includes(placeNameToRemove.toLowerCase())
        );
        if (target) {
          onToggleSavePlace(target);
          triggerHaptic(12);
          setToastMessage(`Removed "${target.title}" from My Goa`);
          setTimeout(() => setToastMessage(null), 2500);
          executedAction = {
            type: 'removed_place',
            title: `Removed "${target.title}"`,
            subtitle: 'Removed from your My Goa liked places',
          };
        }
      }

      // 4. REMOVE ITINERARY
      const isRemoveItinerary =
        /(?:^|\b)(?:remove|delete|unsave)\s+(?:the\s+|this\s+|my\s+)?(?:itinerary|plan|trip)\b/i.test(text) ||
        content.includes('[ACTION:REMOVE_ITINERARY]');

      if (isRemoveItinerary && savedItineraries && savedItineraries.length > 0 && onRemoveItinerary && !executedAction) {
        const itemToRemove = savedItineraries[0];
        onRemoveItinerary(itemToRemove.id);
        triggerHaptic(12);
        setToastMessage(`Removed "${itemToRemove.title}" from My Goa`);
        setTimeout(() => setToastMessage(null), 2500);
        executedAction = {
          type: 'removed_itinerary',
          title: 'Removed Itinerary',
          subtitle: `Removed "${itemToRemove.title}" from My Goa`,
        };
      }

      // 5. NAVIGATE TO SCREENS (ONLY IF USER EXPLICITLY ASKS FOR REDIRECT)
      const userNavMatch = text.match(
        /(?:^|\b)(?:open|go\s+to|take\s+me\s+to|navigate\s+to|switch\s+to|show\s+me)\s+(my\s+goa|stays?|hotels?|destinations?|landmarks?|food|restaurants?|culture|festivals?|events?|travel|cabs?|taxis?|scooters?|emergency|helpline|coupons|homepage|home)\b/i
      );

      const navTarget = userNavMatch?.[1]?.toLowerCase();
      if (navTarget && onNavigateScreen && !executedAction) {
        let screenTarget: any = null;
        let initialTabTarget: 'itineraries' | 'saved_places' | undefined = undefined;

        if (
          navTarget.includes('my_goa') ||
          navTarget.includes('mygoa') ||
          navTarget.includes('itinerar') ||
          navTarget.includes('saved')
        ) {
          screenTarget = 'my_goa';
          initialTabTarget = navTarget.includes('place') || navTarget.includes('like') ? 'saved_places' : 'itineraries';
        } else if (navTarget.includes('stay') || navTarget.includes('hotel')) {
          screenTarget = 'stay';
        } else if (navTarget.includes('dest') || navTarget.includes('landmark')) {
          screenTarget = 'destinations';
        } else if (navTarget.includes('food') || navTarget.includes('restaur')) {
          screenTarget = 'food';
        } else if (navTarget.includes('travel') || navTarget.includes('cab') || navTarget.includes('taxi') || navTarget.includes('scooter')) {
          screenTarget = 'travel';
        } else if (
          navTarget.includes('cultur') ||
          navTarget.includes('festiv') ||
          navTarget.includes('event')
        ) {
          screenTarget = 'culture';
        } else if (navTarget.includes('emerg') || navTarget.includes('help')) {
          screenTarget = 'emergency';
        } else if (navTarget.includes('coupon')) {
          screenTarget = 'coupons';
        } else if (navTarget.includes('home')) {
          screenTarget = 'homepage';
        }

        if (screenTarget) {
          const screenNames: Record<string, string> = {
            my_goa: 'My Goa Dashboard',
            stay: 'Stays & Resorts',
            destinations: 'Destinations & Forts',
            food: 'Food & Dining',
            travel: 'Travel & Local Transit',
            culture: 'Culture & Festivals',
            emergency: 'Emergency Helplines',
            coupons: 'Coupons & Deals',
            homepage: 'Homepage',
          };
          const targetName = screenNames[screenTarget] || screenTarget;

          executedAction = {
            type: 'navigated',
            title: `Navigating to ${targetName}`,
            subtitle: 'Switching screen as requested...',
            buttonText: 'Open Now',
            onButtonClick: () => {
              triggerHaptic(12);
              onNavigateScreen(screenTarget, initialTabTarget);
            },
          };

          // Automatically navigate only when user explicitly instructed it
          setTimeout(() => {
            onNavigateScreen(screenTarget, initialTabTarget);
          }, 1000);
        }
      }

      // 6. UPDATE USER NAME AUTOMATICALLY
      const nameTagMatch = content.match(/\[ACTION:UPDATE_NAME:([^\]]+)\]/i);
      const userNameMatch = text.match(
        /(?:^|\b)(?:change|update|set)\s+(?:my\s+)?name\s+to\s+([A-Za-z\s]+)\b/i
      );
      const extractedName = (nameTagMatch?.[1] || userNameMatch?.[1] || '').trim();

      if (extractedName && extractedName.length > 1 && extractedName.length < 35 && onUpdateName && !executedAction) {
        onUpdateName(extractedName);
        triggerHaptic([15, 30]);
        executedAction = {
          type: 'updated_name',
          title: `Name Updated to "${extractedName}"`,
          subtitle: 'Updated across your profile & greetings',
        };
      }

      // 7. UPDATE TRIP PREFERENCES AUTOMATICALLY
      const prefTagMatch = content.match(/\[ACTION:UPDATE_PREF:([^\]]+)\]/i);
      const userMonthMatch = text.match(/(?:change|update|set)\s+(?:travel\s+)?month\s+to\s+([A-Za-z]+)\b/i);
      const userGroupMatch =
        text.match(/(?:change|update|set)\s+(?:group\s+size|member\s+count|people|members?)\s+to\s+(\d+)\b/i) ||
        text.match(/(?:we\s+are|group\s+of)\s+(\d+)\s+people\b/i);
      const userStyleMatch = text.match(
        /(?:change|update|set)\s+(?:travel\s+)?(?:style|type)\s+to\s+([A-Za-z\s/]+)\b/i
      );

      const partialUpdates: Partial<UserPreferences> = {};
      if (prefTagMatch) {
        const parts = prefTagMatch[1].split(';');
        parts.forEach((p) => {
          const [k, v] = p.split('=').map((s) => s.trim());
          if (k === 'month') partialUpdates.travelMonth = v;
          if (k === 'group') partialUpdates.memberCount = parseInt(v, 10) || 2;
          if (k === 'style') partialUpdates.travelType = v;
        });
      }
      if (userMonthMatch) partialUpdates.travelMonth = userMonthMatch[1];
      if (userGroupMatch) partialUpdates.memberCount = parseInt(userGroupMatch[1], 10);
      if (userStyleMatch) partialUpdates.travelType = userStyleMatch[1].trim();

      if (Object.keys(partialUpdates).length > 0 && onUpdatePreferences && !executedAction) {
        onUpdatePreferences(partialUpdates);
        triggerHaptic([15, 30]);
        const details = Object.entries(partialUpdates)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        executedAction = {
          type: 'updated_preferences',
          title: 'Trip Preferences Updated',
          subtitle: details,
        };
      }

      // Clean action tags from displayed text so user reads pristine output
      const cleanContent = content.replace(/\[ACTION:[^\]]+\]/g, '').trim();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: cleanContent,
        timestamp: botTime,
        groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
        executedAction,
      };

      setLatestBotMessageId(botMsg.id);
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('GAI Gemini error:', err);
      let errorResponse = "I'm momentarily catching my breath. Please try asking again in a moment!";

      if (isSaveItineraryIntent && preSavedItinerary) {
        errorResponse = `I've automatically saved your customized itinerary (**${preSavedItinerary.title}**) directly to your **My Goa** dashboard! 🌴 It is now safely stored under your Saved Itineraries.`;
      } else if (err?.message === 'MISSING_API_KEY') {
        errorResponse = "⚠️ Please set VITE_GEMINI_API_KEY in your environment variables to enable real-time GAI responses.";
      }

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: errorResponse,
        timestamp: format12HourTime(),
        executedAction: preSavedItinerary
          ? {
              type: 'saved_itinerary',
              title: 'Itinerary Saved to My Goa',
              subtitle: `Saved "${preSavedItinerary.title}" to your dashboard`,
              buttonText: 'Open My Goa',
              onButtonClick: () => {
                triggerHaptic(12);
                onNavigateScreen?.('my_goa', 'itineraries');
              },
            }
          : undefined,
      };
      setLatestBotMessageId(errorMsg.id);
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#F1F1F1] flex flex-col justify-between max-w-[430px] mx-auto select-none relative overflow-hidden font-sans">
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

      {/* Top Bar: Borderless iOS Header */}
      <header className="shrink-0 z-30 bg-[#F1F1F1]/80 backdrop-blur-2xl px-4 py-2.5 flex items-center justify-between">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onBack();
          }}
          className="w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.07] active:scale-95 flex items-center justify-center text-gray-800 transition-all cursor-pointer shadow-2xs"
          aria-label="Back to Homepage"
        >
          <svg
            className="w-5 h-5 text-gray-700"
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

        {/* Title & Subtitle (No green dot) */}
        <div className="flex flex-col items-center">
          <h1 className="text-[17px] font-bold text-gray-900 tracking-[-0.01em] leading-tight">
            GAI Assistant
          </h1>
          <span className="text-[11px] font-medium text-gray-500 leading-tight">
            Goa Travel Intelligence
          </span>
        </div>

        {/* Balance spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* Top Fading Gradient: Smooth sinking effect behind header */}
      <div className="pointer-events-none absolute top-[48px] left-0 right-0 h-6 bg-gradient-to-b from-[#F1F1F1] to-transparent z-20" />

      {/* Messages Feed */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-6 pb-6 space-y-4 min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Render Chat Messages */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex items-end justify-end gap-2 pl-8">
                {/* User Message Bubble: Ultra-Premium iOS iMessage Gradient */}
                <div className="flex flex-col items-end">
                  <div className="px-4.5 py-3 rounded-[22px] rounded-br-[4px] bg-gradient-to-b from-[#007AFF] to-[#0062E0] text-white shadow-[0_4px_16px_rgba(0,122,255,0.25)] max-w-[290px] space-y-2">
                    {/* User Attached Image Preview */}
                    {msg.imagePreview && (
                      <div className="rounded-[16px] overflow-hidden border border-white/20 max-h-48 w-full bg-black/10">
                        <img
                          src={msg.imagePreview}
                          alt="User attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {msg.content && (
                      <p className="text-[14.5px] font-normal text-white leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}
                  </div>
                  {/* Timestamp in 12h format */}
                  <div className="flex items-center gap-1 mt-1 pr-1">
                    <span className="text-[10.5px] text-gray-400 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center shrink-0 shadow-xs mb-3">
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

          // Assistant (GAI) Bubble: Frosted Pearl Glass Card with Soft Glow
          return (
            <div key={msg.id} className="flex items-start gap-2.5 pr-2">
              {/* Bot Avatar: Gradient Teal iOS Badge */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#177F91] to-[#25A7BD] text-white flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(23,127,145,0.28)] mt-0.5 font-bold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
                </svg>
              </div>

              {/* Bot Message Bubble with Animated Typewriter Effect */}
              <div className="flex flex-col items-start max-w-[325px] min-w-0 flex-1">
                <div className="px-4.5 py-3.5 rounded-[22px] rounded-tl-[4px] bg-white/95 backdrop-blur-xl border border-black/[0.04] shadow-[0_2px_14px_rgba(0,0,0,0.04)] text-gray-900 w-full">
                  <TypewriterFormattedMessage
                    msg={msg}
                    isLatestBot={msg.id === latestBotMessageId}
                    userCoords={{ lat: locationState.lat, lng: locationState.lng }}
                    onQuickAction={(prompt) => handleSendMessage(prompt)}
                    onScrollNeeded={scrollToBottom}
                  />
                </div>

                {/* Autonomous Executed Action Card: Soft Fading Gradient */}
                {msg.executedAction && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mt-2 w-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-[18px] p-3 shadow-xs flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-sm shrink-0 font-black shadow-xs">
                        ✓
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-1.5 py-0.5 rounded-md">
                            Done on your behalf
                          </span>
                        </div>
                        <div className="text-[12.5px] font-bold text-gray-900 truncate mt-0.5">
                          {msg.executedAction.title}
                        </div>
                        <div className="text-[11px] text-gray-600 font-medium truncate">
                          {msg.executedAction.subtitle}
                        </div>
                      </div>
                    </div>

                    {msg.executedAction.buttonText && (
                      <button
                        type="button"
                        onClick={msg.executedAction.onButtonClick}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white text-[11px] font-bold shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <span>{msg.executedAction.buttonText}</span>
                        <span>→</span>
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Footer Bar: 12h Timestamp + Action Buttons */}
                <div className="flex items-center justify-between w-full mt-1.5 px-1">
                  <span className="text-[10.5px] text-gray-400 font-medium">
                    {msg.timestamp}
                  </span>

                  <div className="flex items-center gap-1.5 text-gray-400">
                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className={`p-1 rounded-md hover:bg-black/[0.04] transition-all text-xs flex items-center gap-1 cursor-pointer ${
                        copiedId === msg.id ? 'text-[#007AFF] font-bold' : 'hover:text-gray-700'
                      }`}
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <span className="text-[10.5px]">✓ Copied</span>
                      ) : (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>

                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => handleShare(msg.content)}
                      className="p-1 rounded-md hover:bg-black/[0.04] hover:text-gray-700 transition-all text-xs cursor-pointer"
                      title="Share advice"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>

                    {/* Like Button */}
                    <button
                      type="button"
                      onClick={() => toggleLike(msg.id)}
                      className={`p-1 rounded-md hover:bg-black/[0.04] transition-all text-xs cursor-pointer ${
                        likedIds.includes(msg.id) ? 'text-[#007AFF] fill-[#007AFF]' : 'hover:text-gray-700'
                      }`}
                      title="Helpful"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={likedIds.includes(msg.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                    </button>

                    {/* Dislike Button */}
                    <button
                      type="button"
                      onClick={() => toggleDislike(msg.id)}
                      className={`p-1 rounded-md hover:bg-black/[0.04] transition-all text-xs cursor-pointer ${
                        dislikedIds.includes(msg.id) ? 'text-gray-800 fill-gray-800' : 'hover:text-gray-700'
                      }`}
                      title="Not helpful"
                    >
                      <svg className="w-3.5 h-3.5 rotate-180" viewBox="0 0 24 24" fill={dislikedIds.includes(msg.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator: Sleek Frosted Glass 3-Dot Pill */}
        {isLoading && (
          <div className="flex items-start gap-2.5 pr-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#177F91] to-[#25A7BD] text-white flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(23,127,145,0.28)]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-[20px] rounded-tl-[4px] bg-white/95 backdrop-blur-md border border-black/[0.04] shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-[#007AFF] animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[#007AFF] animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </div>

      {/* Bottom Fading Gradient: Smooth sinking effect above suggestions dock */}
      <div className="pointer-events-none absolute bottom-[108px] left-0 right-0 h-10 bg-gradient-to-t from-[#F1F1F1] via-[#F1F1F1]/85 to-transparent z-20" />

      {/* Bottom Bar: Floating Borderless iOS Glass Dock */}
      <div className="shrink-0 z-30 bg-[#F1F1F1]/85 backdrop-blur-2xl pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] px-4 space-y-2">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {QUICK_PROMPTS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                triggerHaptic(12);
                handleSendMessage(chip.prompt);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/[0.04] shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:bg-white hover:border-black/10 active:scale-95 transition-all text-xs font-semibold text-gray-800 whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* File / General Error Banner */}
        {errorMessage && (
          <div className="text-[11px] text-rose-600 font-medium bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-center">
            {errorMessage}
          </div>
        )}

        {/* Attached Image Thumbnail Bar */}
        <AnimatePresence>
          {attachedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-[20px] border border-black/[0.06] shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-12 h-12 rounded-[14px] overflow-hidden border border-black/[0.06] shrink-0 bg-gray-100">
                  <img
                    src={attachedImage.dataUrl}
                    alt="Attachment thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">Photo Attached</div>
                  <div className="text-[11px] text-gray-500 font-medium">Ready for GAI analysis</div>
                </div>
              </div>

              {/* Remove Attachment Button */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  setAttachedImage(null);
                }}
                className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-rose-100 hover:text-rose-600 text-gray-500 flex items-center justify-center text-xs font-bold transition-all cursor-pointer shrink-0"
                title="Remove photo"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Input Pill Container */}
          <div className="flex-1 rounded-full bg-black/[0.04] focus-within:bg-white border border-black/[0.04] focus-within:border-[#007AFF]/40 focus-within:ring-2 focus-within:ring-[#007AFF]/15 px-3.5 py-1.5 flex items-center gap-2 transition-all shadow-inner-xs">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(12);
                setIsAttachmentSheetOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.09] text-gray-700 flex items-center justify-center shrink-0 transition-all cursor-pointer"
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
                attachedImage
                  ? 'Ask about this photo...'
                  : 'Ask GAI anything about Goa...'
              }
              className="w-full bg-transparent text-[14.5px] font-normal text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-[0_0_16px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-black/[0.04] hover:bg-black/[0.07] text-gray-700'
            }`}
            title={isListening ? 'Stop listening' : 'Voice typing'}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <svg
              className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`}
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

          {/* Send Button: Signature iOS Blue */}
          <button
            type="submit"
            disabled={(!input.trim() && !attachedImage) || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs transition-all ${
              (input.trim() || attachedImage) && !isLoading
                ? 'bg-gradient-to-b from-[#007AFF] to-[#0062E0] shadow-[0_2px_10px_rgba(0,122,255,0.35)] active:scale-95 cursor-pointer'
                : 'bg-black/[0.06] text-gray-400 cursor-not-allowed shadow-none'
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

      {/* ATTACHMENT OPTIONS BOTTOM SHEET: iOS Sheet Style */}
      <AnimatePresence>
        {isAttachmentSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                triggerHaptic(10);
                setIsAttachmentSheetOpen(false);
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Bottom Sheet Menu */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="w-full max-w-[430px] bg-white/95 backdrop-blur-2xl rounded-t-[30px] sm:rounded-[26px] p-5 shadow-2xl relative z-10 space-y-4 border-t border-black/[0.04]"
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />

              <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Attach Photo for GAI</h3>
                  <p className="text-xs text-gray-500">Analyze menus, beach landmarks, or maps</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setIsAttachmentSheetOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-black/[0.05] text-gray-500 font-bold flex items-center justify-center text-xs cursor-pointer hover:bg-black/[0.08]"
                >
                  ✕
                </button>
              </div>

              {/* Action Buttons: Camera & Upload */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* 1. Camera Option */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(12);
                    cameraInputRef.current?.click();
                  }}
                  className="p-4 rounded-[20px] bg-gradient-to-b from-sky-50 to-blue-50/60 border border-sky-100 hover:brightness-98 active:scale-98 transition-all flex flex-col items-center gap-2 text-center cursor-pointer shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#007AFF] to-[#0062E0] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,122,255,0.3)]">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 1-2 2v9a2 2 0 0 1 2 2h16a2 2 0 0 1 2-2V9a2 2 0 0 1-2-2h-3l-2.5-3z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Take Photo</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">Use device camera</div>
                  </div>
                </button>

                {/* 2. Gallery Upload Option */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(12);
                    galleryInputRef.current?.click();
                  }}
                  className="p-4 rounded-[20px] bg-gradient-to-b from-gray-50 to-slate-50 border border-gray-100 hover:brightness-98 active:scale-98 transition-all flex flex-col items-center gap-2 text-center cursor-pointer shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-b from-gray-800 to-gray-900 text-white flex items-center justify-center shadow-xs">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Upload Photo</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">Choose from gallery</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-4.5 py-2.5 rounded-full bg-gray-900/90 backdrop-blur-xl text-white text-xs font-bold shadow-2xl border border-white/10 flex items-center gap-2 select-none"
          >
            <span className="text-sm">🌴</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
