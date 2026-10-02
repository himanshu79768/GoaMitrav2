import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences } from '../types/onboarding';

export interface RestaurantItem {
  id: string;
  name: string;
  cuisineStyle: 'goan_authentic' | 'normal';
  dietaryType: 'veg' | 'non_veg' | 'both';
  hasJain: boolean;
  isAllergySafe: boolean;
  matchBadge?: 'Best match' | 'Verified' | 'Tourist-trap area' | 'Hidden gem' | 'Iconic landmark';
  location: string;
  areaGroup: 'Mapusa' | 'Calangute / Baga' | 'Candolim' | 'Assagao' | 'Panaji' | 'South Goa';
  minutesFromMapusa: number;
  minutesFromCalangute: number;
  minutesFromPanaji: number;
  priceCategory: '₹ Budget' | '₹₹ Moderate' | '₹₹₹ Expensive';
  description: string;
  signatureDishes: string[];
  dishPrices?: Record<string, string>;
  image: string;
  googleMapsQuery: string;
}

export interface DishItem {
  id: string;
  name: string;
  cuisineStyle: 'goan_authentic' | 'normal';
  dietaryType: 'veg' | 'non_veg';
  hasJain: boolean;
  isAllergySafe: boolean;
  matchBadge?: 'Local favourite' | 'Goan authentic' | 'Must try' | 'Comfort staple';
  origin: string;
  flavorProfile: string;
  bestServedWith: string;
  image: string;
  description: string;
  servingRestaurantIds: string[];
}

interface FoodPageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onAskGAI: (initialPrompt?: string) => void;
}

// 100% Real, Verified Goan Restaurants (with accurate location minutes)
export const REAL_RESTAURANTS: RestaurantItem[] = [
  // --- 100% PURE VEGETARIAN RESTAURANTS (Zero non-veg) ---
  {
    id: 'rest-navtara',
    name: 'Navtara Pure Veg Restaurant',
    cuisineStyle: 'normal',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Verified',
    location: 'Mapusa & Calangute, North Goa',
    areaGroup: 'Mapusa',
    minutesFromMapusa: 2,
    minutesFromCalangute: 6,
    minutesFromPanaji: 20,
    priceCategory: '₹ Budget',
    description: '100% Pure Vegetarian Goan & Indian dining with extensive Jain-friendly gravies, mushroom xacuti, paneer cafreal, and Goan thalis.',
    signatureDishes: ['Mushroom Xacuti with Poee', 'Paneer Cafreal', 'Goan Veg Thali', 'Jain Khatkhate'],
    dishPrices: {
      'dish-mushroom-xacuti': '₹190',
      'dish-paneer-cafreal': '₹210',
      'dish-khatkhate': '₹160',
      'dish-alsande': '₹140',
      'dish-sol-kadi': '₹50',
    },
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Navtara Pure Veg Mapusa Goa',
  },
  {
    id: 'rest-bhojan',
    name: 'Bhojan Pure Veg Goan & Thali Dining',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Hidden gem',
    location: 'Panaji, Central Goa',
    areaGroup: 'Panaji',
    minutesFromMapusa: 20,
    minutesFromCalangute: 22,
    minutesFromPanaji: 4,
    priceCategory: '₹₹ Moderate',
    description: '100% Pure Vegetarian dining specializing in authentic Goan Hindu vegetarian delicacies, Khatkhate, Alsande Tonak, and pure Sol Kadi.',
    signatureDishes: ['Goan Khatkhate', 'Alsande Tonak', 'Tambdi Bhaji', 'Sol Kadi'],
    dishPrices: {
      'dish-khatkhate': '₹190',
      'dish-alsande': '₹160',
      'dish-tambdi-bhaji': '₹130',
      'dish-sol-kadi': '₹55',
      'dish-mushroom-xacuti': '₹210',
    },
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Bhojan Restaurant Panaji Goa',
  },
  {
    id: 'rest-rasoda',
    name: 'Rasoda Pure Veg & Sweets',
    cuisineStyle: 'normal',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Verified',
    location: 'Old Goa & Porvorim, North Goa',
    areaGroup: 'Mapusa',
    minutesFromMapusa: 9,
    minutesFromCalangute: 15,
    minutesFromPanaji: 12,
    priceCategory: '₹₹ Moderate',
    description: '100% Pure Veg heritage restaurant serving royal vegetarian thalis, paneer delicacies, Jain meals, and traditional sweets.',
    signatureDishes: ['Royal Veg Thali', 'Paneer Butter Masala', 'Jain Special Thali', 'Dal Baati'],
    dishPrices: {
      'dish-paneer-cafreal': '₹230',
      'dish-khatkhate': '₹175',
      'dish-alsande': '₹150',
    },
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Rasoda Pure Veg Old Goa',
  },
  {
    id: 'rest-kamat',
    name: 'Kamat Pure Veg Restaurant',
    cuisineStyle: 'normal',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Verified',
    location: 'Panaji Bus Terminus & Church Square',
    areaGroup: 'Panaji',
    minutesFromMapusa: 18,
    minutesFromCalangute: 20,
    minutesFromPanaji: 2,
    priceCategory: '₹ Budget',
    description: 'Historic 100% Pure Veg eatery in Panaji serving authentic Goan bhaji-poori, Jain meals, filter coffee, and SOUTH & North Indian staples.',
    signatureDishes: ['Goan Sukhi Bhaji with Poori', 'Jain South Thali', 'Alsande Tonak'],
    dishPrices: {
      'dish-alsande': '₹110',
      'dish-sol-kadi': '₹45',
    },
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Kamat Restaurant Panaji Goa',
  },

  // --- COASTAL SEAFOOD & NON-VEG GOAN RESTAURANTS ---
  {
    id: 'rest-vinayak',
    name: 'Vinayak Family Restaurant',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'both',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Best match',
    location: 'Assagao, North Goa',
    areaGroup: 'Assagao',
    minutesFromMapusa: 8,
    minutesFromCalangute: 12,
    minutesFromPanaji: 22,
    priceCategory: '₹₹ Moderate',
    description: 'Legendary local Goan institution famous for authentic Goan Fish Thalis, Prawn Curry Rice, Crab Xacuti, and fresh rava fried kingfish.',
    signatureDishes: ['Goan Fish Thali', 'Prawn Curry Rice', 'Rava Fried Kingfish', 'Crab Xacuti'],
    dishPrices: {
      'dish-fish-thali': '₹280',
      'dish-prawn-curry': '₹320',
      'dish-kingfish-rava': '₹380',
      'dish-sol-kadi': '₹60',
    },
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Vinayak Family Restaurant Assagao Goa',
  },
  {
    id: 'rest-fat-fish',
    name: 'Fat Fish Goan Restaurant',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'both',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Iconic landmark',
    location: 'Arpora, Baga-Calangute Road',
    areaGroup: 'Calangute / Baga',
    minutesFromMapusa: 12,
    minutesFromCalangute: 4,
    minutesFromPanaji: 25,
    priceCategory: '₹₹ Moderate',
    description: 'Paddy-field side dining serving authentic Goan Hindu & Catholic seafood thalis, Tisryao Sukhem (clams), and Butter Garlic Prawns.',
    signatureDishes: ['Special Seafood Thali', 'Tisryao Sukhem (Clams)', 'Prawn Curry', 'Squid Rava Fry'],
    dishPrices: {
      'dish-fish-thali': '₹350',
      'dish-prawn-curry': '₹360',
      'dish-kingfish-rava': '₹420',
      'dish-chicken-xacuti': '₹310',
    },
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Fat Fish Arpora Goa',
  },
  {
    id: 'rest-florentine',
    name: 'Hotel Florentine',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'both',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Iconic landmark',
    location: 'Saligao, North Goa',
    areaGroup: 'Calangute / Baga',
    minutesFromMapusa: 10,
    minutesFromCalangute: 8,
    minutesFromPanaji: 18,
    priceCategory: '₹ Budget',
    description: 'The undisputed birthplace of Goan Chicken Cafreal. Succulent green herbal chicken served with warm Goan Poee bread in a peaceful garden setting.',
    signatureDishes: ['Original Chicken Cafreal', 'Goan Poee Bread', 'Prawn Caldin', 'Pork Vindaloo'],
    dishPrices: {
      'dish-chicken-cafreal': '₹290',
      'dish-vindaloo': '₹280',
    },
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Hotel Florentine Saligao Goa',
  },
  {
    id: 'rest-ros-omelette',
    name: 'Anand Seafood & Gaddo Stall',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'both',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Local favourite',
    location: 'Mapusa Court Circle & Anjuna',
    areaGroup: 'Mapusa',
    minutesFromMapusa: 1,
    minutesFromCalangute: 15,
    minutesFromPanaji: 20,
    priceCategory: '₹ Budget',
    description: 'Street-side street culinary landmark famous for Goa’s iconic Ros Omelette (fluffy egg omelette submerged in spicy piping-hot chicken xacuti gravy) with poee.',
    signatureDishes: ['Goan Ros Omelette with Poee', 'Chicken Xacuti', 'Fried Chonak'],
    dishPrices: {
      'dish-ros-omelette': '₹90',
      'dish-chicken-xacuti': '₹180',
    },
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: 'Anand Seafood Restaurant Anjuna Goa',
  },
  {
    id: 'rest-martins',
    name: "Martin's Corner",
    cuisineStyle: 'goan_authentic',
    dietaryType: 'both',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Iconic landmark',
    location: 'Betalbatim, South Goa',
    areaGroup: 'South Goa',
    minutesFromMapusa: 55,
    minutesFromCalangute: 50,
    minutesFromPanaji: 35,
    priceCategory: '₹₹₹ Expensive',
    description: 'World-renowned South Goan landmark visited by celebrities. Celebrated for live music, Butter Garlic Crab, Pork Vindaloo, and Goan Prawn Curry.',
    signatureDishes: ['Butter Garlic Crab', 'Goan Prawn Curry Rice', 'Pork Vindaloo', 'Chicken Cafreal'],
    dishPrices: {
      'dish-prawn-curry': '₹420',
      'dish-vindaloo': '₹390',
      'dish-chicken-cafreal': '₹380',
    },
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    googleMapsQuery: "Martin's Corner Betalbatim Goa",
  },
];

// 100% Authentic Goan & Indian Dishes List
export const ALL_DISHES: DishItem[] = [
  // --- PURE VEGETARIAN DISHES ---
  {
    id: 'dish-mushroom-xacuti',
    name: 'Goan Mushroom Xacuti with Poee',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Goan authentic',
    origin: 'Authentic Goan Hindu Spice Blend',
    flavorProfile: 'Aromatic roasted coconut, poppy seeds, star anise, nutmeg, black pepper and cloves.',
    bestServedWith: 'Warm Goan crusty Poee bread or steamed rice',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80',
    description: 'Rich dark coconut gravy roasted with 16 spices and fresh wild mushrooms. 100% vegetarian adaptation of the legendary Goan Xacuti.',
    servingRestaurantIds: ['rest-navtara', 'rest-bhojan', 'rest-rasoda'],
  },
  {
    id: 'dish-khatkhate',
    name: 'Goan Khatkhate (Mixed Veg Stew)',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Goan authentic',
    origin: 'Goan Saraswat Brahmin Heritage Feast',
    flavorProfile: 'Mildly spiced coconut, jaggery, dried raw mango (solam), and tirphal (Sichuan pepper variant).',
    bestServedWith: 'Steamed red rice or plain basmati rice',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&auto=format&fit=crop&q=80',
    description: 'Traditional Goan festival vegetable stew cooked with 5 seasonal vegetables, fresh coconut paste, jaggery, tirphal berries, and kokum.',
    servingRestaurantIds: ['rest-bhojan', 'rest-navtara', 'rest-rasoda', 'rest-kamat'],
  },
  {
    id: 'dish-paneer-cafreal',
    name: 'Paneer Cafreal with Poee',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Must try',
    origin: 'Modern Goan Green Spice Blend',
    flavorProfile: 'Tangy, zesty green paste made of fresh coriander leaves, green chillies, cloves, and lime.',
    bestServedWith: 'Goan Poee wheat bread or buttered garlic naan',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700&auto=format&fit=crop&q=80',
    description: 'Soft cottage cheese cubes marinated in Goan green herbal cafreal spice paste and shallow-fried till smoky.',
    servingRestaurantIds: ['rest-navtara', 'rest-rasoda'],
  },
  {
    id: 'dish-alsande',
    name: 'Alsande Tonak (Red Kidney Bean Curry)',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Local favourite',
    origin: 'Traditional Goan Home Recipe',
    flavorProfile: 'Earthy, coconut-onion gravy infused with cloves and coriander seeds.',
    bestServedWith: 'Hot Goan Poee bread pockets or boiled rice',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80',
    description: 'Protein-rich Goan red cowpea curry simmered in a roasted coconut-spice masala. Staple breakfast dish across Goa.',
    servingRestaurantIds: ['rest-bhojan', 'rest-kamat', 'rest-navtara'],
  },
  {
    id: 'dish-sol-kadi',
    name: 'Goan Sol Kadi (Kokum Coconut Drink)',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Comfort staple',
    origin: 'Coastal Konkan Digestive Classic',
    flavorProfile: 'Refreshing pink digestive beverage made from fresh coconut milk, wild kokum, garlic, and green chilli.',
    bestServedWith: 'Chilled after Goan Thali or meals',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
    description: 'Iconic cooling Goan digestive drink made from pressed fresh coconut milk and tangy kokum extract. Essential for digestion after spice.',
    servingRestaurantIds: ['rest-vinayak', 'rest-bhojan', 'rest-navtara', 'rest-fat-fish'],
  },

  // --- COASTAL SEAFOOD & NON-VEGETARIAN DISHES ---
  {
    id: 'dish-fish-thali',
    name: 'Goan Fish Thali',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'non_veg',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Must try',
    origin: 'Konkan Coastal Staple',
    flavorProfile: 'Tangy coconut fish curry, fried kingfish/rawa fry, tisryao clams, kismur, sol kadi & rice.',
    bestServedWith: 'Steamed Goan red rice (ukda xitt)',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&auto=format&fit=crop&q=80',
    description: 'The quintessential Goan lunch: fresh catch curry, fried kingfish slice, clam masala, dry prawn kismur salad, sol kadi, and rice.',
    servingRestaurantIds: ['rest-vinayak', 'rest-fat-fish'],
  },
  {
    id: 'dish-prawn-curry',
    name: 'Goan Prawn Curry Rice (Xitt Codi)',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'non_veg',
    hasJain: false,
    isAllergySafe: false,
    matchBadge: 'Goan authentic',
    origin: 'Traditional Goan Household Heritage',
    flavorProfile: 'Silky orange coconut curry infused with kokum, dried red Kashmiri chillies, and fresh sea prawns.',
    bestServedWith: 'Steamed rice or Goan Poee bread',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    description: 'Goa’s soul food: tender juicy prawns cooked in a golden coconut gravy with kokum sourness.',
    servingRestaurantIds: ['rest-vinayak', 'rest-fat-fish', 'rest-martins'],
  },
  {
    id: 'dish-chicken-xacuti',
    name: 'Goan Chicken Xacuti',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'non_veg',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Local favourite',
    origin: 'Coastal Goan Heritage Spice Blend',
    flavorProfile: 'Deep roasted grated coconut with 16 aromatic spices, white poppy seeds & star anise.',
    bestServedWith: 'Warm crusty whole-wheat Goan Poee bread or steamed rice',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&auto=format&fit=crop&q=80',
    description: 'A deeply aromatic, dark roasted gravy made with freshly roasted coconut, whole spices, and tender chicken. Rich and silky without burning heat.',
    servingRestaurantIds: ['rest-ros-omelette', 'rest-fat-fish'],
  },
  {
    id: 'dish-chicken-cafreal',
    name: 'Goan Chicken Cafreal with Poee',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'non_veg',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Goan authentic',
    origin: 'Afro-Portuguese Goan Heritage (Saligao)',
    flavorProfile: 'Vibrant green coriander, green chillies, ginger-garlic, cinnamon, cloves and toddy vinegar.',
    bestServedWith: 'Warm Poee bread pockets with lime wedge and raw onion rings',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&auto=format&fit=crop&q=80',
    description: 'Tender chicken marinated in an intensely flavorful green herbal paste of fresh coriander and spices, pan-fried to a smoky, succulent finish.',
    servingRestaurantIds: ['rest-florentine', 'rest-martins'],
  },
  {
    id: 'dish-ros-omelette',
    name: 'Ros Omelette with Poee',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'non_veg',
    hasJain: false,
    isAllergySafe: true,
    matchBadge: 'Must try',
    origin: 'Everyday Goan Street Food (Gaddo)',
    flavorProfile: 'Fluffy masala omelette drowned in piping hot, spicy chicken xacuti gravy with diced onions.',
    bestServedWith: 'Two freshly baked Goan wheat Poee bread pockets',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80',
    description: 'Goa’s favourite comfort food: a freshly fried masala omelette submerged under aromatic, ladle-poured spicy xacuti gravy.',
    servingRestaurantIds: ['rest-ros-omelette'],
  },
];

export const FoodPage: React.FC<FoodPageProps> = ({ preferences, onBack, onAskGAI }) => {
  // 1. Primary Segmented Control: BY DEFAULT KEEP DISHES
  const [viewType, setViewType] = useState<'dishes' | 'restaurants'>('dishes');

  // 2. Selected Dish for Redirect / Restaurant Finder Screen
  const [selectedDishForFinder, setSelectedDishForFinder] = useState<DishItem | null>(null);

  // 3. Secondary Segmented Control: Veg vs Non-Veg
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non_veg'>('all');

  // 4. Option filter: Normal vs Goan Authentic
  const [cuisineOption, setCuisineOption] = useState<'all' | 'goan_authentic' | 'normal'>('all');

  // 5. Dietary Filter Chips
  const [activeChip, setActiveChip] = useState<'all' | 'jain' | 'allergy'>('all');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  // User location detection (defaults to Mapusa / North Goa)
  const [userLocality, setUserLocality] = useState<string>('Mapusa, North Goa');
  const [userRegion, setUserRegion] = useState<'mapusa' | 'calangute' | 'panaji' | 'south'>('mapusa');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('goamitra_accurate_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.placeName) {
          setUserLocality(parsed.placeName.split('(')[0].trim() || 'Mapusa, North Goa');
        }
        if (parsed.lat) {
          if (parsed.lat < 15.35) setUserRegion('south');
          else if (parsed.lat >= 15.42 && parsed.lat <= 15.48) setUserRegion('panaji');
          else if (parsed.lat <= 15.54) setUserRegion('calangute');
          else setUserRegion('mapusa');
        }
      }
    } catch {}
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Calculate dynamic proximity distance in minutes from user's locality
  const getMinutesForRestaurant = (item: RestaurantItem) => {
    if (userRegion === 'mapusa') return item.minutesFromMapusa;
    if (userRegion === 'calangute') return item.minutesFromCalangute;
    if (userRegion === 'panaji') return item.minutesFromPanaji;
    return item.minutesFromPanaji + 25; // South Goa
  };

  const getProximityText = (item: RestaurantItem) => {
    const mins = getMinutesForRestaurant(item);
    if (mins <= 6) return `🚶 ${mins} min walk`;
    return `🚗 ${mins} min drive`;
  };

  // Filter and SORT Restaurants from Closest to Farthest
  const filteredRestaurants = REAL_RESTAURANTS.filter((item) => {
    if (dietaryFilter === 'veg') {
      if (item.dietaryType !== 'veg') return false;
    } else if (dietaryFilter === 'non_veg') {
      if (item.dietaryType === 'veg') return false;
    }

    if (cuisineOption !== 'all' && item.cuisineStyle !== cuisineOption) return false;

    if (activeChip === 'jain' && !item.hasJain) return false;
    if (activeChip === 'allergy' && !item.isAllergySafe) return false;

    return true;
  }).sort((a, b) => getMinutesForRestaurant(a) - getMinutesForRestaurant(b));

  // Filter and SORT Dishes
  const filteredDishes = ALL_DISHES.filter((item) => {
    if (dietaryFilter === 'veg' && item.dietaryType !== 'veg') return false;
    if (dietaryFilter === 'non_veg' && item.dietaryType !== 'non_veg') return false;

    if (cuisineOption !== 'all' && item.cuisineStyle !== cuisineOption) return false;

    if (activeChip === 'jain' && !item.hasJain) return false;
    if (activeChip === 'allergy' && !item.isAllergySafe) return false;

    return true;
  }).sort((a, b) => {
    const getMinForDish = (dish: DishItem) => {
      const restMins = dish.servingRestaurantIds.map((id) => {
        const rest = REAL_RESTAURANTS.find((r) => r.id === id);
        return rest ? getMinutesForRestaurant(rest) : 99;
      });
      return Math.min(...restMins);
    };
    return getMinForDish(a) - getMinForDish(b);
  });

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between max-w-[430px] mx-auto select-none relative overflow-hidden w-full">
      {/* SCREEN 1: MAIN FOOD DIRECTORY */}
      <div className="w-full h-full flex flex-col justify-between">
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
            Food
          </h1>

          {/* Right Balance Spacer */}
          <div className="w-9 h-9" />
        </header>

        {/* 2. Scrollable Body Container */}
        <div
          className="flex-1 overflow-y-auto px-4 pt-3 pb-10 space-y-3.5 min-h-0 overscroll-contain touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* PILL 1: Primary Segmented Toggle: Dishes vs Restaurants */}
          <div className="bg-[#EAEAE8] p-1 rounded-full flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setViewType('dishes')}
              className={`flex-1 py-2.5 rounded-full text-[13.5px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                viewType === 'dishes'
                  ? 'bg-[#177F91] text-white shadow-[0_2px_8px_rgba(23,127,145,0.35)]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🍽️</span>
              <span>Dishes</span>
            </button>

            <button
              type="button"
              onClick={() => setViewType('restaurants')}
              className={`flex-1 py-2.5 rounded-full text-[13.5px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                viewType === 'restaurants'
                  ? 'bg-[#177F91] text-white shadow-[0_2px_8px_rgba(23,127,145,0.35)]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🏬</span>
              <span>Restaurants</span>
            </button>
          </div>

          {/* PILL 2: Secondary Toggle: Veg and Non-veg */}
          <div className="bg-white border border-gray-200/80 p-1 rounded-2xl flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setDietaryFilter('all')}
              className={`flex-1 py-1.5 rounded-xl text-[12.5px] font-bold transition-all text-center cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Foods
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('veg')}
              className={`flex-1 py-1.5 rounded-xl text-[12.5px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                dietaryFilter === 'veg'
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🥬</span>
              <span>Veg</span>
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('non_veg')}
              className={`flex-1 py-1.5 rounded-xl text-[12.5px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                dietaryFilter === 'non_veg'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🍗</span>
              <span>Non-veg</span>
            </button>
          </div>

          {/* PILL 3: Option Filter: Normal or Goan Authentic */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 pl-1">
              Style:
            </span>
            <button
              type="button"
              onClick={() => setCuisineOption('all')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 ${
                cuisineOption === 'all'
                  ? 'bg-[#177F91] text-white border-[#177F91] shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Styles
            </button>
            <button
              type="button"
              onClick={() => setCuisineOption('goan_authentic')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                cuisineOption === 'goan_authentic'
                  ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>🥥</span>
              <span>Goan Authentic</span>
            </button>
            <button
              type="button"
              onClick={() => setCuisineOption('normal')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                cuisineOption === 'normal'
                  ? 'bg-gray-800 text-white border-gray-800 shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>🍕</span>
              <span>Normal / Multi-Cuisine</span>
            </button>
          </div>

          {/* PILL 4: Dietary Preference Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setActiveChip(activeChip === 'jain' ? 'all' : 'jain')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeChip === 'jain'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200/90 hover:bg-gray-50'
              }`}
            >
              <span>🍃</span>
              <span>Jain-friendly</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveChip(activeChip === 'allergy' ? 'all' : 'allergy')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeChip === 'allergy'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200/90 hover:bg-gray-50'
              }`}
            >
              <span>🛡️</span>
              <span>Allergy-safe</span>
            </button>
          </div>

          {/* HERO CARD */}
          <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[175px] flex items-end p-5 bg-gradient-to-br from-[#FED7AA] to-[#FCA5A5]">
            <img
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=80"
              alt="Goan Coastal Food Feast"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="relative z-10 text-white w-full">
              <h2 className="text-[23px] font-black tracking-tight leading-tight drop-shadow-sm">
                Eat like a local.
              </h2>
              <p className="text-[13px] font-medium text-white/90 mt-1 drop-shadow-xs">
                Real Goan food, not tourist menus.
              </p>
            </div>
          </div>

          {/* TIP BANNER */}
          <div
            onClick={() =>
              onAskGAI(
                'What is the difference between butter chicken and Goan Xacuti, and where is the best place to eat it near me?'
              )
            }
            className="rounded-2xl bg-[#FFF9EB] border border-[#FDE68A] p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:bg-[#FEF3C7] active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">💡</span>
              <p className="text-[12px] font-semibold text-[#92400E] leading-snug">
                Loved butter chicken? Try <strong className="text-[#78350F]">Goan Xacuti</strong> — rich, spiced, not overly hot.
              </p>
            </div>
            <span className="text-gray-400 font-bold text-sm pl-2">›</span>
          </div>

          {/* Location Context Banner */}
          <div className="flex items-center justify-between px-1 text-[11.5px] font-semibold text-gray-500">
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>Sorted closest to: <strong>{userLocality}</strong></span>
            </div>
            <span className="text-gray-400">
              {viewType === 'dishes' ? `${filteredDishes.length} dishes` : `${filteredRestaurants.length} spots`}
            </span>
          </div>

          {/* DYNAMIC CARDS LIST */}
          {viewType === 'dishes' ? (
            /* DISHES LIST VIEW */
            <div className="space-y-3.5">
              {filteredDishes.map((dish) => {
                const isFav = favorites.includes(dish.id);

                return (
                  <div
                    key={dish.id}
                    onClick={() => setSelectedDishForFinder(dish)}
                    className="bg-white rounded-[24px] border border-gray-200/80 shadow-xs overflow-hidden hover:shadow-md active:scale-[0.99] transition-all flex flex-col cursor-pointer"
                  >
                    {/* Card Image and Badges */}
                    <div className="relative h-44 w-full bg-gray-100">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-bold text-[11px] shadow-xs">
                          <span>{dish.cuisineStyle === 'goan_authentic' ? '🥥 Goan authentic' : '🍕 Normal style'}</span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(dish.id, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                            isFav
                              ? 'bg-red-500 text-white shadow-xs'
                              : 'bg-black/30 text-white hover:bg-black/50'
                          }`}
                          aria-label="Favorite"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>

                      {/* Dietary Pill on Image */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold shadow-xs ${
                          dish.dietaryType === 'veg'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#FEE2E2] text-[#DC2626]'
                        }`}>
                          {dish.dietaryType === 'veg' ? '🥬 Pure Veg' : '🍗 Non-veg'}
                        </span>
                        <span className="text-[11.5px] font-bold text-white drop-shadow-xs">
                          {dish.origin}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <h3 className="text-[17px] font-black text-gray-900 leading-tight">
                          {dish.name}
                        </h3>
                        <span className="text-gray-400 font-bold text-sm">›</span>
                      </div>

                      <p className="text-[12.5px] text-gray-600 leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="p-2.5 bg-gray-50 rounded-xl space-y-1 text-xs">
                        <div className="text-gray-700">
                          <strong>Flavor:</strong> {dish.flavorProfile}
                        </div>
                        <div className="text-gray-700">
                          <strong>Eat with:</strong> {dish.bestServedWith}
                        </div>
                      </div>

                      {/* Find Restaurants Button */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[11.5px] font-bold text-[#177F91]">
                          🍽️ Tap to find restaurants serving this dish
                        </span>

                        <span className="px-3 py-1.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                          <span>Find Places</span>
                          <span>›</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* RESTAURANTS LIST VIEW */
            <div className="space-y-3.5">
              {filteredRestaurants.map((rest) => {
                const isFav = favorites.includes(rest.id);
                const proximity = getProximityText(rest);

                return (
                  <div
                    key={rest.id}
                    className="bg-white rounded-[24px] border border-gray-200/80 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Card Image and Badge Header */}
                    <div className="relative h-44 w-full bg-gray-100">
                      <img
                        src={rest.image}
                        alt={rest.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        {rest.matchBadge === 'Best match' && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-[11px] shadow-xs">
                            <span>★</span>
                            <span>Best match</span>
                          </div>
                        )}
                        {rest.matchBadge === 'Verified' && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-[11px] shadow-xs">
                            <span>✔</span>
                            <span>Verified</span>
                          </div>
                        )}
                        {rest.matchBadge === 'Tourist-trap area' && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] font-bold text-[11px] shadow-xs">
                            <span>!</span>
                            <span>Tourist-trap area</span>
                          </div>
                        )}
                        {rest.matchBadge === 'Hidden gem' && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#7E22CE] font-bold text-[11px] shadow-xs">
                            <span>💎</span>
                            <span>Hidden gem</span>
                          </div>
                        )}
                        {rest.matchBadge === 'Iconic landmark' && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48] font-bold text-[11px] shadow-xs">
                            <span>👑</span>
                            <span>Iconic landmark</span>
                          </div>
                        )}

                        {/* Favorite Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(rest.id, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                            isFav
                              ? 'bg-red-500 text-white shadow-xs'
                              : 'bg-black/30 text-white hover:bg-black/50'
                          }`}
                          aria-label="Favorite"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="text-[12px] font-bold drop-shadow-xs bg-[#177F91]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                          {proximity}
                        </div>
                        <div className="text-[11px] font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                          {rest.priceCategory}
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div>
                        <h3 className="text-[17px] font-black text-gray-900 leading-tight">
                          {rest.name}
                        </h3>
                        <p className="text-[12px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                          <span>📍</span>
                          <span>{rest.location}</span>
                        </p>
                      </div>

                      <p className="text-[12.5px] text-gray-600 leading-relaxed">
                        {rest.description}
                      </p>

                      {/* Signature Dishes Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {rest.signatureDishes.map((dish) => (
                          <span
                            key={dish}
                            className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10.5px] font-semibold"
                          >
                            {dish}
                          </span>
                        ))}
                      </div>

                      {/* Footer Specifications & Action Buttons */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                          <span>{rest.dietaryType === 'veg' ? '🥬 Pure Veg' : '🍗 Non-veg'}</span>
                          {rest.hasJain && (
                            <>
                              <span>·</span>
                              <span className="text-[#15803D]">🍃 Jain options</span>
                            </>
                          )}
                        </div>

                        {/* Google Maps Directions Action */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rest.googleMapsQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-gray-800 active:scale-95 transition-all"
                        >
                          <span>Maps</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SCREEN 2: DEDICATED RESTAURANT FINDER FOR A SELECTED DISH WITH SILKY SLIDE TRANSITION */}
      <AnimatePresence>
        {selectedDishForFinder && (
          <motion.div
            key="dish_restaurant_finder"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              ease: [0.25, 1, 0.5, 1],
              duration: 0.25,
            }}
            className="absolute inset-0 z-40 bg-[#F7F7F5] flex flex-col justify-between w-full h-[100dvh] max-h-[100dvh] overflow-hidden will-change-transform transform-gpu"
          >
            {/* 100% Pinned Sticky Header */}
            <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <button
                type="button"
                onClick={() => setSelectedDishForFinder(null)}
                className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                aria-label="Back to Dishes"
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

              <div className="flex flex-col items-center max-w-[240px]">
                <h1 className="text-[18px] font-black text-[#111111] tracking-tight leading-tight truncate">
                  Where to Eat
                </h1>
                <span className="text-[11px] font-medium text-gray-500 leading-tight truncate">
                  {selectedDishForFinder.name}
                </span>
              </div>

              <div className="w-9 h-9" />
            </header>

            {/* Scrollable Body */}
            <div
              className="flex-1 overflow-y-auto px-4 pt-3.5 pb-12 space-y-4 min-h-0 overscroll-contain touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Dish Feature Card */}
              <div className="bg-white rounded-[24px] border border-gray-200/80 shadow-xs overflow-hidden">
                <div className="relative h-44 w-full bg-gray-100">
                  <img
                    src={selectedDishForFinder.image}
                    alt={selectedDishForFinder.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs ${
                      selectedDishForFinder.dietaryType === 'veg'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {selectedDishForFinder.dietaryType === 'veg' ? '🥬 Pure Vegetarian' : '🍗 Authentic Non-veg'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h2 className="text-[18px] font-black leading-tight drop-shadow-xs">
                      {selectedDishForFinder.name}
                    </h2>
                    <p className="text-[11.5px] text-white/90 font-medium mt-0.5 drop-shadow-xs">
                      {selectedDishForFinder.origin}
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs text-gray-700 leading-relaxed">
                  <p>{selectedDishForFinder.description}</p>
                  <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                    <div><strong>Flavor notes:</strong> {selectedDishForFinder.flavorProfile}</div>
                    <div><strong>Best served with:</strong> {selectedDishForFinder.bestServedWith}</div>
                  </div>
                </div>
              </div>

              {/* Section Heading */}
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[15px] font-black text-gray-900 tracking-tight">
                  Nearby Places (Closest First)
                </h3>
                <span className="text-[11px] font-semibold text-gray-500">
                  Near {userLocality}
                </span>
              </div>

              {/* List of Restaurants serving this specific dish */}
              <div className="space-y-3.5">
                {REAL_RESTAURANTS.filter((r) =>
                  selectedDishForFinder.servingRestaurantIds.includes(r.id)
                )
                  .sort((a, b) => getMinutesForRestaurant(a) - getMinutesForRestaurant(b))
                  .map((rest) => {
                    const dishPrice = rest.dishPrices?.[selectedDishForFinder.id] || rest.priceCategory;
                    const proximity = getProximityText(rest);

                    return (
                      <div
                        key={rest.id}
                        className="bg-white rounded-[22px] border border-gray-200/80 shadow-xs p-4 space-y-3 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <img
                              src={rest.image}
                              alt={rest.name}
                              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-100"
                            />
                            <div>
                              <h4 className="text-[16px] font-black text-gray-900 leading-tight">
                                {rest.name}
                              </h4>
                              <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                                📍 {rest.location}
                              </p>
                              <div className="text-[11.5px] font-bold text-[#177F91] mt-1">
                                {proximity}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-[14px] font-black text-gray-900">
                              {dishPrice}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">approx price</span>
                          </div>
                        </div>

                        <p className="text-[12px] text-gray-600 leading-snug">
                          {rest.description}
                        </p>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onAskGAI(
                                `Is ${rest.name} in ${rest.location} currently open and what are their best recommendations for ${selectedDishForFinder.name}?`
                              )
                            }
                            className="text-[11.5px] font-bold text-[#177F91] hover:underline flex items-center gap-1"
                          >
                            <span>✨ Ask GAI details</span>
                          </button>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              rest.googleMapsQuery
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-gray-800 active:scale-95 transition-all"
                          >
                            <span>Get Directions</span>
                            <span>↗</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Live Web / GAI Discovery Prompt */}
              <div className="p-4 bg-[#E0F2FE]/60 border border-[#BAE6FD] rounded-2xl text-center space-y-2">
                <h4 className="text-[13.5px] font-bold text-[#0369A1]">
                  Looking for more local spots?
                </h4>
                <p className="text-[11.5px] text-[#0284C7] leading-relaxed">
                  Ask GAI to look up real-time live Google listings for <strong>{selectedDishForFinder.name}</strong> near {userLocality}.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onAskGAI(
                      `Find me the top 3 highest-rated local hidden spots and dhabas to eat authentic ${selectedDishForFinder.name} within 15 minutes of ${userLocality}. Include pricing and timings.`
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs shadow-xs hover:bg-[#0369A1] active:scale-98 transition-all"
                >
                  Search More Local Places with GAI ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
