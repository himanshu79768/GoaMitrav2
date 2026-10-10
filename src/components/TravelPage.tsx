import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DestinationItem } from './DestinationsPage';
import { UserPreferences } from '../types/onboarding';

interface TravelPageProps {
  destination: DestinationItem;
  preferences: UserPreferences;
  onBack: () => void;
  onAskGAI: (initialPrompt?: string) => void;
}

export const TravelPage: React.FC<TravelPageProps> = ({
  destination,
  preferences,
  onBack,
  onAskGAI,
}) => {
  const [userLocality, setUserLocality] = useState<string>('Calangute, North Goa');

  // Retrieve user location
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('goamitra_accurate_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.placeName) {
          setUserLocality(parsed.placeName.split('(')[0].trim() || 'North Goa');
        }
      }
    } catch {}
  }, []);

  const km = destination.distanceKm || 12;

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between select-none relative overflow-hidden w-full font-sans">
      {/* 1. Pinned Sticky Top Navigation Bar */}
      <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        {/* Back Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Back to Destinations"
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
        </motion.button>

        {/* Title */}
        <div className="flex flex-col items-center max-w-[220px]">
          <h1 className="text-[17px] font-black text-[#111111] tracking-tight leading-tight truncate">
            {destination.name}
          </h1>
          <span className="text-[11px] font-medium text-gray-500 leading-tight">
            Destination Details & Location
          </span>
        </div>

        {/* Right Balance Spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Scrollable Body Container */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3.5 pb-10 space-y-4 min-h-0 overscroll-contain touch-pan-y no-scrollbar max-w-2xl mx-auto w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Hero Banner with Destination Photography */}
        <div className="relative rounded-[26px] overflow-hidden shadow-md min-h-[220px] sm:min-h-[250px] flex items-end p-5 bg-gray-900">
          <img
            src={destination.image}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Hero Copy */}
          <div className="relative z-10 text-white w-full">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white shadow-xs">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>~{km} km from {userLocality}</span>
              </span>

              {destination.matchBadge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#059669] text-white text-[11px] font-bold shadow-xs">
                  <span>★ {destination.matchBadge}</span>
                </span>
              )}
            </div>

            <h2 className="text-[24px] sm:text-[26px] font-black tracking-tight leading-tight drop-shadow-sm">
              {destination.name}
            </h2>

            <p className="text-[13px] text-white/90 font-medium mt-1 drop-shadow-xs flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#A7F3D0] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>{destination.location}</span>
            </p>
          </div>
        </div>

        {/* 1. LOCATION & DIRECTIONS CARD */}
        <div className="bg-white rounded-3xl p-4.5 border border-gray-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#059669]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>Location & Proximity</span>
            </span>
            <span className="text-[11px] font-bold text-[#059669] bg-[#EAF5EE] px-2 py-0.5 rounded-full">
              GPS Verified
            </span>
          </div>

          {/* Address row */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-[#E05333] shrink-0 shadow-2xs">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-gray-900 leading-snug">
                {destination.location}
              </div>
              <div className="text-[11.5px] text-gray-500 mt-0.5">
                Exact geographic coordinates mapped in Goa
              </div>
            </div>
          </div>

          {/* Distance from Key Goa Hubs */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-[#F7F7F5] border border-gray-200/60 text-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                From Panaji
              </div>
              <div className="text-[14px] font-black text-gray-900 mt-0.5">
                {destination.minutesFromPanaji} min
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#F7F7F5] border border-gray-200/60 text-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                North Coast
              </div>
              <div className="text-[14px] font-black text-gray-900 mt-0.5">
                {destination.minutesFromNorthGoa} min
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#F7F7F5] border border-gray-200/60 text-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                South Goa
              </div>
              <div className="text-[14px] font-black text-gray-900 mt-0.5">
                {destination.minutesFromSouthGoa} min
              </div>
            </div>
          </div>

          {/* Nearest Transit & Bus Stand Context */}
          {destination.nearestBusStand && (
            <div className="p-3 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] text-xs text-[#166534] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[12.5px]">
                <svg className="w-3.5 h-3.5 text-[#16A34A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="15" rx="2" />
                  <path d="M4 11h16M8 18v2M16 18v2M8 7h.01M16 7h.01" />
                </svg>
                <span>Nearest Transit: {destination.nearestBusStand}</span>
              </div>
              {destination.busRoute && (
                <div className="text-[11.5px] text-[#15803D] pl-5 leading-relaxed">
                  Route: {destination.busRoute}
                </div>
              )}
            </div>
          )}

          {/* Open in Google Maps Button */}
          <motion.a
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${destination.name}, ${destination.location}, Goa`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-gray-900 hover:bg-black text-white text-center font-bold text-[13.5px] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4 text-[#FF6B4A]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span>Open Location in Google Maps</span>
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </motion.a>
        </div>

        {/* 2. DESTINATION INFORMATION CARD */}
        <div className="bg-white rounded-3xl p-4.5 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#177F91]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Destination Information</span>
            </span>
            <span className="text-[11px] font-bold text-[#177F91] bg-[#EAF5F7] px-2 py-0.5 rounded-full">
              {destination.tourismType}
            </span>
          </div>

          {/* Description */}
          <p className="text-[14px] text-gray-700 leading-relaxed font-normal">
            {destination.description}
          </p>

          {/* Key Visiting Specifications */}
          <div className="space-y-2.5 text-xs">
            {/* Visiting Hours */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-2 border-t border-gray-100">
              <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Visiting Hours: </span>
                <span>{destination.timings}</span>
              </div>
            </div>

            {/* Entry Tickets */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-2 border-t border-gray-100">
              <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2M13 17v2M13 11v2" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Entry Fee: </span>
                <span>{destination.entryFee}</span>
              </div>
            </div>

            {/* Photography Rules */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-2 border-t border-gray-100">
              <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Photography & Drones: </span>
                <span>{destination.photographyRules}</span>
              </div>
            </div>

            {/* Best Time to Visit */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-2 border-t border-gray-100">
              <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Best Time: </span>
                <span>{destination.bestTime}</span>
              </div>
            </div>
          </div>

          {/* Insider Tip Box */}
          <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2.5">
            <svg className="w-4.5 h-4.5 text-[#D97706] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6M10 22h4" />
            </svg>
            <div>
              <span className="font-bold text-[#78350F]">Local Insider Tip: </span>
              <span className="leading-relaxed">{destination.insiderTip}</span>
            </div>
          </div>

          {/* Warning Note if exists */}
          {destination.warningNote && (
            <div className="p-3 bg-[#FEF2F2] rounded-2xl border border-[#FECACA] text-xs text-[#991B1B] flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <span className="font-bold">Traveler Advisory: </span>
                <span>{destination.warningNote}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {destination.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Ask GAI Button */}
          <div className="pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                onAskGAI(
                  `Tell me everything about visiting ${destination.name} in Goa: historical background, best spots for photos, what to carry, and nearby hidden gems to explore.`
                )
              }
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#177F91] to-[#0E5865] text-white text-center font-bold text-[13.5px] shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
              </svg>
              <span>Ask GAI about {destination.name}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
