import React, { useState, useEffect } from 'react';
import { DestinationItem } from './DestinationsPage';
import { UserPreferences } from '../types/onboarding';

interface TravelPageProps {
  destination: DestinationItem;
  preferences: UserPreferences;
  onBack: () => void;
  onAskGAI: (initialPrompt?: string) => void;
}

const TRANSPORT_FILTERS = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'cab', label: 'Cab', icon: '🚗' },
  { id: 'auto', label: 'Auto', icon: '🛺' },
  { id: 'scooter', label: 'Scooter', icon: '🛵' },
  { id: 'bus', label: 'Bus', icon: '🚌' },
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
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-start max-w-[430px] mx-auto select-none relative w-full">
      {/* 1. Sticky Top Navigation Bar (Profile icon removed, balanced right spacer) */}
      <header className="sticky top-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
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

        {/* Right Balance Spacer (Profile only on homescreen) */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Unified Scroll Body Container */}
      <div className="px-4 pt-3 pb-8 space-y-4 w-full flex-1">
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
              <span>📍</span>
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
              <span className="text-base shrink-0">⏰</span>
              <div>
                <span className="font-bold text-gray-900">Visiting Hours: </span>
                <span>{destination.timings}</span>
              </div>
            </div>

            {/* Photography Rules */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-1.5 border-t border-gray-100">
              <span className="text-base shrink-0">📸</span>
              <div>
                <span className="font-bold text-gray-900">Photography & Drones: </span>
                <span>{destination.photographyRules}</span>
              </div>
            </div>

            {/* Entry Tickets */}
            <div className="flex items-start gap-2.5 text-gray-700 pt-1.5 border-t border-gray-100">
              <span className="text-base shrink-0">🎟️</span>
              <div>
                <span className="font-bold text-gray-900">Entry Tickets: </span>
                <span>{destination.entryFee}</span>
              </div>
            </div>

            {/* Best Time & Insider Tip */}
            <div className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
              <span className="text-base shrink-0">💡</span>
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
                <span>📍 View on Google Maps</span>
                <span>↗</span>
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
                <span>✨ Ask GAI Advice</span>
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
        <div className="space-y-3.5">
          {/* 1. AUTO RICKSHAW CARD */}
          {(selectedFilter === 'all' || selectedFilter === 'auto') && (
            <div className="bg-white rounded-3xl p-4 border border-[#BAE6FD] shadow-[0_2px_12px_rgba(2,132,199,0.06)] space-y-3">
              {/* Top Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">
                  <span>★</span>
                  <span>Best for you</span>
                </span>
              </div>

              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Auto Rickshaw Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#E6F7F5] border border-[#BDEFEA] text-[#0D9488] flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13.5v-3c0-.83-.67-1.5-1.5-1.5H16l-2-4H7L5 9H3.5C2.67 9 2 9.67 2 10.5v3c0 .83.67 1.5 1.5 1.5H4c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h.5c.83 0 1.5-.67 1.5-1.5zm-12 3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6-5H8.5V9h4v2.5zm4 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
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
                    <span>⏱</span>
                    <span>{autoMinutes} min</span>
                  </div>
                  <div className="text-[18px] font-black text-[#FF5436] bg-[#FFF0EC] px-3 py-0.5 rounded-full">
                    ₹{autoFare}
                  </div>
                </div>
              </div>

              {/* Pink Rikshaw Highlight Pill */}
              <div className="p-2.5 bg-[#FFF1F2] rounded-xl border border-[#FFE4E6] flex items-center gap-2 text-xs font-semibold text-[#BE123C]">
                <span>👩</span>
                <span>Pink Rikshaw (women-only) available at same fare.</span>
              </div>

              {/* Footer Specs Row */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <span>✔</span>
                  <span>Safe & reliable</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>👥</span>
                  <span>Available 24×7</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  <span>Widely available</span>
                </span>
              </div>
            </div>
          )}

          {/* 2. RENT A SCOOTER CARD */}
          {(selectedFilter === 'all' || selectedFilter === 'scooter') && (
            <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs space-y-3">
              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Scooter Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#FFF6EE] border border-[#FED7AA] text-[#EA580C] flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 14h-2.1c-.4-1.2-1.5-2-2.9-2H13l-1.5-3H14V7h-3.2l-1.5-3H6v2h2.2l1.5 3H7c-1.7 0-3 1.3-3 3v2H2v2h2.1c.4 1.2 1.5 2 2.9 2s2.5-.8 2.9-2h4.2c.4 1.2 1.5 2 2.9 2s2.5-.8 2.9-2H22v-2h-3zm-12 3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm10 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                  </svg>
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
                    <span>⏱</span>
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
                  <span>🪖</span>
                  <span>Helmets included</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>⛽</span>
                  <span>Fuel extra</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[#9A3412] bg-[#FFF5EC] px-2 py-0.5 rounded-md font-bold">
                  <span>📄</span>
                  <span>Valid DL required</span>
                </span>
              </div>
            </div>
          )}

          {/* 3. CAB (PRIVATE TAXI) - NO GOAMILES MENTIONS */}
          {(selectedFilter === 'all' || selectedFilter === 'cab') && (
            <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs space-y-3">
              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Cab Icon in Blue Box */}
                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
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
                    <span>⏱</span>
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
                  <span>❄️</span>
                  <span>AC comfort</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>🧳</span>
                  <span>Luggage space</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>🛡️</span>
                  <span>Verified local drivers</span>
                </span>
              </div>
            </div>
          )}

          {/* 4. LOCAL BUS (KADAMBA / SHUTTLE) WITH REAL USER GPS BUS STAND */}
          {(selectedFilter === 'all' || selectedFilter === 'bus') && (
            <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs space-y-3">
              {/* Main Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Bus Icon in Purple Box */}
                <div className="w-14 h-14 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
                  </svg>
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
                    <span>⏱</span>
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
                  <span className="font-bold shrink-0">🚌 Nearest Bus Stand to YOU:</span>
                  <span className="font-semibold text-gray-900">
                    {nearestBusStandToUser.standName} ({nearestBusStandToUser.distanceToUser})
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[#6B21A8]">
                  <span className="font-bold shrink-0">🚏 Board Bus Towards:</span>
                  <span className="font-medium text-gray-700">
                    {destination.name} direction ({nearestBusStandToUser.busPlatform})
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500 pt-1 border-t border-[#E9D5FF]/60 text-[11px]">
                  <span>⏰ Frequency: Every 15–20 mins (6:30 AM – 8:30 PM)</span>
                  <span className="font-semibold text-[#7C3AED]">Tickets on board</span>
                </div>
              </div>

              {/* Footer Specs Row */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <span>🎟️</span>
                  <span>Budget friendly</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>🚏</span>
                  <span>Fixed routes</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>🌱</span>
                  <span>Eco-friendly</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
