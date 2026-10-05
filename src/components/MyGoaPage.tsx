import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences, SavedPlaceItem, SavedItineraryItem } from '../types/onboarding';

interface MyGoaPageProps {
  preferences: UserPreferences;
  savedPlaces: SavedPlaceItem[];
  savedItineraries: SavedItineraryItem[];
  onBack: () => void;
  onEditPreferences: () => void;
  onAskGAI: (initialPrompt?: string) => void;
  onRemoveSavedPlace: (id: string) => void;
  onRemoveItinerary: (id: string) => void;
  initialTab?: 'itineraries' | 'saved_places';
}

/** Helper to render inline markdown: **bold**, *italic*, and `code` */
function renderInlineMarkdown(text: string): React.ReactNode {
  const boldParts = text.split(/(\*\*.*?\*\*)/g);

  return boldParts.map((bPart, bIdx) => {
    if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length >= 4) {
      const inner = bPart.slice(2, -2);
      return (
        <strong key={`b-${bIdx}`} className="font-extrabold text-gray-900">
          {renderItalicAndCode(inner, bIdx)}
        </strong>
      );
    }
    return <React.Fragment key={`nb-${bIdx}`}>{renderItalicAndCode(bPart, bIdx)}</React.Fragment>;
  });
}

function renderItalicAndCode(text: string, parentKey: number | string): React.ReactNode {
  const codeParts = text.split(/(`.*?`)/g);
  return codeParts.map((cPart, cIdx) => {
    if (cPart.startsWith('`') && cPart.endsWith('`') && cPart.length >= 2) {
      return (
        <code key={`c-${parentKey}-${cIdx}`} className="px-1 py-0.5 rounded bg-gray-200/80 text-[11px] font-mono text-gray-800">
          {cPart.slice(1, -1)}
        </code>
      );
    }
    const italicParts = cPart.split(/(\*.*?\*)/g);
    return italicParts.map((iPart, iIdx) => {
      if (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length >= 2) {
        return (
          <em key={`i-${parentKey}-${cIdx}-${iIdx}`} className="italic text-gray-800">
            {iPart.slice(1, -1)}
          </em>
        );
      }
      return iPart;
    });
  });
}

/** Parses markdown tables into clean styled cards */
function renderMarkdownTable(tableLines: string[]): React.ReactNode {
  if (tableLines.length === 0) return null;
  const dataLines = tableLines.filter((line) => !line.match(/^\|?\s*:?-+:?\s*(\||\+)/));
  if (dataLines.length === 0) return null;

  const splitCells = (line: string) => {
    const trimmed = line.replace(/^\||\|$/g, '').trim();
    return trimmed.split('|').map((c) => c.trim());
  };

  const headerCells = splitCells(dataLines[0]);
  const rowLines = dataLines.slice(1);

  return (
    <div className="my-2.5 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
      <table className="w-full text-left text-[11.5px] border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
          <tr>
            {headerCells.map((h, i) => (
              <th key={i} className="px-2.5 py-1.5 whitespace-nowrap">
                {renderInlineMarkdown(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rowLines.map((row, rIdx) => {
            const cells = splitCells(row);
            return (
              <tr key={rIdx} className="hover:bg-gray-50/50">
                {cells.map((cell, cIdx) => (
                  <td key={cIdx} className="px-2.5 py-1.5 text-gray-700">
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Complete Markdown Itinerary Renderer */
function ItineraryMarkdownContent({ content, isExpanded }: { content: string; isExpanded: boolean }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentBullets: string[] = [];
  let currentTableLines: string[] = [];

  const flushBullets = (key: string) => {
    if (currentBullets.length > 0) {
      elements.push(
        <ul key={key} className="my-2 space-y-1.5 pl-1">
          {currentBullets.map((b, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#177F91] mt-1.5 shrink-0" />
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
      const table = renderMarkdownTable(currentTableLines);
      if (table) elements.push(<React.Fragment key={key}>{table}</React.Fragment>);
      currentTableLines = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    // Tables
    if (line.includes('|')) {
      flushBullets(`b-tbl-${index}`);
      currentTableLines.push(line);
      return;
    } else {
      flushTable(`tbl-${index}`);
    }

    if (!line) {
      flushBullets(`b-empty-${index}`);
      return;
    }

    // Horizontal Rule
    if (/^[-*_]{3,}$/.test(line)) {
      flushBullets(`b-hr-${index}`);
      elements.push(<hr key={`hr-${index}`} className="my-3 border-gray-200" />);
      return;
    }

    // Bullets
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      currentBullets.push(line.replace(/^[-*•]\s+/, ''));
      return;
    }

    // Numbered Lists
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      flushBullets(`b-num-${index}`);
      elements.push(
        <div key={`num-${index}`} className="flex items-start gap-2 my-1 text-[12.5px] leading-relaxed text-gray-800">
          <span className="font-bold text-[#FF6B4A] text-xs shrink-0 mt-0.5">
            {numMatch[1]}.
          </span>
          <span className="text-gray-800">{renderInlineMarkdown(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Blockquotes / Tips (> Tip: ...)
    if (line.startsWith('>')) {
      flushBullets(`b-quote-${index}`);
      const quoteText = line.replace(/^>\s*/, '');
      elements.push(
        <div key={`quote-${index}`} className="my-2 p-2.5 bg-[#FFF7ED] rounded-xl border border-[#FFEDD5] text-[12px] text-[#9A3412] font-medium flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="leading-snug">{renderInlineMarkdown(quoteText)}</span>
        </div>
      );
      return;
    }

    // Headings: H1, H2, H3, H4
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushBullets(`b-head-${index}`);
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];

      const dayMatch = headingText.match(/^(Day\s+\d+)\s*[:|-]?\s*(.*)$/i);
      if (dayMatch) {
        elements.push(
          <div key={`day-${index}`} className="mt-3.5 mb-2 pt-2 border-t border-gray-200/80 first:border-0 first:pt-0 first:mt-0 flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#177F91] text-white text-[11px] font-black tracking-wide uppercase shadow-2xs">
              {dayMatch[1]}
            </span>
            {dayMatch[2] && (
              <span className="text-[13.5px] font-extrabold text-gray-900 tracking-tight">
                {renderInlineMarkdown(dayMatch[2])}
              </span>
            )}
          </div>
        );
        return;
      }

      if (level === 1) {
        elements.push(
          <h2 key={`h1-${index}`} className="text-[16px] font-black text-gray-900 mt-3 mb-1.5 leading-snug">
            {renderInlineMarkdown(headingText)}
          </h2>
        );
        return;
      }

      if (level === 2) {
        elements.push(
          <h3 key={`h2-${index}`} className="text-[14.5px] font-extrabold text-gray-900 mt-2.5 mb-1 leading-snug">
            {renderInlineMarkdown(headingText)}
          </h3>
        );
        return;
      }

      if (level === 3) {
        elements.push(
          <h4 key={`h3-${index}`} className="text-[13.5px] font-bold text-gray-900 mt-2 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-3 rounded-full bg-[#FF6B4A]" />
            <span>{renderInlineMarkdown(headingText)}</span>
          </h4>
        );
        return;
      }

      elements.push(
        <h5 key={`h4-${index}`} className="text-[12.5px] font-bold text-gray-800 mt-1.5 mb-0.5">
          {renderInlineMarkdown(headingText)}
        </h5>
      );
      return;
    }

    // Standard Paragraph
    flushBullets(`b-p-${index}`);
    elements.push(
      <p key={`p-${index}`} className="text-[12.5px] leading-relaxed text-gray-700 font-medium mb-1.5 last:mb-0">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  flushBullets('b-final');
  flushTable('tbl-final');

  return (
    <div className={`space-y-1 relative ${!isExpanded ? 'max-h-48 overflow-hidden' : 'max-h-[500px] overflow-y-auto pr-1'}`}>
      {elements}
      {!isExpanded && (
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent pointer-events-none" />
      )}
    </div>
  );
}

export const MyGoaPage: React.FC<MyGoaPageProps> = ({
  preferences,
  savedPlaces,
  savedItineraries,
  onBack,
  onEditPreferences,
  onAskGAI,
  onRemoveSavedPlace,
  onRemoveItinerary,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'itineraries' | 'saved_places'>(initialTab || 'itineraries');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<'all' | 'destination' | 'stay' | 'food' | 'culture' | 'coupon'>('all');
  const [expandedItineraryId, setExpandedItineraryId] = useState<string | null>(null);

  const filteredPlaces = savedPlaces.filter((p) =>
    placeCategoryFilter === 'all' ? true : p.category === placeCategoryFilter
  );

  const getCategoryBadge = (cat: SavedPlaceItem['category']) => {
    switch (cat) {
      case 'destination':
        return {
          label: 'Landmark',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          ),
          bg: 'bg-[#E0F2FE]',
          text: 'text-[#0284C7]',
        };
      case 'stay':
        return {
          label: 'Stay',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M9 3h6v4H9z" />
            </svg>
          ),
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#D97706]',
        };
      case 'food':
        return {
          label: 'Food',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2v20M6 2v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2M9 11v11" />
            </svg>
          ),
          bg: 'bg-[#DCFCE7]',
          text: 'text-[#15803D]',
        };
      case 'culture':
        return {
          label: 'Culture',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.999 5.75 17.5 2 12 2z" />
            </svg>
          ),
          bg: 'bg-[#F3E8FF]',
          text: 'text-[#9333EA]',
        };
      case 'coupon':
        return {
          label: 'Coupon',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          ),
          bg: 'bg-[#FFEAE5]',
          text: 'text-[#FF6B4A]',
        };
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F7F7F5] select-none overflow-hidden">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 px-5 pt-4 pb-3 bg-[#F7F7F5]/90 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              aria-label="Go back"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 12L6 8l4-4" />
              </svg>
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#FF6B4A] tracking-wider uppercase">
                PERSONAL DASHBOARD
              </span>
              <h1 className="text-[19px] font-extrabold text-gray-900 tracking-tight leading-none mt-0.5">
                My Goa
              </h1>
            </div>
          </div>

          {/* Brand wordmark badge */}
          <div className="flex items-center tracking-[0.2em] text-[11px] font-black text-[#111111]">
            <span>G</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#177F91] mx-0.5 inline-block" />
            <span>AMITRA</span>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 min-h-0">
        <div className="max-w-5xl mx-auto space-y-4 w-full">
        {/* Personalized Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-[#177F91] via-[#105E6D] to-[#0A434F] text-white shadow-xl"
        >
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide uppercase text-white/90">
                My Goa Hub
              </span>
              <h2 className="text-2xl font-black tracking-tight mt-2.5">
                Hello, {preferences.name || 'Explorer'}!
              </h2>
              <p className="text-xs text-white/80 mt-1 leading-relaxed max-w-[260px]">
                Your saved itineraries, liked places, and trip preferences all in one place.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Trip Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A]" />
              Trip Preferences
            </h3>
            <button
              type="button"
              onClick={onEditPreferences}
              className="text-xs font-bold text-[#FF6B4A] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                TRAVEL MONTH
              </span>
              <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                {preferences.travelMonth || 'Not set'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                PARTY SIZE
              </span>
              <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                {preferences.memberCount} {preferences.memberCount === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              PRIMARY INTERESTS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(preferences.tourismTypes || []).map((type) => (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-xl bg-[#FFEAE5] text-[#FF6B4A] text-xs font-bold"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Saved Content Section: Tab Navigation */}
        <div className="pt-2">
          <div className="flex items-center gap-2 p-1 bg-gray-200/70 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('itineraries')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'itineraries'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#FF6B4A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              <span>My Itineraries</span>
              <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-black text-gray-600">
                {savedItineraries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved_places')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'saved_places'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>Liked Places</span>
              <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-black text-gray-600">
                {savedPlaces.length}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: SAVED ITINERARIES */}
        {activeTab === 'itineraries' && (
          <div className="space-y-3">
            {savedItineraries.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-gray-200/80 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FFEAE5] text-[#FF6B4A] flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">No saved itineraries yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-[260px] mx-auto">
                    Ask GAI to prepare a custom trip plan and click "Add to My Goa Itinerary" to save it here!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAskGAI(`Prepare a complete 3-day itinerary for my trip to Goa in ${preferences.travelMonth || 'this month'}.`)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                  </svg>
                  <span>Ask GAI to Prepare Itinerary</span>
                </button>
              </div>
            ) : (
              savedItineraries.map((itinerary) => {
                const isExpanded = expandedItineraryId === itinerary.id;
                return (
                  <motion.div
                    key={itinerary.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-[#FFEAE5] text-[#FF6B4A] text-[10px] font-extrabold uppercase tracking-wider">
                          {itinerary.season || 'Goa Plan'}
                        </span>
                        <h3 className="text-base font-extrabold text-gray-900 tracking-tight mt-1">
                          {itinerary.title}
                        </h3>
                        <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                          Saved on {itinerary.timestamp}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItinerary(itinerary.id)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete itinerary"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Formatted Markdown Itinerary Content */}
                    <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-gray-100">
                      <ItineraryMarkdownContent content={itinerary.content} isExpanded={isExpanded} />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedItineraryId(isExpanded ? null : itinerary.id)}
                        className="text-xs font-bold text-[#177F91] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Show less' : 'Read full itinerary'}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => onAskGAI(`Can you customize my itinerary "${itinerary.title}"? Here is what I want to modify...`)}
                        className="text-xs font-bold text-[#FF6B4A] hover:underline cursor-pointer ml-auto flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-[#FF6B4A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                        </svg>
                        <span>Modify with GAI</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: LIKED & SAVED PLACES */}
        {activeTab === 'saved_places' && (
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(['all', 'destination', 'stay', 'food', 'culture', 'coupon'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPlaceCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer capitalize ${
                    placeCategoryFilter === cat
                      ? 'bg-[#177F91] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat === 'all' ? 'All Saved' : cat}
                </button>
              ))}
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-gray-200/80 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">No saved places in this category</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-[260px] mx-auto">
                    Heart or bookmark landmarks, stays, food spots, cultural events, or coupons across the app to see them here!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredPlaces.map((place) => {
                  const badge = getCategoryBadge(place.category);
                  return (
                    <motion.div
                      key={place.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {place.image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                            <img
                              src={place.image}
                              alt={place.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-xl ${badge.bg} ${badge.text} flex items-center justify-center text-xl shrink-0 font-bold`}>
                            {badge.icon}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md ${badge.bg} ${badge.text} text-[10px] font-black uppercase tracking-wider`}>
                              {badge.label}
                            </span>
                            {place.ratingOrPrice && (
                              <span className="text-[11px] font-semibold text-gray-500 truncate">
                                · {place.ratingOrPrice}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-extrabold text-gray-900 truncate mt-0.5">
                            {place.title}
                          </h4>

                          {place.location && (
                            <p className="text-xs text-gray-500 truncate font-medium mt-0.5 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{place.location}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onAskGAI(`Tell me details and how to visit ${place.title} in Goa.`)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#FFEAE5] hover:text-[#FF6B4A] text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Ask GAI about this place"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveSavedPlace(place.id)}
                          className="w-8 h-8 rounded-full hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <svg className="w-4 h-4 text-red-500 fill-red-500" viewBox="0 0 24 24">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
