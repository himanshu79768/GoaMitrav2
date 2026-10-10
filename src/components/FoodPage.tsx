import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences, SavedPlaceItem } from '../types/onboarding';

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
  preparationNote?: string;
}

interface FoodPageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onAskGAI: (initialPrompt?: string) => void;
  savedPlaces?: SavedPlaceItem[];
  onToggleSavePlace?: (place: SavedPlaceItem) => void;
}

// 100% Authentic Goan & Indian Dishes List (Restaurants removed, pure culinary guide)
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6B0az0tEeKc7WBkX6FLThwl464weTO3ZXjt2InnM3-Q&s=10',
    description: 'Rich dark coconut gravy roasted with 16 spices and fresh wild mushrooms. A beloved 100% vegetarian adaptation of the legendary Goan Xacuti curry.',
    preparationNote: 'Whole spices and grated coconut are slow-roasted in an iron skillet until deep mahogany brown, then stone-ground to release complex oils.',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvXuYc4ARLub_BpmNPHIaKh6DsAY3rqduwvO6OhtMG2A&s=10',
    description: 'Traditional Goan festival vegetable stew cooked with at least five seasonal vegetables, fresh grated coconut, local palm jaggery, and crushed tirphal berries.',
    preparationNote: 'No onion or garlic is used; the signature peppery citrus flavor comes entirely from wild Goan tirphal berries harvested in the Western Ghats.',
  },
  {
    id: 'dish-paneer-cafreal',
    name: 'Paneer Cafreal',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Must try',
    origin: 'Modern Goan Green Spice Blend',
    flavorProfile: 'Tangy, zesty green paste made of fresh coriander leaves, green chillies, cloves, and lime.',
    bestServedWith: 'Goan Poee wheat bread or buttered garlic naan',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSzhZwGRCHtG74ZNGVryhLMv7loYVZaaeHjMSfA9mdAA&s=10',
    description: 'Soft cottage cheese cubes marinated in Goan green herbal cafreal spice paste and shallow-fried until delightfully smoky.',
    preparationNote: 'A vibrant herbal blend of whole bunch coriander, green chillies, garlic, ginger, and cinnamon ground fine with toddy vinegar or lime juice.',
  },
  {
    id: 'dish-alsande',
    name: 'Alsande Tonak (Red Cowpea Curry)',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Local favourite',
    origin: 'Traditional Goan Village Home Recipe',
    flavorProfile: 'Earthy, roasted coconut-onion gravy infused with cloves and coriander seeds.',
    bestServedWith: 'Hot Goan Poee bread pockets or boiled rice',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYg1RPFxBEYuvwfzMi7GBvR2VTGLL3vzsOdw1sofVGlw&s=10',
    description: 'Protein-rich Goan red cowpeas simmered in an aromatic roasted coconut-spice masala. The everyday breakfast soul food of Goan locals.',
    preparationNote: 'Dried red alsande beans are soaked overnight, pressure-cooked tender, and slow-simmered in a roasted dry coconut and coriander masala.',
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
    bestServedWith: 'Chilled directly after Goan meals or poured over steamed red rice',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4JvCBJaJJ8yfzAXQWewkMY9VxsOLfxUEPB0tZh0ZNYA&s=10',
    description: 'Iconic cooling pink Goan digestive drink made from first-press coconut milk and wild kokum extract. Essential for balancing coastal tropical heat.',
    preparationNote: 'Natural sour kokum rinds are steeped in warm water to yield vibrant magenta liquid, whisked with freshly squeezed coconut milk and a hint of cumin.',
  },
  {
    id: 'dish-tambdi-bhaji',
    name: 'Tambdi Bhaji (Goan Red Amaranth Stir Fry)',
    cuisineStyle: 'goan_authentic',
    dietaryType: 'veg',
    hasJain: true,
    isAllergySafe: true,
    matchBadge: 'Local favourite',
    origin: 'Everyday Goan Home Cooking',
    flavorProfile: 'Mild, sweet red greens tempered with mustard seeds, sliced onions, and freshly grated coconut.',
    bestServedWith: 'Steamed rice, dal, or warm rotis',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ_Zx346MgII5zznMfxiM-CdwOwHJR0Kvw0v9yFPwmJQ&s=10',
    description: 'Fresh crimson red amaranth leaves quick-tossed with green chillies, onions, and freshly shredded coconut. Simple, vibrant, and bursting with nutrients.',
    preparationNote: 'Cooked swiftly over high heat to preserve the vivid red color and crisp-tender texture, finished with a generous handful of wet coconut.',
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
    flavorProfile: 'Tangy coconut fish curry, crisp rawa fried kingfish slice, tisryao clams, kismur salad, sol kadi & rice.',
    bestServedWith: 'Steamed Goan red rice (ukda xitt)',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4fnlDLb_GlyxQU--2Yg7OCIs4DsQrj338iAnMNAewZA&s=10',
    description: 'The quintessential Goan midday meal: fresh daily sea catch curry, semolina-crusted fried kingfish slice, clam masala, dry prawn kismur salad, chilled sol kadi, and rice.',
    preparationNote: 'A culinary complete plate featuring all six tastes (sweet, sour, salty, bitter, pungent, astringent) governed by the daily market fish catch.',
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
    flavorProfile: 'Silky orange coconut curry infused with wild kokum, dried Kashmiri red chillies, and sea prawns.',
    bestServedWith: 'Steamed rice or Goan Poee bread',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQakpyMNbW71T_NaSPDA9NDFjqazxD6FCnFVum_i6Ohzw&s=10',
    description: 'Goa’s ultimate comfort soul food: sweet sea prawns simmered gently in a fragrant orange coconut gravy balanced with the tart acidity of kokum.',
    preparationNote: 'Kashmiri chillies and coriander seeds are stone-ground with fresh grated coconut, turmeric, and garlic before brief simmering with fresh prawns.',
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
    flavorProfile: 'Deeply roasted grated coconut with 16 aromatic whole spices, white poppy seeds & star anise.',
    bestServedWith: 'Warm crusty whole-wheat Goan Poee bread or steamed rice',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO2nUFDkNcuiW85S0YqlnCr3vthp0VqbgA6uUqZ3Jajw&s=10',
    description: 'A deeply aromatic, dark roasted gravy made with slow-roasted grated coconut, whole roasted spices, and tender bone-in chicken. Velvety and intensely flavorful.',
    preparationNote: 'The coconut is dry-roasted until almost chocolate-brown, creating a smoky depth of flavor distinct from any other Indian curry.',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKjHoj89vnKWyufvq3UwX-dH4CWuns7o8L4uCONRGVA&s=10',
    description: 'Tender chicken marinated in an intensely flavorful green herbal paste of fresh coriander and warm spices, pan-fried to a smoky, succulent finish.',
    preparationNote: 'Originally introduced by African soldiers in Portuguese regiments, perfected in Saligao village using local toddy palm vinegar.',
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
    flavorProfile: 'Fluffy masala omelette drowned in piping hot, spicy chicken xacuti gravy with diced onions and lime.',
    bestServedWith: 'Two freshly baked Goan wheat Poee bread pockets',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLkcyVjDrRqla9cckRTa3nqPyBdh9Qoyt8Oxj6oBqsxg&s=10',
    description: 'Goa’s iconic night street food: a freshly fried fluffy masala omelette submerged under aromatic, ladle-poured spicy chicken xacuti gravy ("Ros").',
    preparationNote: 'Cooked fresh on iron street tavas with chopped coriander, green chillies, and onions, served piping hot alongside crusty local bread.',
  },
];

export const FoodPage: React.FC<FoodPageProps> = ({
  preferences,
  onBack,
  onAskGAI,
  savedPlaces = [],
  onToggleSavePlace,
}) => {
  // Selected Dish for detail view
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);

  // Dietary Filter: All, Veg, Non-Veg
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non_veg'>('all');

  // Option filter: Normal vs Goan Authentic
  const [cuisineOption, setCuisineOption] = useState<'all' | 'goan_authentic' | 'normal'>('all');

  // Dietary chips: Jain / Allergy
  const [activeChip, setActiveChip] = useState<'all' | 'jain' | 'allergy'>('all');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (dish: DishItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSavePlace) {
      onToggleSavePlace({
        id: dish.id,
        title: dish.name,
        category: 'food',
        subtitle: dish.cuisineStyle === 'goan_authentic' ? 'Goan Authentic Dish' : 'Specialty Dish',
        location: dish.origin,
        image: dish.image,
        ratingOrPrice: dish.dietaryType === 'veg' ? 'Pure Veg' : 'Non-veg',
      });
    }
    setFavorites((prev) =>
      prev.includes(dish.id) ? prev.filter((item) => item !== dish.id) : [...prev, dish.id]
    );
  };

  // Filter Dishes
  const filteredDishes = ALL_DISHES.filter((item) => {
    if (dietaryFilter === 'veg' && item.dietaryType !== 'veg') return false;
    if (dietaryFilter === 'non_veg' && item.dietaryType !== 'non_veg') return false;

    if (cuisineOption !== 'all' && item.cuisineStyle !== cuisineOption) return false;

    if (activeChip === 'jain' && !item.hasJain) return false;
    if (activeChip === 'allergy' && !item.isAllergySafe) return false;

    return true;
  });

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between select-none relative overflow-hidden w-full font-sans">
      {/* 1. MAIN FOOD GUIDE DIRECTORY */}
      <div className="w-full h-full flex flex-col justify-between">
        {/* Pinned Sticky Top Navigation Bar */}
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
          <div className="flex flex-col items-center">
            <h1 className="text-[20px] font-black text-[#111111] tracking-tight leading-tight">
              Food
            </h1>
            <span className="text-[11px] font-semibold text-gray-500">
              Authentic Goan Culinary Guide
            </span>
          </div>

          {/* Right Balance Spacer */}
          <div className="w-9 h-9" />
        </header>

        {/* Scrollable Body Container */}
        <div
          className="flex-1 overflow-y-auto px-4 pt-3.5 pb-10 space-y-3.5 min-h-0 overscroll-contain touch-pan-y no-scrollbar max-w-4xl mx-auto w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Dietary Filter Segmented Control: All, Veg, Non-veg */}
          <div className="bg-white border border-gray-200/80 p-1 rounded-2xl flex items-center shadow-2xs w-full md:max-w-xs md:mx-auto">
            <button
              type="button"
              onClick={() => setDietaryFilter('all')}
              className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all text-center cursor-pointer ${
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
              className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all text-center cursor-pointer ${
                dietaryFilter === 'veg'
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pure Veg
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('non_veg')}
              className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all text-center cursor-pointer ${
                dietaryFilter === 'non_veg'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Non-veg
            </button>
          </div>

          {/* Option Filters: Style & Dietary Features */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 md:justify-center">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 pl-1">
              Filter:
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
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                cuisineOption === 'goan_authentic'
                  ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V18a1 1 0 0 1-2 0v-1.07A6 6 0 0 1 6.07 12H5a1 1 0 0 1 0-2h1.07A6 6 0 0 1 11 4.93V4a1 1 0 0 1 2 0v.93A6 6 0 0 1 17.93 10H19a1 1 0 0 1 0 2h-1.07A6 6 0 0 1 13 16.93z" />
              </svg>
              <span>Goan Authentic</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveChip(activeChip === 'jain' ? 'all' : 'jain')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeChip === 'jain'
                  ? 'bg-[#15803D] text-white border-[#15803D] shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>Jain Friendly</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveChip(activeChip === 'allergy' ? 'all' : 'allergy')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeChip === 'allergy'
                  ? 'bg-[#D97706] text-white border-[#D97706] shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>Allergy Safe</span>
            </button>
          </div>

          {/* DISHES LIST VIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDishes.map((dish) => {
              const isFav = favorites.includes(dish.id) || savedPlaces.some((p) => p.id === dish.id);

              return (
                <motion.div
                  key={dish.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedDish(dish)}
                  className="bg-white rounded-[24px] border border-gray-200/80 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col cursor-pointer"
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
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-bold text-[11px] shadow-xs">
                        {dish.cuisineStyle === 'goan_authentic' ? (
                          <>
                            <svg className="w-3 h-3 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V18a1 1 0 0 1-2 0v-1.07A6 6 0 0 1 6.07 12H5a1 1 0 0 1 0-2h1.07A6 6 0 0 1 11 4.93V4a1 1 0 0 1 2 0v.93A6 6 0 0 1 17.93 10H19a1 1 0 0 1 0 2h-1.07A6 6 0 0 1 13 16.93z" />
                            </svg>
                            <span>Goan authentic</span>
                          </>
                        ) : (
                          <span>Specialty food</span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(dish, e)}
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
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
                        dish.dietaryType === 'veg'
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : 'bg-[#FEE2E2] text-[#DC2626]'
                      }`}>
                        {dish.dietaryType === 'veg' ? (
                          <>
                            <svg className="w-3 h-3 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                            </svg>
                            <span>Pure Veg</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="9" />
                              <path d="m15 9-6 6" />
                              <path d="m9 9 6 6" />
                            </svg>
                            <span>Non-veg</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11.5px] font-bold text-white drop-shadow-xs truncate max-w-[170px]">
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

                    <p className="text-[12.5px] text-gray-600 leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>

                    <div className="p-2.5 bg-gray-50 rounded-xl space-y-1 text-xs">
                      <div className="text-gray-700 truncate">
                        <strong>Flavor:</strong> {dish.flavorProfile}
                      </div>
                      <div className="text-gray-700 truncate">
                        <strong>Eat with:</strong> {dish.bestServedWith}
                      </div>
                    </div>

                    {/* View Info Action Row */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className="text-[11.5px] font-bold text-[#177F91] flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#177F91]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span>Food details & Ask GAI</span>
                      </span>

                      <span className="px-3 py-1.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                        <span>View Info</span>
                        <span>›</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. DEDICATED FOOD INFO & ASK GAI SCREEN */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            key="dish_info_screen"
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
            {/* Pinned Sticky Header */}
            <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedDish(null)}
                className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Back to Foods"
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

              <div className="flex flex-col items-center max-w-[240px]">
                <h2 className="text-[17px] font-black text-[#111111] tracking-tight leading-tight truncate">
                  {selectedDish.name}
                </h2>
                <span className="text-[11px] font-medium text-gray-500 leading-tight">
                  Food Information & Heritage
                </span>
              </div>

              <div className="w-9 h-9" />
            </header>

            {/* Scrollable Body */}
            <div
              className="flex-1 overflow-y-auto px-4 pt-3.5 pb-12 space-y-4 min-h-0 overscroll-contain touch-pan-y no-scrollbar max-w-2xl mx-auto w-full"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Dish Hero Card */}
              <div className="bg-white rounded-[26px] border border-gray-200/80 shadow-xs overflow-hidden">
                <div className="relative h-52 sm:h-60 w-full bg-gray-100">
                  <img
                    src={selectedDish.image}
                    alt={selectedDish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs ${
                      selectedDish.dietaryType === 'veg'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {selectedDish.dietaryType === 'veg' ? 'Pure Vegetarian' : 'Authentic Non-veg'}
                    </span>

                    {selectedDish.matchBadge && (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-[11px]">
                        ★ {selectedDish.matchBadge}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-[22px] font-black leading-tight drop-shadow-xs">
                      {selectedDish.name}
                    </h3>
                    <p className="text-[12.5px] text-white/90 font-medium mt-0.5 drop-shadow-xs">
                      {selectedDish.origin}
                    </p>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5 space-y-4">
                  {/* Detailed Description */}
                  <div>
                    <h4 className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      ABOUT THIS DISH
                    </h4>
                    <p className="text-[14px] text-gray-700 leading-relaxed font-normal">
                      {selectedDish.description}
                    </p>
                  </div>

                  {/* Flavor Profile & Traditional Accompaniment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60">
                      <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                        FLAVOR NOTES & SPICES
                      </div>
                      <div className="text-[13px] font-semibold text-gray-800 mt-1">
                        {selectedDish.flavorProfile}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60">
                      <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                        BEST SERVED WITH
                      </div>
                      <div className="text-[13px] font-semibold text-gray-800 mt-1">
                        {selectedDish.bestServedWith}
                      </div>
                    </div>
                  </div>

                  {/* Traditional Preparation Notes */}
                  {selectedDish.preparationNote && (
                    <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#FDE68A] text-xs text-[#92400E]">
                      <div className="font-bold flex items-center gap-1.5 text-[12.5px] text-[#78350F] mb-1">
                        <svg className="w-3.5 h-3.5 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                          <path d="M9 18h6M10 22h4" />
                        </svg>
                        <span>Culinary Craft & Secret Technique</span>
                      </div>
                      <p className="leading-relaxed">
                        {selectedDish.preparationNote}
                      </p>
                    </div>
                  )}

                  {/* ASK GAI BUTTON (PROMINENT) */}
                  <div className="pt-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        onAskGAI(
                          `Tell me everything about the Goan dish "${selectedDish.name}": traditional preparation, secret spices, cultural history, and where locals love eating it.`
                        )
                      }
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#177F91] to-[#0E5865] text-white text-center font-bold text-[14px] shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                      </svg>
                      <span>Ask GAI about {selectedDish.name}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
