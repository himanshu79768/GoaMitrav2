import React, { useState, useEffect } from 'react';
import { DestinationItem } from './DestinationsPage';
import { UserPreferences } from '../types/onboarding';

export const TRAVEL_VEHICLE_IMAGES = {
  auto: 'https://i.ibb.co/0p7d3m6N/auto-rickshaw-left-transparent.png',
  scooter: 'https://i.ibb.co/99Vw95mx/scooter-left-transparent.png',
  taxi: 'https://i.ibb.co/gLxZ4kt4/taxi-left-transparent.png',
  bus: 'https://i.ibb.co/rKVDJxnf/bus-left-transparent.png',
};

interface TravelPageProps {
  destination: DestinationItem;
  preferences: UserPreferences;
  onBack: () => void;
  onAskGAI: (initialPrompt?: string) => void;
}

const TRANSPORT_FILTERS = [
  {
    id: 'all',
    label: 'All',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
      </svg>
    ),
  },
  {
    id: 'cab',
    label: 'Cab',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
  {
    id: 'auto',
    label: 'Auto',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 16h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2-3H8L6 7H3a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2" />
        <circle cx="6" cy="17" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'scooter',
    label: 'Scooter',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="17" r="3" />
        <circle cx="18" cy="17" r="3" />
        <path d="M6 14h6l3-6h4" />
      </svg>
    ),
  },
  {
    id: 'bus',
    label: 'Bus',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="15" rx="2" />
        <path d="M4 11h16M8 18v2M16 18v2M8 7h.01M16 7h.01" />
      </svg>
    ),
  },
];

/** Determines the nearest bus stand to the USER based on GPS locality */
function getUserNearestBusStand(userLocality: string, lat?: number) {
  const loc = (userLocality || '').toLowerCase();

  if (
    loc.includes('mapusa') ||
    loc.includes('moira') ||
    loc.includes('aldona') ||
    loc.includes('guirim') ||
    loc.includes('porvorim') ||
    loc.includes('parra')
  ) {
    return {
      standName: 'Mapusa KTC Bus Terminus',
      distanceToUser: '4–7 mins from your location',
      busPlatform: 'Bay 2 & 3 (Direct connecting routes)',
    };
  }

  if (loc.includes('calangute') || loc.includes('baga') || loc.includes('arpora')) {
    return {
      standName: 'Calangute Bus Stand (Calangute Circle)',
      distanceToUser: '3–6 mins from your location',
      busPlatform: 'Main Stand (Buses to Panaji & Mapusa)',
    };
  }

  if (loc.includes('candolim') || loc.includes('sinquerim')) {
    return {
      standName: 'Candolim Bus Stop (Fort Aguada Road)',
      distanceToUser: '3–5 mins from your location',
      busPlatform: 'Main Road Sheltered Bay',
    };
  }

  if (
    loc.includes('panaji') ||
    loc.includes('panjim') ||
    loc.includes('miramar') ||
    loc.includes('fontainhas') ||
    loc.includes('ribandar')
  ) {
    return {
      standName: 'Panaji KTC Main Bus Terminus',
      distanceToUser: '5 mins from your location',
      busPlatform: 'Inter-city Express Platform',
    };
  }

  if (
    loc.includes('margao') ||
    loc.includes('madgaon') ||
    loc.includes('colva') ||
    loc.includes('benaulim')
  ) {
    return {
      standName: 'Margao KTC Central Bus Stand',
      distanceToUser: '6–8 mins from your location',
      busPlatform: 'Central Express Bay',
    };
  }

  if (loc.includes('vasco')) {
    return {
      standName: 'Vasco KTC Bus Stand',
      distanceToUser: '5 mins from your location',
      busPlatform: 'Highway Link Bay',
    };
  }

  if (lat && lat < 15.35) {
    return {
      standName: 'Margao KTC Central Bus Stand',
      distanceToUser: 'approx. 8–10 mins from your location',
      busPlatform: 'Regional Bay',
    };
  }

  // North Goa default
  return {
    standName: 'Mapusa KTC Bus Terminus',
    distanceToUser: 'approx. 6–8 mins from your location',
    busPlatform: 'Connecting Regional Bay',
  };
}

export const TravelPage: React.FC<TravelPageProps> = ({
  destination,
  preferences,
  onBack,
  onAskGAI,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [userLocality, setUserLocality] = useState<string>('Mapusa, North Goa');
  const [userLat, setUserLat] = useState<number | undefined>();

  // Retrieve user's real GPS locality from session storage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('goamitra_accurate_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.placeName) {
          setUserLocality(parsed.placeName.split('(')[0].trim() || 'North Goa');
        }
        if (parsed.lat) {
          setUserLat(parsed.lat);
        }
      }
    } catch {}
  }, []);

  const nearestBusStandToUser = getUserNearestBusStand(userLocality, userLat);

  // Dynamic fare calculations based on destination distance
  const km = destination.distanceKm || 12;
  const autoFare = Math.max(180, Math.round(100 + km * 14));
  const cabMin = Math.max(380, Math.round(220 + km * 22));
  const cabMax = Math.round(cabMin * 1.3);
  const busFare = Math.min(50, Math.max(15, Math.round(km * 1.2)));

  // Estimated driving times
  const autoMinutes = Math.round(km * 2.2);
  const scooterMinutes = Math.round(km * 1.9);
  const cabMinutes = Math.round(km * 1.8);
  const busMinutes = Math.round(km * 2.8 + 12);

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between select-none relative overflow-hidden w-full">
      {/* 1. 100% Pinned Sticky Top Navigation Bar */}
      <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 sm:px-6 lg:px-10 xl:px-14 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="w-full flex items-center justify-between">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
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
          </button>

          {/* Title */}
          <div className="flex flex-col items-center">
            <h1 className="text-[19px] font-black text-[#111111] tracking-tight leading-tight">
              Travel
            </h1>
            <span className="text-[11px] font-medium text-gray-500 leading-tight truncate max-w-[200px]">
              To {destination.name}
            </span>
          </div>

          {/* Right Balance Spacer */}
          <div className="w-9 h-9" />
        </div>
      </header>

      {/* 2. Scrollable Body Container (Header stays 100% fixed) */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 xl:px-14 pt-3 pb-8 min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="w-full max-w-5xl mx-auto space-y-4">
        {/* HERO CARD: Features the selected destination itself */}
        <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[185px] flex items-end p-5">
          {/* Real Photo of Target Destination */}
          <img
            src={destination.image}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Hero Copy with Destination Name & Distance */}
          <div className="relative z-10 text-white w-full">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white mb-1.5">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Destination · ~{km} km away</span>
            </div>
            <h2 className="text-[23px] font-black tracking-tight leading-tight drop-shadow-sm">
              {destination.name}
            </h2>
            <div className="flex items-center justify-between mt-1 text-white/90 text-[12.5px] font-medium">
              <span>{destination.location}</span>
              <span className="text-[11.5px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                From {userLocality}
              </span>
            </div>
          </div>
        </div>

        {/* RULES & ESSENTIAL DETAILS (Directly starts with rules and options) */}
        <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs space-y-3">
          <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Essential Visiting Info</span>
            <span className="text-[#177F91] font-bold">Verified</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Timings */}
            <div className="flex items-start gap-2.5 text-gray-700">
              <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Visiting Hours: </span>
                <span>{destination.timings}</span>
              </div>
            </div>

            {/* Photography Rules */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-1.5 border-t border-gray-100">
              <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Photography & Drones: </span>
                <span>{destination.photographyRules}</span>
              </div>
            </div>

            {/* Entry Tickets */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-1.5 border-t border-gray-100">
              <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2M13 17v2M13 11v2" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Entry Tickets: </span>
                <span>{destination.entryFee}</span>
              </div>
            </div>

            {/* Best Time & Insider Tip */}
            <div className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
              <svg className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6M10 22h4" />
              </svg>
              <div>
                <span className="font-bold">Insider Tip: </span>
                <span>{destination.insiderTip}</span>
              </div>
            </div>

            {/* Map Link & GAI Route Advice */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${destination.name}, Goa`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all"
              >
                <svg className="w-3.5 h-3.5 text-[#E05333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>View on Maps</span>
                <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>

              <button
                type="button"
                onClick={() =>
                  onAskGAI(
                    `How should I travel to ${destination.name} from my location (${userLocality})? Give me best scooter/cab routes and local tips.`
                  )
                }
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#177F91] to-[#0E5865] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
                <span>Ask GAI Advice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transportation Filter Pills (Cab, Auto, Scooter, Bus) */}
        <div>
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Travel Options ({km} km)
            </span>
            <span className="text-xs font-medium text-gray-400">
              Live estimate
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {TRANSPORT_FILTERS.map((f) => {
              const isSelected = selectedFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-bold border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'border-[#177F91] bg-[#EAF5F7] text-[#177F91] shadow-xs'
                      : 'border-gray-200/90 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- TRANSPORT OPTION CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 1. AUTO RICKSHAW CARD (WITH REAL AUTO PHOTO) */}
          {(selectedFilter === 'all' || selectedFilter === 'auto') && (
            <div className="bg-white rounded-3xl p-4 border border-[#BAE6FD] shadow-[0_2px_12px_rgba(2,132,199,0.06)] space-y-3">
              {/* Top Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">
                  <svg className="w-3 h-3 text-[#0284C7]" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Best for you</span>
                </span>
              </div>

              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Auto Rickshaw Left-Facing Cutout */}
                <div className="w-16 h-16 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-center p-1.5 shadow-2xs shrink-0 overflow-hidden">
                  <img
                    src="https://i.ibb.co/0p7d3m6N/auto-rickshaw-left-transparent.png"
                    alt="Auto Rickshaw in Goa"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-extrabold text-gray-900 tracking-tight leading-tight">
                    Auto Rikshaw
                  </h3>
                  <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                    Ideal for short distances and budget travel.
                  </p>
                </div>

                {/* Time & Fare Pill on Right */}
                <div className="flex flex-col items-end shrink-0 gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{autoMinutes} min</span>
                  </div>
                  <div className="text-[18px] font-black text-[#FF5436] bg-[#FFF0EC] px-3 py-0.5 rounded-full">
                    ₹{autoFare}
                  </div>
                </div>
              </div>

              {/* Pink Rikshaw Highlight Pill */}
              <div className="p-2.5 bg-[#FFF1F2] rounded-xl border border-[#FFE4E6] flex items-center gap-2 text-xs font-semibold text-[#BE123C]">
                <svg className="w-4 h-4 text-[#BE123C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Pink Rikshaw (women-only) available at same fare.</span>
              </div>

              {/* Footer Specs Row */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Safe & reliable</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Available 24×7</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Widely available</span>
                </span>
              </div>
            </div>
          )}

          {/* 2. RENT A SCOOTER CARD (WITH REAL SCOTTY PHOTO) */}
          {(selectedFilter === 'all' || selectedFilter === 'scooter') && (
            <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs space-y-3">
              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Scooter Left-Facing Cutout */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-center p-1.5 shadow-2xs shrink-0 overflow-hidden">
                  <img
                    src="https://i.ibb.co/99Vw95mx/scooter-left-transparent.png"
                    alt="Rental Scooter in Goa"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-extrabold text-gray-900 tracking-tight leading-tight">
                    Rent a Scooter
                  </h3>
                  <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                    Great for flexibility and exploring at your own pace.
                  </p>
                </div>

                {/* Time & Fare Pill on Right */}
                <div className="flex flex-col items-end shrink-0 gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{scooterMinutes} min</span>
                  </div>
                  <div className="text-[16px] font-black text-[#FF5436] bg-[#FFF0EC] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    ₹350/day
                  </div>
                </div>
              </div>

              {/* Footer Specs Row */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a8 8 0 0 0-8 8v5a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-5a8 8 0 0 0-8-8z" />
                  </svg>
                  <span>Helmets included</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
                    <path d="M15 10h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                  </svg>
                  <span>Fuel extra</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[#9A3412] bg-[#FFF5EC] px-2 py-0.5 rounded-md font-bold">
                  <svg className="w-3.5 h-3.5 text-[#9A3412]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Valid DL required</span>
                </span>
              </div>
            </div>
          )}

          {/* 3. CAB (PRIVATE TAXI - WITH REAL TAXI PHOTO) */}
          {(selectedFilter === 'all' || selectedFilter === 'cab') && (
            <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs space-y-3">
              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Taxi Left-Facing Cutout */}
                <div className="w-16 h-16 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-center p-1.5 shadow-2xs shrink-0 overflow-hidden">
                  <img
                    src="https://i.ibb.co/gLxZ4kt4/taxi-left-transparent.png"
                    alt="Private Taxi in Goa"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-extrabold text-gray-900 tracking-tight leading-tight">
                    Cab (Private Taxi)
                  </h3>
                  <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                    Comfortable AC hatchback or sedan with fixed pre-negotiated or government meter rate.
                  </p>
                </div>

                {/* Time & Fare Pill on Right */}
                <div className="flex flex-col items-end shrink-0 gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{cabMinutes} min</span>
                  </div>
                  <div className="text-[16px] font-black text-[#FF5436] bg-[#FFF0EC] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    ₹{cabMin} – ₹{cabMax}
                  </div>
                </div>
              </div>

              {/* Footer Specs Row */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <path d="M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" />
                  </svg>
                  <span>AC comfort</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Luggage space</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Verified local drivers</span>
                </span>
              </div>
            </div>
          )}

          {/* 4. LOCAL BUS (KADAMBA / SHUTTLE - WITH REAL BUS PHOTO) */}
          {(selectedFilter === 'all' || selectedFilter === 'bus') && (
            <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs space-y-3">
              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Bus Left-Facing Cutout */}
                <div className="w-16 h-16 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-center p-1.5 shadow-2xs shrink-0 overflow-hidden">
                  <img
                    src="https://i.ibb.co/rKVDJxnf/bus-left-transparent.png"
                    alt="Kadamba Local Bus in Goa"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-extrabold text-gray-900 tracking-tight leading-tight">
                    Local Bus (Kadamba & Shuttle)
                  </h3>
                  <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                    Most economical way to reach from your nearest bus station.
                  </p>
                </div>

                {/* Time & Fare Pill on Right */}
                <div className="flex flex-col items-end shrink-0 gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{busMinutes} min</span>
                  </div>
                  <div className="text-[16px] font-black text-[#FF5436] bg-[#FFF0EC] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    ₹{busFare}
                  </div>
                </div>
              </div>

              {/* Station & Timing Info Box (Near User GPS Station) */}
              <div className="p-3 bg-[#FAF5FF] rounded-2xl border border-[#E9D5FF] space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5 text-[#6B21A8]">
                  <span className="font-bold shrink-0 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="3" width="16" height="15" rx="2" />
                      <path d="M4 11h16M8 18v2M16 18v2M8 7h.01M16 7h.01" />
                    </svg>
                    <span>Nearest Bus Stand to YOU:</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {nearestBusStandToUser.standName} ({nearestBusStandToUser.distanceToUser})
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[#6B21A8]">
                  <span className="font-bold shrink-0 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M12 12v8" />
                    </svg>
                    <span>Board Bus Towards:</span>
                  </span>
                  <span className="font-medium text-gray-700">
                    {destination.name} direction ({nearestBusStandToUser.busPlatform})
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500 pt-1 border-t border-[#E9D5FF]/60 text-[11px]">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Frequency: Every 15–20 mins (6:30 AM – 8:30 PM)</span>
                  </span>
                  <span className="font-semibold text-[#7C3AED]">Tickets on board</span>
                </div>
              </div>

              {/* Footer Specs Row */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  </svg>
                  <span>Budget friendly</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M12 12v8" />
                  </svg>
                  <span>Fixed routes</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                  <span>Eco-friendly</span>
                </span>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
