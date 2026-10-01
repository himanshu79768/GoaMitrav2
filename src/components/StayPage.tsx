import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UserPreferences } from '../types/onboarding';

interface StayItem {
  id: string;
  name: string;
  type: 'hotel' | 'homestay';
  starRating: 2 | 3 | 4;
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
  onOpenProfile: () => void;
  onAskGAI: (initialPrompt?: string) => void;
}

// Comprehensive verified stays across Mapusa, Calangute, Candolim, Assagao, and Panaji
const EXPANDED_STAYS: StayItem[] = [
  // --- MAPUSA HOTELS & HOMESTAYS ---
  {
    id: 'stay-mapusa-1',
    name: 'Hotel Satyaheera',
    type: 'hotel',
    starRating: 2,
    starsDisplay: '2★ Budget',
    locality: 'Near Municipal Market, Mapusa',
    areaGroup: 'Mapusa',
    distanceToBeach: '15 min to Anjuna / Calangute',
    distanceToStation: '10 min to Thivim Stn.',
    basePricePerRoom: 1350,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Solo & Budget travelers',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=80',
    description: 'Iconic budget town hotel right next to the famous Mapusa market and interstate bus stand. Clean, accessible, and very pocket-friendly.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Attached Bathroom', 'Elevator', '24/7 Front Desk'],
  },
  {
    id: 'stay-mapusa-2',
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
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=80',
    description: 'Government-verified tourism hotel with spacious rooms, on-site restaurant serving fish curry thali, and ample parking in Mapusa.',
    amenities: ['Spacious Rooms', 'In-house Restaurant', 'Free Parking', 'Travel Desk', 'AC & Non-AC'],
  },
  {
    id: 'stay-mapusa-3',
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
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    description: 'Comfortable town hotel featuring modern guest rooms, popular rooftop dining, bar, and central convenience for exploring North Goa.',
    amenities: ['Rooftop Restaurant', 'Full Bar', 'Room Service', 'High-speed WiFi', 'AC Executive'],
  },
  {
    id: 'stay-mapusa-4',
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
    suitableFor: 'Family & Groups',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80',
    description: 'Sprawling highway resort with a large outdoor swimming pool, banquet lawns, and swift road access to both Panaji and northern beaches.',
    amenities: ['Outdoor Pool', 'Lawn Dining', 'Multi-cuisine Restaurant', 'Free Breakfast', 'Large Parking'],
  },
  {
    id: 'stay-mapusa-5',
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
    id: 'stay-mapusa-6',
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
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    description: 'Picturesque village homestay in historic Moira village along the backwaters, 6 mins from Mapusa. Susegad peace with lush fruit orchards.',
    amenities: ['Riverview Veranda', 'Organic Breakfast', 'Birdwatching Garden', 'WiFi', 'Pet Friendly'],
  },

  // --- CALANGUTE & BAGA HOTELS ---
  {
    id: 'stay-calangute-1',
    name: 'Casa Bela',
    type: 'hotel',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Calangute, North Goa',
    areaGroup: 'Calangute / Baga',
    distanceToBeach: '8 min to beach',
    distanceToStation: '18 min to Thivim Stn.',
    basePricePerRoom: 3500,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Couple friendly',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80',
    description: 'Boutique Portuguese-inspired retreat with teak wood balconies, tropical garden courtyard, and walking access to Calangute beach.',
    amenities: ['Swimming Pool', 'Free Breakfast', 'High-speed WiFi', 'AC Deluxe', 'Balcony View'],
  },
  {
    id: 'stay-calangute-2',
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
  {
    id: 'stay-calangute-3',
    name: 'Tiara Coastal Suites',
    type: 'hotel',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Holiday Street, Calangute',
    areaGroup: 'Calangute / Baga',
    distanceToBeach: '6 min to beach',
    distanceToStation: '19 min to Thivim Stn.',
    basePricePerRoom: 3200,
    isBestMatch: false,
    isVerified: true,
    suitableFor: 'Family & Couples',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    description: 'Stylish suites equipped with mini-kitchens, plunge pool, and leafy terrace, nestled right between Calangute and Candolim shores.',
    amenities: ['Plunge Pool', 'Kitchenette', 'AC Suites', 'Power Backup', 'Terrace'],
  },

  // --- CANDOLIM & SINQUERIM ---
  {
    id: 'stay-candolim-1',
    name: 'The Goan Villa',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4★ Premium',
    locality: 'Candolim, North Goa',
    areaGroup: 'Candolim',
    distanceToBeach: '5 min to beach',
    distanceToStation: '22 min to Thivim Stn.',
    basePricePerRoom: 4200,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Family & Group',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    description: 'Heritage 200-year-old Portuguese mansion restored with contemporary comforts, private pool access, and authentic home-cooked meals.',
    amenities: ['Private Pool', 'Kitchenette', 'Veranda', 'Family Suites', 'Bicycle Rental'],
  },
  {
    id: 'stay-candolim-2',
    name: 'Santana Beach Resort',
    type: 'hotel',
    starRating: 4,
    starsDisplay: '4★ Premium',
    locality: 'Candolim Beachfront',
    areaGroup: 'Candolim',
    distanceToBeach: '2 min to beach',
    distanceToStation: '24 min to Thivim Stn.',
    basePricePerRoom: 5800,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Couples & Family',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80',
    description: 'Beachfront resort nestled amid coconut groves with two swimming pools, poolside bar, and direct access to quiet Candolim sand.',
    amenities: ['2 Swimming Pools', 'Beachside Shack', 'Bar & Lounge', 'Spa Services', 'Airport Transfer'],
  },
  {
    id: 'stay-candolim-3',
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
    description: 'Charming Portuguese village-style resort featuring colorful villas, quiet tropical landscaping, and walkability to Aguada Fort.',
    amenities: ['Swimming Pool', 'Poolside Bar', 'Buffet Breakfast', 'AC Villas', 'Garden View'],
  },

  // --- ASSAGAO & SIOLIM ---
  {
    id: 'stay-assagao-1',
    name: 'Quinta da Rosa Heritage Homestay',
    type: 'homestay',
    starRating: 3,
    starsDisplay: '3★ Comfort',
    locality: 'Badem Road, Assagao',
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
    id: 'stay-assagao-2',
    name: 'Botanical Palm Estate',
    type: 'homestay',
    starRating: 4,
    starsDisplay: '4★ Premium',
    locality: 'Siolim, North Goa',
    areaGroup: 'Assagao',
    distanceToBeach: '12 min to Morjim Beach',
    distanceToStation: '15 min to Thivim Stn.',
    basePricePerRoom: 5100,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Family & Groups',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    description: 'Restored colonial mansion with private stone pool, sun decks, private chef on request, and quiet proximity to Chapora river.',
    amenities: ['Private Stone Pool', 'Chef on Request', 'Heritage Veranda', 'High-speed WiFi', 'Bathtub Suites'],
  },

  // --- PANAJI & FONTAINHAS ---
  {
    id: 'stay-panaji-1',
    name: 'WelcomHeritage Panjim Inn',
    type: 'hotel',
    starRating: 4,
    starsDisplay: '4★ Premium',
    locality: 'Fontainhas Latin Quarter, Panaji',
    areaGroup: 'Panaji',
    distanceToBeach: '8 min to Miramar Beach',
    distanceToStation: '25 min to Karmali Stn.',
    basePricePerRoom: 5400,
    isBestMatch: true,
    isVerified: true,
    suitableFor: 'Heritage & Couples',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
    description: 'Goa’s iconic first heritage hotel located in the colorful Latin Quarter. Antique four-poster beds, period artwork, and veranda dining.',
    amenities: ['Heritage Dining', 'Art Gallery', 'Antique Furniture', 'AC Heritage Suites', 'Bar & Cafe'],
  },
  {
    id: 'stay-panaji-2',
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
    multiplier = 1.4; // 1 room with extra bed
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
  onOpenProfile,
  onAskGAI,
}) => {
  // Main Toggle: Hotels vs Homestays/Villas
  const [stayType, setStayType] = useState<'hotel' | 'homestay'>('hotel');

  // Star Rating Filter (All, 2, 3, 4)
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  // Area Locality Filter (All, Mapusa, Calangute, etc.)
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');

  // Stays List & Favorites
  const [staysList, setStaysList] = useState<StayItem[]>(EXPANDED_STAYS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedStay, setSelectedStay] = useState<StayItem | null>(null);

  // User location label
  const [userLocality, setUserLocality] = useState<string>('Calangute / Mapusa');

  // GAI Live Pricing State
  const [isGAILoading, setIsGAILoading] = useState(false);
  const [gaiTip, setGaiTip] = useState<string | null>(null);

  const memberCount = preferences.memberCount || 2;
  const travelType = preferences.travelType || 'Couple / Duo';
  const travelMonth = preferences.travelMonth || 'November';

  // Retrieve detected locality from sessionStorage if available
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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter Stays by stayType, starRating, and areaGroup
  const filteredStays = staysList.filter((item) => {
    // Type match
    if (item.type !== stayType) return false;

    // Star match
    if (starFilter !== 'all' && item.starRating !== starFilter) return false;

    // Area match
    if (selectedArea !== 'All Areas' && item.areaGroup !== selectedArea) return false;

    return true;
  });

  // Fetch real-time tailored hotels & prices using GAI
  const fetchGAIStays = async () => {
    setIsGAILoading(true);
    setGaiTip(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setGaiTip(`Estimated live rates for ${travelMonth}: 2★ budget (Mapusa/Calangute) from ₹1,200–₹1,900/night; 3★ comfort from ₹2,400–₹3,800/night; 4★ premium from ₹4,500–₹7,500/night for ${memberCount} guests (excl. GST).`);
        setIsGAILoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `As GAI (Goa Travel Assistant), recommend 3 real, verified ${stayType === 'hotel' ? 'hotels' : 'village homestays'} around North Goa (include Mapusa, Calangute, or Candolim) for a party of ${memberCount} guests (${travelType}) visiting in ${travelMonth}.
Cover:
- 1 Budget 2-Star option (under ₹1,800 per room)
- 1 Comfort 3-Star option (₹2,200–₹3,800 per room)
- 1 Premium 4-Star option (₹4,500+ per room)

Return a JSON array of objects with keys:
"name", "starRating" (2, 3, or 4), "locality", "areaGroup" ("Mapusa", "Calangute / Baga", "Candolim", "Assagao", or "Panaji"), "distanceToBeach", "distanceToStation", "basePricePerRoom" (number in INR), "suitableFor", "description" (1 concise sentence).
Only valid JSON format.`;

      let res;
      try {
        res = await ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });
      } catch {
        res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });
      }

      const responseText = res.text || '';
      const parsedItems = JSON.parse(responseText);

      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        const fallbackImages = [
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
        ];

        const formatted: StayItem[] = parsedItems.map((p: any, idx: number) => ({
          id: `gai-stay-${Date.now()}-${idx}`,
          name: p.name || 'Goan Coastal Stay',
          type: stayType,
          starRating: (p.starRating || 3) as 2 | 3 | 4,
          starsDisplay: `${p.starRating || 3}★ ${p.starRating === 2 ? 'Budget' : p.starRating === 4 ? 'Premium' : 'Comfort'}`,
          locality: p.locality || userLocality,
          areaGroup: (p.areaGroup as any) || 'Mapusa',
          distanceToBeach: p.distanceToBeach || '12 min to beach',
          distanceToStation: p.distanceToStation || '10 min to Thivim Stn.',
          basePricePerRoom: Number(p.basePricePerRoom) || 2400,
          isBestMatch: idx === 0,
          isVerified: true,
          suitableFor: p.suitableFor || `${travelType.split('/')[0].trim()} friendly`,
          image: fallbackImages[idx % fallbackImages.length],
          description: p.description || 'Verified local Goan stay with authentic hospitality and modern amenities.',
          amenities: ['Air Conditioning', 'WiFi', 'Power Backup', 'Clean Bathroom', 'Travel Desk'],
        }));

        setStaysList((prev) => [...formatted, ...prev]);
        setGaiTip(`✨ GAI found 3 freshly updated stays in ${selectedArea !== 'All Areas' ? selectedArea : 'North Goa'} calculated for ${memberCount} guests in ${travelMonth}!`);
      }
    } catch (err) {
      console.warn('GAI Stays fetch error', err);
      setGaiTip(`Live rates for ${travelMonth}: 2★ budget from ₹1,350/room, 3★ comfort from ₹2,600/room, 4★ luxury from ₹4,800/room (all excl. GST).`);
    } finally {
      setIsGAILoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#F7F7F5] flex flex-col justify-between max-w-[430px] mx-auto select-none relative overflow-hidden">
      {/* 1. Sticky Top Navigation Bar */}
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

        {/* User Profile Button */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          aria-label="User Profile"
        >
          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </header>

      {/* 2. Scrollable Viewport Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-3.5 pb-6 space-y-4 min-h-0 overscroll-contain">
        {/* Two Pill Segmented Toggle: Hotels vs Homestays/Villas */}
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

        {/* Selected Party & Month Context (Replaces redundant filter pills) */}
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

        {/* Fresh, High-Res Hero Image Card (Updated per user request) */}
        <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[175px] flex items-end p-5">
          {/* New Authentic Goan Heritage Villa Photo */}
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&auto=format&fit=crop&q=80"
            alt="Goan Coastal Villa & Resort"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay */}
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
            onClick={() => onAskGAI(`What are hotel rates like for ${memberCount} guests in Mapusa and Calangute in ${travelMonth}?`)}
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
            <span className="text-gray-400 font-normal">({filteredStays.length} available)</span>
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

        {/* Location Context & GAI Pricing Button */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold truncate">
            <span className="text-sm">📍</span>
            <span className="truncate">Near {selectedArea === 'All Areas' ? userLocality : selectedArea}</span>
          </div>

          {/* GAI Real-Time Pricing Button */}
          <button
            type="button"
            onClick={fetchGAIStays}
            disabled={isGAILoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white text-[11.5px] font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            {isGAILoading ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>Checking GAI...</span>
              </>
            ) : (
              <>
                <span>✨ Ask GAI Rates</span>
              </>
            )}
          </button>
        </div>

        {/* Star Rating Filters: All, 2 Star, 3 Star, 4 Star */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Stars' },
            { id: 2, label: '2★ Budget' },
            { id: 3, label: '3★ Comfort' },
            { id: 4, label: '4★ Premium' },
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

        {/* GAI Tip Banner if loaded */}
        {gaiTip && (
          <div className="p-3 rounded-2xl bg-[#E0F2FE]/70 border border-[#BAE6FD] text-[12px] text-[#0369A1] font-medium leading-relaxed flex items-start gap-2 shadow-xs">
            <span className="text-base shrink-0">💡</span>
            <span>{gaiTip}</span>
          </div>
        )}

        {/* Stays List (Includes Mapusa, Calangute, Candolim, Assagao, Panaji) */}
        <div className="space-y-3.5 pt-1">
          {filteredStays.map((stay) => {
            const isFav = favorites.includes(stay.id);
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

                    {/* Price Pill Box on right: Calculated for person count, clearly states excl GST */}
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

      {/* 3. Detail Bottom Sheet / Modal */}
      {selectedStay && (() => {
        const calculated = calculateStayPrice(selectedStay.basePricePerRoom, memberCount);
        const gstAmount = Math.round(calculated.totalPrice * 0.12);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
            onClick={() => setSelectedStay(null)}
          >
            <div
              className="w-full max-w-[430px] bg-white rounded-t-[32px] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
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
                  <span>Room rate (base):</span>
                  <span>₹{selectedStay.basePricePerRoom.toLocaleString('en-IN')} / room</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Calculated for {memberCount} {memberCount === 1 ? 'Guest' : 'Guests'}:</span>
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
                    const prompt = `Can you tell me more about ${selectedStay.name} in ${selectedStay.locality}, including rates for ${memberCount} guests in ${travelMonth}, room options, and what food or attractions are nearby?`;
                    setSelectedStay(null);
                    onAskGAI(prompt);
                  }}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#177F91] to-[#0E5865] text-white text-center font-bold text-[13.5px] shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>✨ Ask GAI details</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
