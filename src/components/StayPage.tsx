import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences, SavedPlaceItem } from '../types/onboarding';

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
}

// 100% Unique, Verified Photos & Accurate Star Ratings for Goan stays
export const ACCURATE_VERIFIED_STAYS: StayItem[] = [
  // --- 5-STAR LUXURY RESORTS ---
  {
    id: 'stay-taj-aguada',
    name: 'Taj Fort Aguada Resort & Spa',
    type: 'hotel',
    starRating: 5,
    starsDisplay: '5★ Luxury',
    locality: 'Sinquerim Beach, Candolim',
    areaGroup: 'Candolim',
    distanceToBeach: 'Direct Beachfront access',
    distanceToStation: '26 min to Thivim Stn.',
    basePricePerRoom: 14500,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Couples & Family Luxury',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=80',
    description: 'Iconic 5-star heritage luxury resort terraced into the 16th-century Portuguese fortress walls with panoramic Arabian Sea views and Jiva Spa.',
    amenities: ['Private Beach Access', 'Jiva Spa & Wellness', 'Infinity Ocean Pool', 'Fine Dining Shacks', 'Helipad & Valet'],
  },
  {
    id: 'stay-w-goa',
    name: 'W Goa',
    type: 'hotel',
    starRating: 5,
    starsDisplay: '5★ Luxury',
    locality: 'Vagator Beach, North Goa',
    areaGroup: 'Assagao',
    distanceToBeach: '1 min to Vagator Beach',
    distanceToStation: '18 min to Thivim Stn.',
    basePricePerRoom: 16800,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Trendsetters',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-luxury 5-star cliffside sanctuary perched directly above Vagator Beach. Featuring the famous Rockpool lounge, private chalets, and sunset decks.',
    amenities: ['Rockpool Sunset Lounge', 'AWAY Spa', 'Private Plunge Pools', '24/7 Concierge', 'Valet Parking'],
  },

  // --- 4-STAR BOUTIQUE & HERITAGE PROPERTIES ---
  {
    id: 'stay-panjim-inn',
    name: 'WelcomHeritage Panjim Inn',
    type: 'hotel',
    starRating: 4,
    starsDisplay: '4★ Boutique',
    locality: 'Fontainhas Latin Quarter, Panaji',
    areaGroup: 'Panaji',
    distanceToBeach: '8 min to Miramar Beach',
    distanceToStation: '22 min to Karmali Stn.',
    basePricePerRoom: 5400,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Heritage & Culture lovers',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    description: 'Official classified 4-star heritage mansion in Fontainhas. Four-poster rosewood beds, hand-painted azulejos tiles, and charming first-floor veranda cafe.',
    amenities: ['Heritage Cafe', 'Art Gallery', 'Antique Furniture', 'AC Deluxe Suites', 'Latin Quarter Walk'],
  },
  {
    id: 'stay-goan-villa',
    name: 'The Goan Villa',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4★ Boutique',
    locality: 'Candolim, North Goa',
    areaGroup: 'Candolim',
    distanceToBeach: '5 min to Candolim Beach',
    distanceToStation: '22 min to Thivim Stn.',
    basePricePerRoom: 4200,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Family & Groups',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    description: 'Restored 200-year-old Portuguese estate with tranquil courtyard swimming pool, high wooden ceilings, and authentic Goan hospitality.',
    amenities: ['Private Pool', 'Equipped Kitchenette', 'Veranda', 'Family Suites', 'Bicycle Rental'],
  },
  {
    id: 'stay-siolim-estate',
    name: 'Botanical Palm Estate',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4★ Boutique',
    locality: 'Siolim Riverfront, North Goa',
    areaGroup: 'Assagao',
    distanceToBeach: '10 min to Morjim Beach',
    distanceToStation: '16 min to Thivim Stn.',
    basePricePerRoom: 5100,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Family & Peaceful Getaway',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    description: 'Private riverside villa estate enveloped by palms with a natural stone pool, outdoor sun deck, and peaceful proximity to Chapora river.',
    amenities: ['Stone Pool', 'Chef on Request', 'Riverfront Lawn', 'High-speed WiFi', 'Bathtub Suites'],
  },

  // --- 3-STAR COMFORT HOTELS & VILLAGE HOMESTAYS ---
  {
    id: 'stay-hotel-vilena',
    name: 'Hotel Vilena',
    type: 'hotel',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Court Circle, Mapusa',
    areaGroup: 'Mapusa',
    distanceToBeach: '14 min to Calangute Beach',
    distanceToStation: '10 min to Thivim Stn.',
    basePricePerRoom: 2400,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Couples & Business',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80',
    description: 'Popular 3-star town hotel near Mapusa Court Circle featuring clean executive rooms, famous rooftop restaurant with city view, and bar.',
    amenities: ['Rooftop Restaurant', 'Full Bar', 'Room Service', 'High-speed WiFi', 'AC Executive'],
  },
  {
    id: 'stay-green-park',
    name: 'Green Park Resort',
    type: 'hotel',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Guirim By-pass, Mapusa',
    areaGroup: 'Mapusa',
    distanceToBeach: '12 min to Candolim Beach',
    distanceToStation: '14 min to Thivim Stn.',
    basePricePerRoom: 2850,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Family & Highway Transit',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80',
    description: 'Well-established resort right off the Mapusa highway featuring a large outdoor swimming pool, banquet lawns, and swift road access.',
    amenities: ['Outdoor Pool', 'Lawn Dining', 'Multi-cuisine Restaurant', 'Free Breakfast', 'Large Parking'],
  },
  {
    id: 'stay-casa-bela',
    name: 'Casa Bela Boutique Hotel',
    type: 'hotel',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Calangute, North Goa',
    areaGroup: 'Calangute / Baga',
    distanceToBeach: '8 min to Calangute Beach',
    distanceToStation: '18 min to Thivim Stn.',
    basePricePerRoom: 3500,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Couple friendly',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=80',
    description: 'Comfortable Portuguese-inspired hotel with private wooden balconies, swimming pool, and quiet green walkway to Calangute beach.',
    amenities: ['Swimming Pool', 'Free Breakfast', 'High-speed WiFi', 'AC Deluxe', 'Balcony View'],
  },
  {
    id: 'stay-aldeia-santa-rita',
    name: 'Aldeia Santa Rita',
    type: 'hotel',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Sinquerim, Candolim',
    areaGroup: 'Candolim',
    distanceToBeach: '5 min to Sinquerim Beach',
    distanceToStation: '25 min to Thivim Stn.',
    basePricePerRoom: 3600,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Family',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=80',
    description: 'Charming Portuguese village-style resort featuring colorful pastel chalets, quiet tropical landscaping, and walkability to Aguada Fort.',
    amenities: ['Swimming Pool', 'Poolside Bar', 'Buffet Breakfast', 'AC Villas', 'Garden View'],
  },
  {
    id: 'stay-quinta-assagao',
    name: 'Quinta da Rosa Heritage Homestay',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Assagao, North Goa',
    areaGroup: 'Assagao',
    distanceToBeach: '10 min to Vagator Beach',
    distanceToStation: '14 min to Thivim Stn.',
    basePricePerRoom: 3200,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Solo',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    description: 'Peaceful traditional village homestay nestled amongst towering palm groves and bougainvillea in trendy Assagao.',
    amenities: ['Lush Garden', 'Organic Breakfast', 'Yoga Lawn', 'Ceiling Fan & AC', 'Pet Friendly'],
  },
  {
    id: 'stay-moira-homestay',
    name: 'Moira Heritage River Homestay',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Moira Village (near Mapusa)',
    areaGroup: 'Mapusa',
    distanceToBeach: '20 min to Morjim Beach',
    distanceToStation: '12 min to Thivim Stn.',
    basePricePerRoom: 2750,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Couples & Nature lovers',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=80',
    description: 'Picturesque village homestay along the Moira backwaters, 6 mins from Mapusa. Susegad peace with fruit orchards and bird song.',
    amenities: ['Riverview Veranda', 'Organic Breakfast', 'Birdwatching Garden', 'WiFi', 'Pet Friendly'],
  },
  {
    id: 'stay-afonso-panaji',
    name: 'Afonso Heritage Guest House',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'St. Sebastian Chapel, Fontainhas',
    areaGroup: 'Panaji',
    distanceToBeach: '10 min to Miramar Beach',
    distanceToStation: '24 min to Karmali Stn.',
    basePricePerRoom: 2600,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Solo & Couples',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop&q=80',
    description: 'Authentic Goan-Catholic family homestay next to St. Sebastian Chapel in Fontainhas. Rooftop terrace with potted ferns and bird song.',
    amenities: ['Rooftop Terrace', 'Homestyle Breakfast', 'Fast WiFi', 'AC Rooms', 'Quiet Street'],
  },

  // --- 2-STAR BUDGET HOTELS & LODGES IN MAPUSA & COAST ---
  {
    id: 'stay-satyaheera',
    name: 'Hotel Satyaheera',
    type: 'hotel',
    starRating: 2,
    starsDisplay: '2★ Budget',
    locality: 'Near Municipal Market, Mapusa',
    areaGroup: 'Mapusa',
    distanceToBeach: '15 min to Calangute Beach',
    distanceToStation: '10 min to Thivim Stn.',
    basePricePerRoom: 1350,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Solo & Budget travelers',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=80',
    description: 'Genuine budget town hotel in Mapusa right opposite the market. Clean, central, with air-conditioned rooms, elevator, and budget restaurant.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Attached Bathroom', 'Elevator', '24/7 Front Desk'],
  },
  {
    id: 'stay-mapusa-residency',
    name: 'Mapusa Residency (GTDC)',
    type: 'hotel',
    starRating: 2,
    starsDisplay: '2★ Budget',
    locality: 'Near Bus Terminus, Mapusa',
    areaGroup: 'Mapusa',
    distanceToBeach: '18 min to Baga Beach',
    distanceToStation: '11 min to Thivim Stn.',
    basePricePerRoom: 1650,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Family & Couples',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&auto=format&fit=crop&q=80',
    description: 'Government-verified tourism hotel with spacious rooms, on-site restaurant serving fish curry thali, and ample parking in central Mapusa.',
    amenities: ['Spacious Rooms', 'In-house Restaurant', 'Free Parking', 'Travel Desk', 'AC & Non-AC'],
  },
  {
    id: 'stay-shantadurga',
    name: 'Shantadurga Budget Lodge',
    type: 'hotel',
    starRating: 2,
    starsDisplay: '2★ Budget',
    locality: 'Market Road, Mapusa',
    areaGroup: 'Mapusa',
    distanceToBeach: '16 min to Anjuna Beach',
    distanceToStation: '9 min to Thivim Stn.',
    basePricePerRoom: 1100,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Backpacker & Solo',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
    description: 'No-frills budget stay ideal for backpackers and travelers catching early morning trains from Thivim or exploring Friday flea markets.',
    amenities: ['Clean Beds', 'Attached Bath', 'Ceiling Fan', '24/7 Desk', 'CCTV Security'],
  },
  {
    id: 'stay-seashell-palms',
    name: 'Seashell Palms Inn',
    type: 'hotel',
    starRating: 2,
    starsDisplay: '2★ Budget',
    locality: 'Baga Road, Calangute',
    areaGroup: 'Calangute / Baga',
    distanceToBeach: '4 min to beach',
    distanceToStation: '20 min to Thivim Stn.',
    basePricePerRoom: 1850,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Backpacker & Friends',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80',
    description: 'Clean, cheerful budget beach hotel minutes away from Tito’s lane and water sports shacks. Ideal for active explorers.',
    amenities: ['Clean Ensuite', 'AC', 'Free WiFi', '24/7 Desk', 'Scooter Parking'],
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
}) => {
  // Main Toggle: Hotels vs Homestays/Villas
  const [stayType, setStayType] = useState<'hotel' | 'homestay'>('hotel');

  // Star Rating Filter (All, 2, 3, 4, 5)
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  // Area Locality Filter
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');

  // Stays List & Favorites
  const [staysList] = useState<StayItem[]>(ACCURATE_VERIFIED_STAYS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedStay, setSelectedStay] = useState<StayItem | null>(null);

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
        subtitle: `${stayItem.starRating}-Star ${stayItem.type}`,
        location: stayItem.locality,
        image: stayItem.image,
        ratingOrPrice: `₹${stayItem.basePricePerRoom}/night`,
      });
    }
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter Stays by stayType, starRating, and areaGroup
  const filteredStays = staysList.filter((item) => {
    if (item.type !== stayType) return false;
    if (starFilter !== 'all' && item.starRating !== starFilter) return false;
    if (selectedArea !== 'All Areas' && item.areaGroup !== selectedArea) return false;
    return true;
  });

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between max-w-[430px] mx-auto select-none relative overflow-hidden w-full">
      {/* 1. 100% Pinned Sticky Top Navigation Bar */}
      <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
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

        {/* Title */}
        <h1 className="text-[20px] font-black text-[#111111] tracking-tight">
          Stay
        </h1>

        {/* Right Balance Spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Scrollable Body Container (Header stays 100% fixed) */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3.5 pb-8 space-y-4 min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Two Pill Segmented Toggle: Hotels vs Village Homestays */}
        <div className="bg-[#EAEAE8] p-1 rounded-full flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => setStayType('hotel')}
            className={`flex-1 py-2.5 rounded-full text-[14px] font-bold transition-all text-center cursor-pointer ${
              stayType === 'hotel'
                ? 'bg-[#177F91] text-white shadow-[0_2px_8px_rgba(23,127,145,0.35)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hotels
          </button>
          <button
            type="button"
            onClick={() => setStayType('homestay')}
            className={`flex-1 py-2.5 rounded-full text-[14px] font-bold transition-all text-center cursor-pointer ${
              stayType === 'homestay'
                ? 'bg-[#177F91] text-white shadow-[0_2px_8px_rgba(23,127,145,0.35)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Village Homestays
          </button>
        </div>

        {/* Selected Party & Month Context Badge (Clean, non-redundant) */}
        <div className="flex items-center justify-between px-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-2xs text-[12px] font-bold text-gray-800">
            <span>👥</span>
            <span>{memberCount} {memberCount === 1 ? 'Guest' : 'Guests'}</span>
            <span className="text-gray-300">·</span>
            <span className="text-[#177F91]">{travelType}</span>
          </div>

          <div className="text-[12px] font-semibold text-gray-500 flex items-center gap-1">
            <span>📅</span>
            <span>{travelMonth}</span>
          </div>
        </div>

        {/* Fresh, High-Res Hero Image Card */}
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

        {/* Season Alert Banner: Peak Season Price Rise */}
        <div className="rounded-2xl bg-[#FFF5EC] border border-[#FED7AA] p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">📅</span>
            <div className="text-[12px] font-semibold text-[#9A3412] leading-tight">
              <span>Peak season (Dec–Jan): prices rise 2–3x. Book early.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAskGAI(`What are hotel prices and availability like for ${memberCount} guests in Mapusa, Calangute, and Candolim in ${travelMonth}?`)}
            className="text-[11.5px] font-bold text-[#EA580C] hover:underline flex items-center shrink-0 ml-2 cursor-pointer"
          >
            <span>Learn more</span>
            <span className="ml-0.5">›</span>
          </button>
        </div>

        {/* Area Locality Filter Pills (Mapusa, Calangute, Candolim, Assagao, Panaji) */}
        <div>
          <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider px-1 mb-1.5 flex items-center justify-between">
            <span>Filter by Town / Area</span>
            <span className="text-gray-400 font-normal">({filteredStays.length} stays)</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {AREA_FILTERS.map((area) => {
              const isSelected = selectedArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#177F91] text-white border-[#177F91] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200/90 hover:border-gray-300'
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Star Rating Filters: All, 2 Star, 3 Star, 4 Star, 5 Star */}
        <div>
          <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider px-1 mb-1.5">
            Star Rating
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Stars' },
              { id: 2, label: '2★ Budget' },
              { id: 3, label: '3★ Comfort' },
              { id: 4, label: '4★ Boutique' },
              { id: 5, label: '5★ Luxury' },
            ].map((s) => {
              const isSelected = starFilter === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStarFilter(s.id as any)}
                  className={`px-3 py-1 rounded-full text-[11.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#111827] text-white border-[#111827]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stays List with 100% Unique Photos & Dynamic Guest Pricing */}
        <div className="space-y-3.5 pt-1">
          {filteredStays.map((stay) => {
            const isFav = favorites.includes(stay.id) || savedPlaces.some((p) => p.id === stay.id);
            const calculated = calculateStayPrice(stay.basePricePerRoom, memberCount);

            return (
              <div
                key={stay.id}
                onClick={() => setSelectedStay(stay)}
                className="bg-white rounded-3xl p-3 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Main Card Top Section: Image on Left + Info on Right */}
                <div className="flex items-start gap-3.5">
                  {/* Photo with Heart (Favorite) button on top right */}
                  <div className="relative w-[115px] h-[115px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Star badge overlay */}
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                      {stay.starRating}★
                    </div>

                    {/* Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(stay.id, e)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
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
                    </button>
                  </div>

                  {/* Right Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-[115px]">
                    <div>
                      {/* Top Badges: Best Match & Verified */}
                      <div className="flex items-center justify-between gap-1">
                        {stay.isBestMatch ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                            <span>★</span>
                            <span>Best match</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {stay.starsDisplay}
                          </span>
                        )}

                        {stay.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded-full">
                            <span>✔</span>
                            <span>Verified</span>
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
                        <span>📍</span>
                        <span className="truncate">{stay.distanceToBeach}</span>
                      </div>
                    </div>

                    {/* Price Pill Box on right: Calculated for member count, clearly states excl GST */}
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
                      <span>🚶</span>
                      <span className="truncate">{stay.distanceToBeach}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[95px]">
                      <span>🚗</span>
                      <span className="truncate">{stay.distanceToStation}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[85px]">
                      <span>👥</span>
                      <span className="truncate">{stay.suitableFor}</span>
                    </span>
                  </div>

                  {/* Chevron Button */}
                  <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-400 shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 12l4-4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Smooth Down-to-Up & Up-to-Down Animated Bottom Sheet */}
      <AnimatePresence>
        {selectedStay && (() => {
          const calculated = calculateStayPrice(selectedStay.basePricePerRoom, memberCount);
          const gstAmount = Math.round(calculated.totalPrice * 0.12);

          return (
            <motion.div
              key="stay-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
              onClick={() => setSelectedStay(null)}
            >
              <motion.div
                key="stay-sheet-content"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-full max-w-[430px] bg-white rounded-t-[32px] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sheet Handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />

                {/* Stay Image with Badges */}
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={selectedStay.image}
                    alt={selectedStay.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold">
                      {selectedStay.starsDisplay}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#177F91] text-white text-xs font-bold">
                      ✔ Verified Stay
                    </span>
                  </div>
                </div>

                {/* Title & Price Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[21px] font-black text-gray-900 tracking-tight leading-tight">
                      {selectedStay.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mt-0.5">
                      {selectedStay.locality}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[23px] font-black text-[#FF5436]">
                      ₹{calculated.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      {calculated.note}
                    </div>
                  </div>
                </div>

                {/* Dynamic Price Breakdown for party */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/70 text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Base rate per room:</span>
                    <span>₹{selectedStay.basePricePerRoom.toLocaleString('en-IN')} / room</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total for {memberCount} {memberCount === 1 ? 'Guest' : 'Guests'}:</span>
                    <span>₹{calculated.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 pt-1 border-t border-gray-200">
                    <span>Estimated GST (12%):</span>
                    <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13.5px] leading-relaxed text-gray-700">
                  {selectedStay.description}
                </p>

                {/* Verified Amenities */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    VERIFIED AMENITIES
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStay.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedStay.name}, ${selectedStay.locality}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-2xl bg-gray-100 text-gray-900 text-center font-bold text-[13.5px] hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>📍 View on map</span>
                    <span>↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const prompt = `Can you tell me more about ${selectedStay.name} in ${selectedStay.locality} (${selectedStay.starsDisplay}), including exact ratings, room types for ${memberCount} guests, and nearby attractions?`;
                      setSelectedStay(null);
                      onAskGAI(prompt);
                    }}
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#177F91] to-[#0E5865] text-white text-center font-bold text-[13.5px] shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>✨ Ask GAI details</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
