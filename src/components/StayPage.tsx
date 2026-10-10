import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences, SavedPlaceItem } from '../types/onboarding';
import { StayBooking } from '../types/booking';
import { StayBookingModal } from './StayBookingModal';

export interface StayItem {
  id: string;
  name: string;
  type: 'hotel' | 'homestay';
  starRating: 2 | 3 | 4 | 5;
  starsDisplay: string;
  locality: string;
  areaGroup: 'Mapusa' | 'Calangute / Baga' | 'Candolim' | 'Assagao' | 'Panaji' | 'Other';
  distanceToBeach: string;
  distanceToStation: string;
  basePricePerRoom: number;
  isBestMatch?: boolean;
  isVerified: boolean;
  suitableFor: string;
  image: string;
  description: string;
  amenities: string[];
}

interface StayPageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onAskGAI: (initialPrompt?: string) => void;
  savedPlaces?: SavedPlaceItem[];
  onToggleSavePlace?: (place: SavedPlaceItem) => void;
  onBookingSuccess?: (booking: StayBooking) => void;
  onOpenProfileImpact?: (booking: StayBooking) => void;
}

// 100% Unique, Verified Photos & Accurate Ratings for Authentic Goan Homestays
export const ACCURATE_VERIFIED_STAYS: StayItem[] = [
  // --- HERITAGE & BOUTIQUE HOMESTAYS ---
  {
    id: 'stay-goan-villa',
    name: 'The Goan Villa Heritage Estate',
    type: 'homestay',
    starRating: 5,
    starsDisplay: '5-Star Heritage Villa',
    locality: 'Candolim, North Goa',
    areaGroup: 'Candolim',
    distanceToBeach: '5 min to Candolim Beach',
    distanceToStation: '22 min to Thivim Stn.',
    basePricePerRoom: 4200,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Family & Groups',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXPvGhG56RuIKrCKyMbaiBKTuLMXifci5e7XVADi_JFg&s=10',
    description: 'Restored 200-year-old Portuguese estate with tranquil courtyard swimming pool, high wooden ceilings, and authentic Goan family hospitality.',
    amenities: ['Private Courtyard Pool', 'Equipped Kitchenette', 'Veranda with Garden', 'Family Suites', 'Bicycle Rental'],
  },
  {
    id: 'stay-siolim-estate',
    name: 'Botanical Palm Estate Homestay',
    type: 'homestay',
    starRating: 5,
    starsDisplay: '5-Star River Villa',
    locality: 'Siolim Riverfront, North Goa',
    areaGroup: 'Assagao',
    distanceToBeach: '10 min to Morjim Beach',
    distanceToStation: '16 min to Thivim Stn.',
    basePricePerRoom: 5100,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Family & Peaceful Getaway',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEt99HVuCrjNludDV77f98sSGyxuYsctBSIgKHT7NGWw&s=10',
    description: 'Private riverside villa estate enveloped by palms with a natural stone pool, outdoor sun deck, and peaceful proximity to Chapora river.',
    amenities: ['Stone Pool', 'Home Cook on Request', 'Riverfront Lawn', 'High-speed WiFi', 'Bathtub Suites'],
  },
  {
    id: 'stay-quinta-assagao',
    name: 'Quinta da Rosa Heritage Homestay',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4-Star Village Homestay',
    locality: 'Assagao, North Goa',
    areaGroup: 'Assagao',
    distanceToBeach: '10 min to Vagator Beach',
    distanceToStation: '14 min to Thivim Stn.',
    basePricePerRoom: 3200,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Couples & Solo',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaEMFSd97R2RiAsdqL_v6udS8AaUYAK1TRs2kT9zgQJA&s=10',
    description: 'Peaceful traditional village homestay nestled amongst towering palm groves and bougainvillea in trendy Assagao. Warm Goan hosts and organic farm breakfast.',
    amenities: ['Lush Garden', 'Organic Breakfast', 'Yoga Lawn', 'Ceiling Fan & AC', 'Pet Friendly'],
  },
  {
    id: 'stay-casa-do-leao',
    name: 'Casa Do Leão Historic Villa',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4-Star Heritage Villa',
    locality: 'Badem Road, Assagao',
    areaGroup: 'Assagao',
    distanceToBeach: '8 min to Anjuna Beach',
    distanceToStation: '15 min to Thivim Stn.',
    basePricePerRoom: 3600,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Culture Lovers',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbPMEDIO7oUWhO1QifKjsPHtZe0TdKUnUAv4v5PEHx0Q&s=10',
    description: '19th-century Portuguese stone villa lovingly curated with antique four-poster beds, shaded reading verandas, and lush fruit orchard gardens.',
    amenities: ['Private Garden', 'Homestyle Goan Breakfast', 'Antique Suites', 'Free WiFi', 'Tea Lounge'],
  },
  {
    id: 'stay-afonso-panaji',
    name: 'Afonso Heritage Guest House',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4-Star Heritage Guest House',
    locality: 'St. Sebastian Chapel, Fontainhas',
    areaGroup: 'Panaji',
    distanceToBeach: '10 min to Miramar Beach',
    distanceToStation: '24 min to Karmali Stn.',
    basePricePerRoom: 2600,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Solo & Couples',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyi3w3dlOpFfuTyipzy5CHkuIanucPL6mMRW0H2iIebg&s=10',
    description: 'Authentic Goan-Catholic family homestay next to St. Sebastian Chapel in Fontainhas Latin Quarter. Rooftop terrace with potted ferns and bird song.',
    amenities: ['Rooftop Terrace', 'Homestyle Breakfast', 'Fast WiFi', 'AC Rooms', 'Quiet Street'],
  },
  {
    id: 'stay-moira-homestay',
    name: 'Chateau Madeira Moira Homestay',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3-Star Backwater Homestay',
    locality: 'Moira Village (near Mapusa)',
    areaGroup: 'Mapusa',
    distanceToBeach: '20 min to Morjim Beach',
    distanceToStation: '12 min to Thivim Stn.',
    basePricePerRoom: 2750,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Nature lovers',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgUVukRt69SnSVY20Lx8SjNYx903ex0ivWHPqJR0ljyg&s=10',
    description: 'Picturesque village homestay along the Moira backwaters, 6 mins from Mapusa. Susegad peace with fruit orchards, homemade jams, and bird song.',
    amenities: ['Riverview Veranda', 'Organic Breakfast', 'Birdwatching Garden', 'WiFi', 'Pet Friendly'],
  },
  {
    id: 'stay-olaulim-backwaters',
    name: 'Olaulim Backwaters Sanctuary Homestay',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4-Star Nature Homestay',
    locality: 'Olaulim, Pomburpa (near Mapusa)',
    areaGroup: 'Mapusa',
    distanceToBeach: '22 min to Calangute Beach',
    distanceToStation: '16 min to Thivim Stn.',
    basePricePerRoom: 4400,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Couples & Nature Enthusiasts',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBjZfSCFtc8cuSKR8ncUY1i8GNeAgWGxHQ9xerQss7qg&s=10',
    description: 'Rustic eco-luxury backwaters homestay set along tranquil tidal creeks with private stone cottages, kayaking, home-cooked Goan seafood, and farm animals.',
    amenities: ['Kayaks Included', 'Home-cooked Feasts', 'Saltwater Pool', 'Pet Sanctuary', 'Cottages'],
  },
  {
    id: 'stay-aldona-sanctuary',
    name: 'Aldona River House Homestay',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3-Star Village Homestay',
    locality: 'Quitona, Aldona (near Mapusa)',
    areaGroup: 'Mapusa',
    distanceToBeach: '25 min to Vagator Beach',
    distanceToStation: '11 min to Thivim Stn.',
    basePricePerRoom: 2400,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Solo & Couples',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYIUdUprz1BHTx-ba1K8fADMHOuy2jJlSMAJjOmm2aWA&s=10',
    description: 'Quiet family homestay in the peaceful village of Aldona with airy balcony overlooking mangrove streams and traditional Goan breakfast.',
    amenities: ['River Balcony', 'Home Cooked Meals', 'Free WiFi', 'AC Rooms', 'Quiet Village'],
  },
  {
    id: 'stay-morjim-cottage',
    name: 'Morjim Palm Beach Cottage Homestay',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3-Star Beach Homestay',
    locality: 'Morjim Beach Road, North Goa',
    areaGroup: 'Assagao',
    distanceToBeach: '2 min walk to Turtle Beach',
    distanceToStation: '22 min to Thivim Stn.',
    basePricePerRoom: 2900,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Beach Explorers',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6TVvuyOWRqgFxTaVwd3FU9RZTmgy6zeNq8cHTR1ux_Q&s=10',
    description: 'Charming coastal cottage homestay shaded by swaying coconut trees just steps from Morjim sand dunes. Enjoy tranquil sunsets and fresh sea breezes.',
    amenities: ['2 Min to Beach', 'Garden Hammocks', 'Home Breakfast', 'AC Cottages', 'WiFi'],
  },
  {
    id: 'stay-baga-creek',
    name: 'Casa Bela Village Creek Homestay',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3-Star Coastal Homestay',
    locality: 'Arpora / Calangute, North Goa',
    areaGroup: 'Calangute / Baga',
    distanceToBeach: '6 min to Calangute Beach',
    distanceToStation: '18 min to Thivim Stn.',
    basePricePerRoom: 2800,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Friends',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxwtPwr3_UnzSbB8qlettW9m4Kx49uqzqeWPaRmDtzgg&s=10',
    description: 'Cozy Goan family-operated homestay with private wooden balconies, peaceful garden courtyard, and quick walkability to beaches and cafes.',
    amenities: ['Balcony View', 'Host Breakfast', 'High-speed WiFi', 'AC Rooms', 'Scooter Parking'],
  },
  {
    id: 'stay-tivim-heritage',
    name: 'Thivim Village Heritage Home',
    type: 'homestay',
    starRating: 2,
    starsDisplay: '2-Star Budget Homestay',
    locality: 'Near Thivim Railway Station, Mapusa',
    areaGroup: 'Mapusa',
    distanceToBeach: '20 min to Calangute Beach',
    distanceToStation: '3 min to Thivim Stn.',
    basePricePerRoom: 1450,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Transit & Budget Solo',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWttYItZSrkHQ0DJN_uu9_sx5IOoxB99etc4d5jqVZjQ&s=10',
    description: 'Authentic budget homestay hosted by a warm local Goan family right near Thivim station. Clean, comfortable rooms, home chai and breakfast.',
    amenities: ['3 Min to Station', 'Clean Ensuite Bath', 'Home Cooked Food', 'WiFi', '24/7 Host Help'],
  },
];

const AREA_FILTERS = [
  'All Areas',
  'Mapusa',
  'Calangute / Baga',
  'Candolim',
  'Assagao',
  'Panaji',
];

/** Calculates dynamic pricing based on member count */
function calculateStayPrice(basePricePerRoom: number, memberCount: number) {
  const count = memberCount > 0 ? memberCount : 2;
  let multiplier = 1;
  let roomCount = 1;
  let note = '';

  if (count === 1) {
    multiplier = 1;
    roomCount = 1;
    note = 'for 1 guest · excl. GST';
  } else if (count === 2) {
    multiplier = 1;
    roomCount = 1;
    note = 'for 2 guests (1 room) · excl. GST';
  } else if (count === 3) {
    multiplier = 1.4; // 1 room with extra mattress
    roomCount = 1;
    note = 'for 3 guests (1 room + extra bed) · excl. GST';
  } else {
    roomCount = Math.ceil(count / 2);
    multiplier = roomCount;
    note = `for ${count} guests (${roomCount} rooms) · excl. GST`;
  }

  const totalPrice = Math.round(basePricePerRoom * multiplier);
  return {
    totalPrice,
    basePricePerRoom,
    roomCount,
    note,
  };
}

export const StayPage: React.FC<StayPageProps> = ({
  preferences,
  onBack,
  onAskGAI,
  savedPlaces = [],
  onToggleSavePlace,
  onBookingSuccess,
  onOpenProfileImpact,
}) => {
  // Star Rating Filter (All, 2, 3, 4, 5)
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  // Area Locality Filter
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');

  // Stays List & Favorites
  const [staysList] = useState<StayItem[]>(ACCURATE_VERIFIED_STAYS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedStay, setSelectedStay] = useState<StayItem | null>(null);
  const [stayToBook, setStayToBook] = useState<StayItem | null>(null);

  const memberCount = preferences.memberCount || 2;
  const travelType = preferences.travelType || 'Couple / Duo';
  const travelMonth = preferences.travelMonth || 'November';

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const stayItem = ACCURATE_VERIFIED_STAYS.find((s) => s.id === id);
    if (stayItem && onToggleSavePlace) {
      onToggleSavePlace({
        id: stayItem.id,
        title: stayItem.name,
        category: 'stay',
        subtitle: `${stayItem.starRating}-Star Homestay`,
        location: stayItem.locality,
        image: stayItem.image,
        ratingOrPrice: `₹${stayItem.basePricePerRoom}/night`,
      });
    }
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter Stays by starRating and areaGroup (Homestays Only)
  const filteredStays = staysList.filter((item) => {
    if (starFilter !== 'all' && item.starRating !== starFilter) return false;
    if (selectedArea !== 'All Areas' && item.areaGroup !== selectedArea) return false;
    return true;
  });

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
        </motion.button>

        {/* Title */}
        <h1 className="text-[20px] font-black text-[#111111] tracking-tight">
          Stay
        </h1>

        {/* Right Balance Spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Scrollable Body Container */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3.5 pb-8 space-y-4 min-h-0 overscroll-contain touch-pan-y no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Verified Homestay Trust Banner (Hotels removed) */}
        <div className="bg-[#EAF5EE] border border-[#A7F3D0] p-2.5 rounded-2xl flex items-center justify-between shadow-2xs w-full max-w-4xl md:mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </span>
            <div>
              <div className="text-[13px] font-extrabold text-[#065F46] leading-tight">
                Verified Goan Homestays Only
              </div>
              <div className="text-[11px] font-medium text-[#047857]">
                Local family estates, heritage villas & authentic hosts
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#059669] text-white text-[11px] font-bold shadow-2xs shrink-0 flex items-center gap-1">
            <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Verified Badge</span>
          </span>
        </div>

        {/* Selected Party & Month Context Badge */}
        <div className="flex items-center justify-between px-1 max-w-4xl md:mx-auto w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-2xs text-[12px] font-bold text-gray-800">
            <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{memberCount} {memberCount === 1 ? 'Guest' : 'Guests'}</span>
            <span className="text-gray-300">·</span>
            <span className="text-[#177F91]">{travelType}</span>
          </div>

          <div className="text-[12px] font-semibold text-gray-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{travelMonth}</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[175px] flex items-end p-5">
          <img
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&auto=format&fit=crop&q=80"
            alt="Goan Coastal Villa & Resort"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Hero Copy */}
          <div className="relative z-10 text-white">
            <h2 className="text-[22px] font-black tracking-tight leading-tight drop-shadow-sm">
              Stay verified, stay smart.
            </h2>
            <p className="text-[13px] font-medium text-white/90 mt-1 drop-shadow-xs">
              Real photos. Real prices. No surprises.
            </p>
          </div>
        </div>

        {/* Season Alert Banner */}
        <div className="rounded-2xl bg-[#FFF5EC] border border-[#FED7AA] p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#EA580C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div className="text-[12px] font-semibold text-[#9A3412] leading-tight">
              <span>Peak season (Dec–Jan): prices rise 2–3x. Book early.</span>
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAskGAI(`What are hotel prices and availability like for ${memberCount} guests in Mapusa, Calangute, and Candolim in ${travelMonth}?`)}
            className="text-[11.5px] font-bold text-[#EA580C] hover:underline flex items-center shrink-0 ml-2 cursor-pointer"
          >
            <span>Learn more</span>
            <span className="ml-0.5">›</span>
          </motion.button>
        </div>

        {/* Area Locality Filter Pills */}
        <div>
          <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider px-1 mb-1.5 flex items-center justify-between md:justify-center md:gap-3">
            <span>Filter by Town / Area</span>
            <span className="text-gray-400 font-normal">({filteredStays.length} stays)</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 md:justify-center">
            {AREA_FILTERS.map((area) => {
              const isSelected = selectedArea === area;
              return (
                <motion.button
                  key={area}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#177F91] text-white border-[#177F91] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200/90 hover:border-gray-300'
                  }`}
                >
                  {area}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Star Rating Filters */}
        <div>
          <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider px-1 mb-1.5 md:text-center">
            Star Rating
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar md:justify-center">
            {[
              { id: 'all', label: 'All Stars' },
              { id: 2, label: '2-Star Budget' },
              { id: 3, label: '3-Star Comfort' },
              { id: 4, label: '4-Star Boutique' },
              { id: 5, label: '5-Star Luxury' },
            ].map((s) => {
              const isSelected = starFilter === s.id;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStarFilter(s.id as any)}
                  className={`px-3 py-1 rounded-full text-[11.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#111827] text-white border-[#111827]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Stays List with Micro-Transitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredStays.map((stay) => {
            const isFav = favorites.includes(stay.id) || savedPlaces.some((p) => p.id === stay.id);
            const calculated = calculateStayPrice(stay.basePricePerRoom, memberCount);

            return (
              <motion.div
                key={stay.id}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelectedStay(stay)}
                className="bg-white rounded-3xl p-3 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              >
                {/* Main Card Top Section */}
                <div className="flex items-start gap-3.5">
                  {/* Photo with Heart Button */}
                  <div className="relative w-[115px] h-[115px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />

                    {/* Star badge overlay */}
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-0.5">
                      <span>{stay.starRating}</span>
                      <svg className="w-2.5 h-2.5 fill-current text-amber-400" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>

                    {/* Heart Button with Pop Micro-animation */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.75 }}
                      onClick={(e) => toggleFavorite(stay.id, e)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white cursor-pointer"
                      aria-label="Save to favorites"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill={isFav ? '#FF4A4A' : 'none'}
                        stroke={isFav ? '#FF4A4A' : 'currentColor'}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Right Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-[115px]">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1">
                        {stay.isBestMatch ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3 fill-current text-[#0284C7]" viewBox="0 0 24 24">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span>Best match</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {stay.starsDisplay}
                          </span>
                        )}

                        {stay.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#065F46] bg-[#D1FAE5] border border-[#6EE7B7] px-2 py-0.5 rounded-full shadow-2xs">
                            <svg className="w-3 h-3 text-[#059669]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Verified Badge</span>
                          </span>
                        )}
                      </div>

                      {/* Hotel Name */}
                      <h3 className="text-[16.5px] font-extrabold text-gray-900 tracking-tight leading-tight mt-1 truncate">
                        {stay.name}
                      </h3>

                      {/* Locality */}
                      <div className="text-[12px] font-medium text-gray-500 leading-tight mt-0.5 truncate">
                        {stay.locality}
                      </div>

                      {/* Distance */}
                      <div className="flex items-center gap-1 text-[11.5px] font-semibold text-gray-600 mt-1 truncate">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="truncate">{stay.distanceToBeach}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-end justify-end mt-1">
                      <div className="text-right">
                        <span className="text-[17px] font-black text-[#FF5436] tracking-tight">
                          ₹{calculated.totalPrice.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[9.5px] text-gray-400 font-medium -mt-0.5 leading-tight">
                          {calculated.note}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Spec Footer Bar */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 min-w-0">
                    <span className="flex items-center gap-1 truncate max-w-[100px]">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="2" />
                        <path d="M10 22v-5l-2-1v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4l-2 1v5" />
                      </svg>
                      <span className="truncate">{stay.distanceToBeach}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[95px]">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                      <span className="truncate">{stay.distanceToStation}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[85px]">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span className="truncate">{stay.suitableFor}</span>
                    </span>
                  </div>

                  {/* Right Action Circle */}
                  <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-400 shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 12l4-4-4-4" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. Homestay Full Details Page (Full Screen) */}
      <AnimatePresence>
        {selectedStay && (() => {
          const calculated = calculateStayPrice(selectedStay.basePricePerRoom, memberCount);
          const gstAmount = Math.round(calculated.totalPrice * 0.12);

          return (
            <motion.div
              key="stay-detail-page"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col overflow-y-auto overscroll-contain text-gray-900 select-none"
            >
              {/* Sticky Full-Screen Top Header Bar */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedStay(null)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span>Back to Stays</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                      Verified Homestay
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStay(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Main Full-Screen Body Content */}
              <div className="max-w-xl mx-auto w-full px-4 pt-4 pb-28 flex-1 space-y-4">
                {/* Stay Hero Image */}
                <div className="relative h-60 sm:h-72 rounded-3xl overflow-hidden shadow-sm bg-gray-100">
                  <img
                    src={selectedStay.image}
                    alt={selectedStay.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-xs font-black shadow-xs">
                      {selectedStay.starsDisplay}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#059669] text-white text-xs font-black inline-flex items-center gap-1.5 shadow-md">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Verified Goan Heritage</span>
                    </span>
                  </div>
                </div>

                {/* Title & Locality & Price Header Card */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight">
                        {selectedStay.name}
                      </h2>
                      <p className="text-sm font-semibold text-gray-500 mt-0.5 flex items-center gap-1">
                        <span>📍 {selectedStay.locality}</span>
                        <span>·</span>
                        <span>{selectedStay.distanceToBeach}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[24px] font-black text-emerald-800 tracking-tight">
                        ₹{calculated.totalPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {calculated.note}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Price Breakdown */}
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/70 text-xs space-y-1.5">
                    <div className="flex justify-between text-gray-600">
                      <span>Base rate per room:</span>
                      <span>₹{selectedStay.basePricePerRoom.toLocaleString('en-IN')} / room / night</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total for {memberCount} {memberCount === 1 ? 'Guest' : 'Guests'}:</span>
                      <span>₹{calculated.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 pt-1.5 border-t border-gray-200">
                      <span>Estimated GST (12%):</span>
                      <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-2">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    About This Homestay
                  </h3>
                  <p className="text-[14px] leading-relaxed text-gray-700 font-medium">
                    {selectedStay.description}
                  </p>
                </div>

                {/* Verified Amenities */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-3">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    VERIFIED AMENITIES & FACILITIES
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStay.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold"
                      >
                        <svg className="w-3.5 h-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secondary Actions: Map & Ask GAI */}
                <div className="grid grid-cols-2 gap-2.5">
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedStay.name}, ${selectedStay.locality}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-2xl bg-white border border-gray-200 text-gray-800 text-center font-bold text-[12.5px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#E05333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>View on Google Map</span>
                  </motion.a>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const prompt = `Can you tell me more about ${selectedStay.name} in ${selectedStay.locality} (${selectedStay.starsDisplay}), including exact ratings, room types for ${memberCount} guests, and nearby attractions?`;
                      setSelectedStay(null);
                      onAskGAI(prompt);
                    }}
                    className="py-3 px-3 rounded-2xl bg-teal-50 text-[#177F91] border border-teal-200 text-center font-bold text-[12.5px] hover:bg-teal-100/70 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#177F91]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                    <span>Ask GAI Details</span>
                  </motion.button>
                </div>
              </div>

              {/* Fixed Bottom Action Bar with BOOK HOMESTAY NOW (Updated Color!) */}
              <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/90 p-4 shadow-lg">
                <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Total Payable
                    </span>
                    <div className="text-[20px] font-black text-gray-900 leading-tight">
                      ₹{calculated.totalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const toBook = selectedStay;
                      setSelectedStay(null);
                      setStayToBook(toBook);
                    }}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#047857] via-[#059669] to-[#0D9488] text-white text-center font-black text-[15px] shadow-lg shadow-emerald-700/25 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Homestay Now</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* 4. Complete Stay Booking Modal Flow (Details, Dummy Payment, Success & Impact Division) */}
      <AnimatePresence>
        {stayToBook && (
          <StayBookingModal
            stay={stayToBook}
            defaultGuestName={preferences.name || 'Goan Explorer'}
            defaultGuestCount={memberCount}
            travelMonth={travelMonth}
            onClose={() => setStayToBook(null)}
            onBookingSuccess={(booking) => {
              if (onBookingSuccess) onBookingSuccess(booking);
            }}
            onViewImpactReceipt={(booking) => {
              if (onOpenProfileImpact) {
                onOpenProfileImpact(booking);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

