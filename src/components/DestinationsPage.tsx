import React, { useState, useEffect } from 'react';
import { UserPreferences, SavedPlaceItem } from '../types/onboarding';

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
  savedPlaces?: SavedPlaceItem[];
  onToggleSavePlace?: (place: SavedPlaceItem) => void;
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
    image: 'https://media.assettype.com/deccanherald%2F2024-05%2F43de3cf9-97d2-4a57-9d99-16b75841ee2d%2Ffile7v4ykn10tol18133slbx.jpg?rect=0%2C0%2C3884%2C2185&w=900&auto=format%2Ccompress&fit=max',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs9XuaGRZEyDHlGsBFK_Kn8tUkboP680ONAg54kRXc5A&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKMJ_DUcCIEgzzaT5y9BnbhrHmZPBKnPV05ngT3ooXjA&s=10',
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
    name: 'Cabo de Rama Fort & Beach',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXk_BLnRDZOud5fHPuE8nagVcIMuLlvYB53UfxNFb2mg&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk1dCYTxIxIH6mPBdAoAHGZ9fL9Zrx68tDIVYfOmxmU58xjC2bkWX9Hqeo&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIUyveEhEJc5vkBySEHkiSn_cULHPjnJGaG-L3ijFeWg&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGruvdlZpsZHqTMvPlz30Z9XRGyEkFyryoqZQksy0ZZw&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSetPEyxFF7KmpZWIgdr-oVZsrt5ZMz8JlpzzNwIduptA&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv6e96ErV9Uy6WDDxz2zG6t_DkV792n32E9BSxC8q7aA&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfirU-IQVUZYVAqI0nbpRmEHg-BQnvveVpM0I1v9HB_g&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtRS8DuIp869LP6p56lZSXpb9S2-2CWobRjqB__hXyCg&s=10',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRT8AdLZ5xXKqdGfbIrEkDVQ26K_njFpmxEMuW00VbqA&s=10',
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
  savedPlaces = [],
  onToggleSavePlace,
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
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between select-none relative overflow-hidden w-full">
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
          Destinations
        </h1>

        {/* Right Balance Spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Scrollable Body Container (Header stays 100% fixed) */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3 pb-8 space-y-4 min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
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
                  {tag === 'Uncrowded' && (
                    <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  )}
                  {tag === 'Popular' && (
                    <svg className="w-3.5 h-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                  {tag === 'Adventure' && (
                    <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                    </svg>
                  )}
                  {tag === 'Heritage' && (
                    <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="2" y1="22" x2="22" y2="22" />
                      <path d="M4 6h16l-8-4-8 4z" />
                      <line x1="6" y1="10" x2="6" y2="18" />
                      <line x1="10" y1="10" x2="10" y2="18" />
                      <line x1="14" y1="10" x2="14" y2="18" />
                      <line x1="18" y1="10" x2="18" y2="18" />
                    </svg>
                  )}
                  {tag === 'Cultural' && (
                    <svg className="w-3.5 h-3.5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                    </svg>
                  )}
                  {tag === 'Forts' && (
                    <svg className="w-3.5 h-3.5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18" />
                      <path d="M5 21V5l2-2 2 2v2h6V5l2-2 2 2v16" />
                      <path d="M9 10h6" />
                      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
                    </svg>
                  )}
                  {tag === 'Beaches' && (
                    <svg className="w-3.5 h-3.5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v18" />
                      <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z" />
                      <path d="M12 21a2 2 0 0 0 2-2" />
                    </svg>
                  )}
                  {tag === 'Nature & Hills' && (
                    <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22v-7" />
                      <path d="M12 15a6 6 0 0 0-6-6c0 3.3 2.7 6 6 6Z" />
                      <path d="M12 15a6 6 0 0 1 6-6c0 3.3-2.7 6-6 6Z" />
                    </svg>
                  )}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Card: "Beyond the obvious." */}
        <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[175px] flex items-end p-5">
          <img
            src="https://media.assettype.com/deccanherald%2F2024-05%2F43de3cf9-97d2-4a57-9d99-16b75841ee2d%2Ffile7v4ykn10tol18133slbx.jpg?rect=0%2C0%2C3884%2C2185&w=900&auto=format%2Ccompress&fit=max"
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
                <svg className="w-3 h-3 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Reis Magos Fort</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips / Restrictions Alert Banner */}
        <div className="rounded-2xl bg-[#FFF8EE] border border-[#FDE68A] p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
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
                            <svg className="w-3 h-3 fill-current text-[#0284C7]" viewBox="0 0 24 24">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span>Best match</span>
                          </span>
                        )}
                        {item.matchBadge === 'Popular' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3 text-[#0D9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                            </svg>
                            <span>Popular</span>
                          </span>
                        )}
                        {item.matchBadge === 'Hidden gem' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3 text-[#15803D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22v-7" />
                              <path d="M12 15a6 6 0 0 0-6-6c0 3.3 2.7 6 6 6Z" />
                              <path d="M12 15a6 6 0 0 1 6-6c0 3.3-2.7 6-6 6Z" />
                            </svg>
                            <span>Hidden gem</span>
                          </span>
                        )}
                        {item.matchBadge === 'Scenic pick' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>Scenic pick</span>
                          </span>
                        )}

                        {/* Heart / Save Button */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleSavePlace) {
                                onToggleSavePlace({
                                  id: item.id,
                                  title: item.name,
                                  category: 'destination',
                                  subtitle: item.category,
                                  location: item.location,
                                  image: item.image,
                                  ratingOrPrice: `${item.distanceKm} km away`,
                                });
                              }
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                              savedPlaces.some((p) => p.id === item.id)
                                ? 'bg-red-500 text-white shadow-sm scale-105'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                            title="Save to My Goa"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </button>

                          {/* Travel Link Cue */}
                          <span className="text-[10px] font-bold text-[#177F91] bg-[#EAF5F7] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>Rides</span>
                            <svg className="w-2.5 h-2.5 text-[#177F91]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* Destination Name */}
                      <h3 className="text-[16.5px] font-extrabold text-gray-900 tracking-tight leading-tight mt-1 truncate">
                        {item.name}
                      </h3>

                      {/* Distance From Stay */}
                      <div className="flex items-center gap-1 text-[11.5px] font-semibold text-gray-600 mt-0.5">
                        <svg className="w-3 h-3 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
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
                <div className="mt-2.5 pt-2 flex items-center justify-between text-gray-500 text-[11px] font-semibold">
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 shrink-0">
                        {tag.toLowerCase().includes('ferry') && (
                          <svg className="w-3 h-3 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
                            <line x1="12" y1="1" x2="12" y2="5" />
                          </svg>
                        )}
                        {tag.toLowerCase().includes('fort') && (
                          <svg className="w-3 h-3 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18" />
                            <path d="M5 21V5l2-2 2 2v2h6V5l2-2 2 2v16" />
                          </svg>
                        )}
                        {tag.toLowerCase().includes('heritage') && (
                          <svg className="w-3 h-3 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="2" y1="22" x2="22" y2="22" />
                            <path d="M4 6h16l-8-4-8 4z" />
                            <line x1="6" y1="10" x2="6" y2="18" />
                            <line x1="10" y1="10" x2="10" y2="18" />
                            <line x1="14" y1="10" x2="14" y2="18" />
                            <line x1="18" y1="10" x2="18" y2="18" />
                          </svg>
                        )}
                        {tag.toLowerCase().includes('uncrowded') && (
                          <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                          </svg>
                        )}
                        {tag.toLowerCase().includes('sunset') && (
                          <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 10V2M4.93 10.93 2.1 8.1M19.07 10.93l2.83-2.83M22 17H2M16 17a4 4 0 0 0-8 0" />
                          </svg>
                        )}
                        {tag.toLowerCase().includes('village') && (
                          <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          </svg>
                        )}
                        {tag.toLowerCase().includes('trek') && (
                          <svg className="w-3 h-3 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                          </svg>
                        )}
                        {tag.toLowerCase().includes('waterfall') && (
                          <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                            <path d="M2 14c.6.5 1.2 1 2.5 1C7 15 7 13 9.5 13c1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                          </svg>
                        )}
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
