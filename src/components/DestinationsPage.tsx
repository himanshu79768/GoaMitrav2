import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types/onboarding';

export interface DestinationItem {
  id: string;
  name: string;
  category: 'fort' | 'heritage' | 'cultural' | 'beach' | 'nature_waterfall' | 'hill_mountain';
  tourismType: 'Heritage Tourism' | 'Cultural Tourism' | 'Both';
  matchBadge?: 'Best match' | 'Popular' | 'Hidden gem' | 'Scenic pick';
  location: string;
  minutesFromNorthGoa: number;
  minutesFromPanaji: number;
  minutesFromSouthGoa: number;
  distanceKm: number;
  description: string;
  warningNote?: string;
  tags: string[];
  image: string;
  timings: string;
  photographyRules: string;
  entryFee: string;
  bestTime: string;
  insiderTip: string;
  nearestBusStand: string;
  busRoute: string;
}

interface DestinationsPageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onSelectDestination: (destination: DestinationItem) => void;
}

// 100% Genuine Outdoor Landmark Photos (Zero hotel rooms)
export const ALL_DESTINATIONS: DestinationItem[] = [
  // --- HERITAGE MONUMENTS & FORTS ---
  {
    id: 'dest-reis-magos',
    name: 'Reis Magos Fort',
    category: 'fort',
    tourismType: 'Heritage Tourism',
    matchBadge: 'Best match',
    location: 'Verem, North Goa',
    minutesFromNorthGoa: 20,
    minutesFromPanaji: 15,
    minutesFromSouthGoa: 60,
    distanceKm: 11,
    description: 'Restored 16th-century river fortress overlooking the Mandovi estuary. High laterite stone ramparts and historic brass cannons.',
    warningNote: 'Closed on Mondays. Last entry at 5:00 PM.',
    tags: ['Historic fort', 'Sea ramparts', 'Uncrowded'],
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700&auto=format&fit=crop&q=80',
    timings: '9:30 AM – 5:30 PM (Tuesday to Sunday, Closed Mondays)',
    photographyRules: 'Handheld cameras & phones allowed. Drones require prior GSIDC permit.',
    entryFee: '₹50 for adults, ₹25 for students, Free for kids under 10',
    bestTime: '4:00 PM – 5:30 PM for golden sunset over the Mandovi estuary',
    insiderTip: 'Walk down to the old ammunition room which now houses original Mario Miranda Goan lifestyle sketches.',
    nearestBusStand: 'Panaji KTC Terminus (take Betim/Verem ferry or shuttle)',
    busRoute: 'Panaji to Betim ferry, then local mini-bus to Verem stop',
  },
  {
    id: 'dest-chapora-fort',
    name: 'Chapora Fort',
    category: 'fort',
    tourismType: 'Heritage Tourism',
    matchBadge: 'Popular',
    location: 'Vagator, North Goa',
    minutesFromNorthGoa: 15,
    minutesFromPanaji: 35,
    minutesFromSouthGoa: 75,
    distanceKm: 9,
    description: 'Dramatic red laterite cliffside fort offering uninterrupted 360-degree views of Vagator Beach, Ozran cove, and Chapora river.',
    warningNote: 'Steep cobblestone incline; wear supportive walking shoes.',
    tags: ['Sunset panorama', 'Red laterite', 'Scenic view'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&auto=format&fit=crop&q=80',
    timings: 'Open 24 hours (Recommended sunrise to sunset)',
    photographyRules: 'Photography allowed everywhere. Sunset tripod setups welcome.',
    entryFee: 'Free entry',
    bestTime: '5:15 PM – 6:30 PM for dramatic sunset over the Arabian Sea',
    insiderTip: 'Take the narrow rear path along the outer wall facing Morjim sandbar for the quietest photo angle away from crowds.',
    nearestBusStand: 'Mapusa Bus Stand (10 km away)',
    busRoute: 'Mapusa to Anjuna/Vagator direct Kadamba shuttle',
  },
  {
    id: 'dest-bom-jesus',
    name: 'Basilica of Bom Jesus & Old Goa',
    category: 'heritage',
    tourismType: 'Heritage Tourism',
    matchBadge: 'Best match',
    location: 'Old Goa (Velha Goa)',
    minutesFromNorthGoa: 35,
    minutesFromPanaji: 18,
    minutesFromSouthGoa: 45,
    distanceKm: 22,
    description: 'UNESCO World Heritage 16th-century baroque monument housing the sacred relics of St. Francis Xavier. Exemplary stone architecture.',
    warningNote: 'Modest dress code required: shoulders and knees must be covered.',
    tags: ['UNESCO Heritage', 'Baroque architecture', 'Historic monument'],
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=700&auto=format&fit=crop&q=80',
    timings: '9:00 AM – 6:30 PM (Sunday open from 10:30 AM after Mass)',
    photographyRules: 'Photography allowed in courtyard. No flash or selfie sticks inside the main altar and relic chapel.',
    entryFee: 'Free entry (Museum ticket ₹20)',
    bestTime: '9:00 AM – 10:30 AM to beat tourist buses and experience serene acoustics',
    insiderTip: 'Cross the road to Se Cathedral to see the largest church bell in Asia, the famous Golden Bell.',
    nearestBusStand: 'Panaji KTC Bus Terminus (10 km away)',
    busRoute: 'Frequent direct Panaji–Old Goa shuttles every 10 mins',
  },
  {
    id: 'dest-cabo-de-rama',
    name: 'Cabo de Rama Fort & Cliff Edge',
    category: 'fort',
    tourismType: 'Heritage Tourism',
    matchBadge: 'Scenic pick',
    location: 'Canacona, South Goa',
    minutesFromNorthGoa: 90,
    minutesFromPanaji: 75,
    minutesFromSouthGoa: 35,
    distanceKm: 58,
    description: 'Ancient coastal fortress perched 50 meters above turquoise waves where Lord Rama and Sita were believed to stay during exile.',
    warningNote: 'No railings on sheer sea cliff edges; exercise caution with children.',
    tags: ['Wild cliff', 'Sea fortress', 'Uncrowded'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
    timings: '9:00 AM – 5:30 PM (All days)',
    photographyRules: 'Open photography permitted. Drone flights prohibited due to naval air corridors.',
    entryFee: 'Free entry',
    bestTime: '4:00 PM – 5:30 PM as the cliff faces light up in golden amber tones',
    insiderTip: 'Walk past the whitewashed Church of St. Antonio inside the fort to find the lone watchtower commanding the entire southern coastline.',
    nearestBusStand: 'Margao KTC Bus Stand / Canacona Bus Stand',
    busRoute: 'Margao to Cabo de Rama via Cuncolim local bus',
  },

  // --- CULTURAL VILLAGES, TRADITIONS & SPICE FARMS ---
  {
    id: 'dest-divar-island',
    name: 'Divar Island',
    category: 'cultural',
    tourismType: 'Cultural Tourism',
    matchBadge: 'Best match',
    location: 'Mandovi River (Ferry via Ribandar / Old Goa)',
    minutesFromNorthGoa: 35,
    minutesFromPanaji: 20,
    minutesFromSouthGoa: 50,
    distanceKm: 18,
    description: 'A ferry-only river island where old Goan village life still moves slowly. Emerald paddy fields, ancestral Portuguese villas, and hill chapels.',
    warningNote: 'Vehicle ferry operates every 15 minutes; free for pedestrians and scooters.',
    tags: ['Ferry ride', 'Village culture', 'Uncrowded'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&auto=format&fit=crop&q=80',
    timings: 'Ferries run from 6:00 AM to 11:30 PM daily',
    photographyRules: 'Street and landscape photography welcomed. Respect privacy when photographing villagers’ courtyards.',
    entryFee: 'Free (Vehicle ferry ₹10 for cars, free for scooters and passengers)',
    bestTime: '7:30 AM – 10:00 AM for morning birdlife and susegad village bakery cycles',
    insiderTip: 'Ride up to Our Lady of Compassion Church at Piedade hill for an eagle-eye view over the winding Mandovi river bunds.',
    nearestBusStand: 'Old Goa Bus Stop / Ribandar Ferry Ramp',
    busRoute: 'Panaji to Ribandar ferry jetty, take ferry to Divar',
  },
  {
    id: 'dest-sahakari-spice',
    name: 'Sahakari Spice Farm',
    category: 'cultural',
    tourismType: 'Cultural Tourism',
    matchBadge: 'Popular',
    location: 'Curti, Ponda (Cultural Heartland)',
    minutesFromNorthGoa: 50,
    minutesFromPanaji: 35,
    minutesFromSouthGoa: 40,
    distanceKm: 32,
    description: 'Immersive guided walking tour through 130 acres of betel nut, vanilla, cardamom, and cinnamon trees followed by an authentic Goan buffet lunch.',
    warningNote: 'Wear flat shoes suitable for red earthen farm pathways.',
    tags: ['Spice tasting', 'Folk culture', 'Goan thali'],
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=700&auto=format&fit=crop&q=80',
    timings: '9:00 AM – 4:30 PM daily',
    photographyRules: 'Photography allowed across all plantation trails and traditional lunch dining hall.',
    entryFee: '₹500 per person (Includes herbal welcome drink, guided tour, and buffet lunch)',
    bestTime: '11:00 AM – 2:00 PM for the guided plantation walk followed by warm fresh lunch',
    insiderTip: 'Taste the freshly brewed lemongrass and ginger tea at the welcome reception—it is made from spices plucked that morning.',
    nearestBusStand: 'Ponda KTC Bus Stand (3 km away)',
    busRoute: 'Panaji to Ponda direct bus, then 5 min auto to Curti farm',
  },
  {
    id: 'dest-fontainhas-culture',
    name: 'Fontainhas Cultural Latin Walk',
    category: 'cultural',
    tourismType: 'Both',
    matchBadge: 'Best match',
    location: 'Panaji Latin Quarter',
    minutesFromNorthGoa: 25,
    minutesFromPanaji: 2,
    minutesFromSouthGoa: 45,
    distanceKm: 14,
    description: 'Walk through narrow cobblestone alleys framed by centuries-old heritage homes painted in indigo, ochre, and terracotta, with warm aroma of Goan bakeries.',
    warningNote: 'Residential area; speak softly and avoid blocking doorway access.',
    tags: ['Latin architecture', 'Bakery trail', 'Art galleries'],
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?w=700&auto=format&fit=crop&q=80',
    timings: 'Best explored between 8:00 AM – 11:00 AM or 4:00 PM – 7:00 PM',
    photographyRules: 'Photography permitted on public alleys. Do not point cameras through private open home windows.',
    entryFee: 'Free to walk (Heritage gallery visits free)',
    bestTime: '8:30 AM for quiet morning light and fresh warm bread from traditional bakeries',
    insiderTip: 'Stop by 31st January Bakery for traditional bibinca and pastéis de nata, operating since 1930.',
    nearestBusStand: 'Panaji KTC Main Bus Terminus (1.5 km)',
    busRoute: 'Any bus to Panaji, then short walk or auto to Fontainhas',
  },
  {
    id: 'dest-goa-chitra',
    name: 'Goa Chitra Ethnographic Museum',
    category: 'cultural',
    tourismType: 'Cultural Tourism',
    matchBadge: 'Hidden gem',
    location: 'Benaulim, South Goa',
    minutesFromNorthGoa: 70,
    minutesFromPanaji: 45,
    minutesFromSouthGoa: 15,
    distanceKm: 42,
    description: 'Premier ethnographic museum housing over 4,000 indigenous agrarian tools, antique cane carts, and colonial artisanal implements collected from old Goan families.',
    warningNote: 'Guided audio tours recommended to appreciate each ancient implement.',
    tags: ['Tribal heritage', 'Craft history', 'Artisanal tools'],
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=700&auto=format&fit=crop&q=80',
    timings: '9:00 AM – 6:00 PM (All days)',
    photographyRules: 'Photography allowed without flash.',
    entryFee: '₹300 for adults, ₹150 for students',
    bestTime: '10:00 AM – 12:00 PM for the guided storytelling tour',
    insiderTip: 'Do not miss the collection of custom Goan bullock carts and ancient feni distillation clay pots.',
    nearestBusStand: 'Margao KTC Bus Stand (6 km away)',
    busRoute: 'Margao to Benaulim beach bus, alight at Goa Chitra junction',
  },

  // --- NATURE, WATERFALLS, HILLS & MOUNTAINS ---
  {
    id: 'dest-netravali',
    name: 'Netravali Sanctuary & Waterfall',
    category: 'nature_waterfall',
    tourismType: 'Both',
    matchBadge: 'Popular',
    location: 'Sanguem, South-Eastern Goa',
    minutesFromNorthGoa: 85,
    minutesFromPanaji: 70,
    minutesFromSouthGoa: 45,
    distanceKm: 65,
    description: 'Trek through a dense evergreen wildlife sanctuary in the Western Ghats to a cascading jungle waterfall and natural plunge pool that most tourists never find.',
    warningNote: 'Forest checkpost entry closes at 3:30 PM.',
    tags: ['Forest trek', 'Jungle waterfall', 'Uncrowded'],
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=700&auto=format&fit=crop&q=80',
    timings: '9:00 AM – 4:00 PM (Entry permits issued at gate until 3:30 PM)',
    photographyRules: 'Nature photography allowed. Carry waterproof camera covers.',
    entryFee: '₹100 forest entry fee + ₹50 camera charge',
    bestTime: 'Early morning (9:30 AM) to experience morning mist and crystal clear pool swimming',
    insiderTip: 'Visit the mysterious bubbling lake (Budbudyanchi Tali) situated just 4 km before the forest sanctuary entrance.',
    nearestBusStand: 'Sanguem Bus Stand / Margao KTC',
    busRoute: 'Margao to Sanguem, then local jeep/taxi to Netravali village',
  },
  {
    id: 'dest-chorla-ghats',
    name: 'Chorla Ghats & Twin Falls',
    category: 'hill_mountain',
    tourismType: 'Both',
    matchBadge: 'Hidden gem',
    location: 'Mhadei Valley (Goa-Karnataka Border)',
    minutesFromNorthGoa: 60,
    minutesFromPanaji: 55,
    minutesFromSouthGoa: 90,
    distanceKm: 52,
    description: 'Cool misty mountain highway winding up to 800 meters elevation into the sub-tropical Sahyadri cloud forests. Panoramic canyon viewpoints and twin roaring waterfalls.',
    warningNote: 'Mountain fog can reduce road visibility; drive carefully on hairpin curves.',
    tags: ['Cloud forest', 'Misty hills', 'Bird watching'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=80',
    timings: 'Highway open 24 hours (Day travel strongly recommended)',
    photographyRules: 'Landscape and wildlife photography permitted across forest lookouts.',
    entryFee: 'Free highway access',
    bestTime: '6:30 AM – 9:00 AM to see sea of clouds floating across the Mhadei valley',
    insiderTip: 'Look out for the rare Malabar Pied Hornbill and Great Hornbill feeding on wild figs along the roadside trees.',
    nearestBusStand: 'Sanquelim Bus Stand (28 km away)',
    busRoute: 'Sanquelim to Belagavi interstate bus crosses Chorla Ghats',
  },

  // --- RARE UNTOUCHED BEACHES ---
  {
    id: 'dest-galgibaga',
    name: 'Galgibaga Beach (Turtle Beach)',
    category: 'beach',
    tourismType: 'Both',
    matchBadge: 'Hidden gem',
    location: 'Canacona, Deep South Goa',
    minutesFromNorthGoa: 95,
    minutesFromPanaji: 80,
    minutesFromSouthGoa: 35,
    distanceKm: 68,
    description: 'A serene nesting sanctuary for endangered Olive Ridley turtles. Zero loud beach shacks, zero commercial water sports—just whispering casuarina pine trees and golden surf.',
    warningNote: 'Strictly protected turtle nesting zone. No loud music or bright lights permitted.',
    tags: ['Secluded beach', 'Turtle nesting', 'Uncrowded'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
    timings: 'Open sunrise to sunset (Night access restricted in nesting season)',
    photographyRules: 'Landscape photography allowed. Flash photography strictly banned near turtle enclosures.',
    entryFee: 'Free entry',
    bestTime: '4:30 PM – 6:30 PM for a pristine, peaceful sunset beach walk',
    insiderTip: 'Eat fresh seafood at Surya’s Beach Shack, one of the only subtle family-run rustic spots tucked beneath the pine trees.',
    nearestBusStand: 'Canacona Bus Stand (7 km away)',
    busRoute: 'Margao or Canacona bus to Poinguinim junction, then 5 min auto',
  },
  {
    id: 'dest-harvalem-caves',
    name: 'Harvalem Rock-Cut Caves & Waterfall',
    category: 'heritage',
    tourismType: 'Heritage Tourism',
    matchBadge: 'Hidden gem',
    location: 'Sanquelim, Bicholim, North Goa',
    minutesFromNorthGoa: 40,
    minutesFromPanaji: 30,
    minutesFromSouthGoa: 60,
    distanceKm: 31,
    description: 'Monolithic 6th-century laterite rock-cut caverns carved by ancient Buddhist and Vedic monks with Sanskrit inscriptions, located right beside a 50-meter waterfall.',
    warningNote: 'Water flow at falls is strongest during and immediately following the monsoon months.',
    tags: ['6th-century caves', 'Laterite rock-cut', 'Scenic waterfall'],
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&auto=format&fit=crop&q=80',
    timings: '9:00 AM – 1:00 PM, 2:00 PM – 5:30 PM daily',
    photographyRules: 'Handheld photography permitted. Respect archaeological boundaries inside cave chambers.',
    entryFee: 'Free entry',
    bestTime: 'Morning 9:30 AM for soft sunlight illuminating the ancient stone inscriptions',
    insiderTip: 'Visit the Rudreshwar Temple next to the falls where centuries-old stone bathing ghats overlook the mist.',
    nearestBusStand: 'Sanquelim Bus Stand (2 km away)',
    busRoute: 'Panaji or Mapusa to Sanquelim direct bus, short auto to caves',
  },
];

const FILTER_TAGS = [
  'All',
  'Uncrowded',
  'Popular',
  'Adventure',
  'Heritage',
  'Cultural',
  'Forts',
  'Beaches',
  'Nature & Hills',
];

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  preferences,
  onBack,
  onSelectDestination,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [userLocality, setUserLocality] = useState<string>('Calangute, North Goa');

  // Determine user's selected tourism preferences from onboarding
  const userInterests = preferences.tourismTypes || ['Heritage Tourism', 'Cultural Tourism'];
  const hasHeritage = userInterests.includes('Heritage Tourism');
  const hasCultural = userInterests.includes('Cultural Tourism');

  // Retrieve user location region for dynamic distance calculation
  const [userRegion, setUserRegion] = useState<'north' | 'panaji' | 'south'>('north');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('goamitra_accurate_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.placeName) {
          setUserLocality(parsed.placeName.split('(')[0].trim() || 'North Goa');
        }
        if (parsed.lat) {
          if (parsed.lat < 15.35) setUserRegion('south');
          else if (parsed.lat >= 15.42 && parsed.lat <= 15.48) setUserRegion('panaji');
          else setUserRegion('north');
        }
      }
    } catch {}
  }, []);

  // Filter destinations based strictly on onboarding tourism preference
  const preferenceFiltered = ALL_DESTINATIONS.filter((item) => {
    // If user ONLY selected Cultural Tourism:
    // "for cultural dont include ford etc" -> exclude forts & pure heritage
    if (hasCultural && !hasHeritage) {
      if (item.category === 'fort') return false;
      if (item.tourismType === 'Heritage Tourism') return false;
      return true;
    }

    // If user ONLY selected Heritage Tourism:
    // "and for heritage dont include cultural sites" -> exclude cultural sites & village folk
    if (hasHeritage && !hasCultural) {
      if (item.category === 'cultural') return false;
      if (item.tourismType === 'Cultural Tourism') return false;
      return true;
    }

    // If user selected BOTH: show both!
    return true;
  });

  // Then apply user's clicked filter chip
  const displayedDestinations = preferenceFiltered.filter((item) => {
    if (selectedTag === 'All') return true;
    if (selectedTag === 'Uncrowded') return item.tags.some((t) => t.toLowerCase().includes('uncrowded') || t.toLowerCase().includes('secluded'));
    if (selectedTag === 'Popular') return item.matchBadge === 'Popular';
    if (selectedTag === 'Adventure') return item.tags.some((t) => t.toLowerCase().includes('trek') || t.toLowerCase().includes('hill') || t.toLowerCase().includes('waterfall'));
    if (selectedTag === 'Heritage') return item.category === 'heritage' || item.category === 'fort' || item.tourismType === 'Heritage Tourism';
    if (selectedTag === 'Cultural') return item.category === 'cultural' || item.tourismType === 'Cultural Tourism';
    if (selectedTag === 'Forts') return item.category === 'fort';
    if (selectedTag === 'Beaches') return item.category === 'beach';
    if (selectedTag === 'Nature & Hills') return item.category === 'nature_waterfall' || item.category === 'hill_mountain';
    return true;
  });

  // Calculate dynamic minutes from user's stay
  const getMinutesFromStay = (item: DestinationItem) => {
    if (userRegion === 'south') return item.minutesFromSouthGoa;
    if (userRegion === 'panaji') return item.minutesFromPanaji;
    return item.minutesFromNorthGoa;
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-start max-w-[430px] mx-auto select-none relative w-full">
      {/* 1. Sticky Top Navigation Bar (Profile icon removed, balanced right spacer) */}
      <header className="sticky top-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
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
          Destinations
        </h1>

        {/* Right Balance Spacer (Profile only on homescreen) */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Unified Scroll Body Container */}
      <div className="px-4 pt-3 pb-8 space-y-4 w-full flex-1">
        {/* Filter Pills Bar */}
        <div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {FILTER_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-bold border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'border-[#177F91] bg-[#EAF5F7] text-[#177F91] shadow-xs'
                      : 'border-gray-200/90 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tag === 'Uncrowded' && <span>🍃</span>}
                  {tag === 'Popular' && <span>👥</span>}
                  {tag === 'Adventure' && <span>⛰️</span>}
                  {tag === 'Heritage' && <span>🏛️</span>}
                  {tag === 'Cultural' && <span>🎨</span>}
                  {tag === 'Forts' && <span>🏰</span>}
                  {tag === 'Beaches' && <span>🏖️</span>}
                  {tag === 'Nature & Hills' && <span>🌿</span>}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Card: "Beyond the obvious." */}
        <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[175px] flex items-end p-5">
          <img
            src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&auto=format&fit=crop&q=80"
            alt="Reis Magos Fort Sunset"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Hero Copy */}
          <div className="relative z-10 text-white w-full">
            <h2 className="text-[22px] font-black tracking-tight leading-tight drop-shadow-sm">
              Beyond the obvious.
            </h2>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[13px] font-medium text-white/90 drop-shadow-xs">
                Spots that actually match your trip.
              </p>
              <div className="text-[11px] font-semibold text-white/80 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <span>📍</span>
                <span>Reis Magos Fort</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips / Restrictions Alert Banner */}
        <div className="rounded-2xl bg-[#FFF8EE] border border-[#FDE68A] p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">⚠️</span>
            <div className="text-[12px] font-semibold text-[#92400E] leading-tight">
              <span>Some spots have seasonal restrictions — check before you go.</span>
            </div>
          </div>
          <span className="text-gray-400 text-sm font-bold ml-1">›</span>
        </div>

        {/* Selected Tourism Preference Indicator */}
        <div className="flex items-center justify-between px-1 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#177F91]" />
            <span className="font-bold text-gray-800">
              {hasHeritage && hasCultural
                ? 'Curated for Heritage & Cultural Exploration'
                : hasCultural
                ? 'Curated for Living Cultural Traditions (No forts)'
                : 'Curated for Historic Heritage & Forts'}
            </span>
          </div>
          <span>Near {userLocality}</span>
        </div>

        {/* Destinations List Cards: Tapping any card redirects to Travel page */}
        <div className="space-y-3.5 pt-1">
          {displayedDestinations.map((item) => {
            const minutesFromStay = getMinutesFromStay(item);

            return (
              <div
                key={item.id}
                onClick={() => onSelectDestination(item)}
                className="bg-white rounded-3xl p-3 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md active:scale-[0.99] transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Main Card Top Section: Real Image on Left + Info on Right */}
                <div className="flex items-start gap-3.5">
                  {/* Genuine Outdoor Landmark Image */}
                  <div className="relative w-[115px] h-[115px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Category Tag */}
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9.5px] font-bold text-white capitalize">
                      {item.category.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Right Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-[115px]">
                    <div>
                      {/* Top Badges (Half-day badge removed per request) */}
                      <div className="flex items-center justify-between gap-1">
                        {item.matchBadge === 'Best match' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                            <span>★</span>
                            <span>Best match</span>
                          </span>
                        )}
                        {item.matchBadge === 'Popular' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded-full">
                            <span>👥</span>
                            <span>Popular</span>
                          </span>
                        )}
                        {item.matchBadge === 'Hidden gem' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                            <span>🌱</span>
                            <span>Hidden gem</span>
                          </span>
                        )}
                        {item.matchBadge === 'Scenic pick' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                            <span>📸</span>
                            <span>Scenic pick</span>
                          </span>
                        )}

                        {/* Travel Link Cue */}
                        <span className="text-[10px] font-bold text-[#177F91] bg-[#EAF5F7] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <span>Rides</span>
                          <span>↗</span>
                        </span>
                      </div>

                      {/* Destination Name */}
                      <h3 className="text-[16.5px] font-extrabold text-gray-900 tracking-tight leading-tight mt-1 truncate">
                        {item.name}
                      </h3>

                      {/* Distance From Stay */}
                      <div className="flex items-center gap-1 text-[11.5px] font-semibold text-gray-600 mt-0.5">
                        <span>📍</span>
                        <span>{minutesFromStay} min from your stay</span>
                      </div>

                      {/* Concise 2-line Description */}
                      <p className="text-[11.5px] text-gray-500 leading-snug line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Warning Pill if present */}
                    {item.warningNote && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-md truncate max-w-full">
                          <span>!</span>
                          <span className="truncate">{item.warningNote}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Tag Specs: e.g. Ferry ride · Heritage · Uncrowded */}
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-gray-500 text-[11px] font-semibold">
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 shrink-0">
                        {tag.toLowerCase().includes('ferry') && <span>⛴</span>}
                        {tag.toLowerCase().includes('fort') && <span>🏰</span>}
                        {tag.toLowerCase().includes('heritage') && <span>🏛</span>}
                        {tag.toLowerCase().includes('uncrowded') && <span>🍃</span>}
                        {tag.toLowerCase().includes('sunset') && <span>🌅</span>}
                        {tag.toLowerCase().includes('village') && <span>🏡</span>}
                        {tag.toLowerCase().includes('trek') && <span>🥾</span>}
                        {tag.toLowerCase().includes('waterfall') && <span>🌊</span>}
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Open Chevron */}
                  <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 12l4-4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
