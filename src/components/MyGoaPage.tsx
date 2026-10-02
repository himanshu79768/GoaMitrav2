import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences, SavedPlaceItem, SavedItineraryItem } from '../types/onboarding';

interface MyGoaPageProps {
  preferences: UserPreferences;
  savedPlaces: SavedPlaceItem[];
  savedItineraries: SavedItineraryItem[];
  onBack: () => void;
  onEditPreferences: () => void;
  onAskGAI: (initialPrompt?: string) => void;
  onRemoveSavedPlace: (id: string) => void;
  onRemoveItinerary: (id: string) => void;
  initialTab?: 'itineraries' | 'saved_places';
}

export const MyGoaPage: React.FC<MyGoaPageProps> = ({
  preferences,
  savedPlaces,
  savedItineraries,
  onBack,
  onEditPreferences,
  onAskGAI,
  onRemoveSavedPlace,
  onRemoveItinerary,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'itineraries' | 'saved_places'>(initialTab || 'itineraries');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<'all' | 'destination' | 'stay' | 'food' | 'culture' | 'coupon'>('all');
  const [expandedItineraryId, setExpandedItineraryId] = useState<string | null>(null);

  const filteredPlaces = savedPlaces.filter((p) =>
    placeCategoryFilter === 'all' ? true : p.category === placeCategoryFilter
  );

  const getCategoryBadge = (cat: SavedPlaceItem['category']) => {
    switch (cat) {
      case 'destination':
        return { label: 'Landmark', icon: '📍', bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]' };
      case 'stay':
        return { label: 'Stay', icon: '🏨', bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' };
      case 'food':
        return { label: 'Food', icon: '🍴', bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' };
      case 'culture':
        return { label: 'Culture', icon: '🎨', bg: 'bg-[#F3E8FF]', text: 'text-[#9333EA]' };
      case 'coupon':
        return { label: 'Coupon', icon: '🏷️', bg: 'bg-[#FFEAE5]', text: 'text-[#FF6B4A]' };
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F7F7F5] select-none overflow-hidden">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 px-5 pt-4 pb-3 bg-[#F7F7F5]/90 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
          </button>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#FF6B4A] tracking-wider uppercase">
              PERSONAL DASHBOARD
            </span>
            <h1 className="text-[19px] font-extrabold text-gray-900 tracking-tight leading-none mt-0.5">
              My Goa
            </h1>
          </div>
        </div>

        {/* Brand wordmark badge */}
        <div className="flex items-center tracking-[0.2em] text-[11px] font-black text-[#111111]">
          <span>G</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#177F91] mx-0.5 inline-block" />
          <span>AMITRA</span>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 space-y-4">
        {/* Personalized Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-[#177F91] via-[#105E6D] to-[#0A434F] text-white shadow-xl"
        >
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide uppercase text-white/90">
                My Goa Hub
              </span>
              <h2 className="text-2xl font-black tracking-tight mt-2.5">
                Hello, {preferences.name || 'Explorer'}! 👋
              </h2>
              <p className="text-xs text-white/80 mt-1 leading-relaxed max-w-[260px]">
                Your saved itineraries, liked places, and trip preferences all in one place.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              🌴
            </div>
          </div>
        </motion.div>

        {/* Trip Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A]" />
              Trip Preferences
            </h3>
            <button
              type="button"
              onClick={onEditPreferences}
              className="text-xs font-bold text-[#FF6B4A] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                TRAVEL MONTH
              </span>
              <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                {preferences.travelMonth || 'Not set'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                PARTY SIZE
              </span>
              <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                {preferences.memberCount} {preferences.memberCount === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              PRIMARY INTERESTS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(preferences.tourismTypes || []).map((type) => (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-xl bg-[#FFEAE5] text-[#FF6B4A] text-xs font-bold"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Saved Content Section: Tab Navigation */}
        <div className="pt-2">
          <div className="flex items-center gap-2 p-1 bg-gray-200/70 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('itineraries')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'itineraries'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>🗺️ My Itineraries</span>
              <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-black text-gray-600">
                {savedItineraries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved_places')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'saved_places'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>❤️ Liked Places</span>
              <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-black text-gray-600">
                {savedPlaces.length}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: SAVED ITINERARIES */}
        {activeTab === 'itineraries' && (
          <div className="space-y-3">
            {savedItineraries.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-gray-200/80 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FFEAE5] text-[#FF6B4A] flex items-center justify-center text-2xl mx-auto">
                  🗺️
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">No saved itineraries yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-[260px] mx-auto">
                    Ask GAI to prepare a custom trip plan and click "Add to My Goa Itinerary" to save it here!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAskGAI(`Prepare a complete 3-day itinerary for my trip to Goa in ${preferences.travelMonth || 'this month'}.`)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>✨ Ask GAI to Prepare Itinerary</span>
                </button>
              </div>
            ) : (
              savedItineraries.map((itinerary) => {
                const isExpanded = expandedItineraryId === itinerary.id;
                return (
                  <motion.div
                    key={itinerary.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-[#FFEAE5] text-[#FF6B4A] text-[10px] font-extrabold uppercase tracking-wider">
                          {itinerary.season || 'Goa Plan'}
                        </span>
                        <h3 className="text-base font-extrabold text-gray-900 tracking-tight mt-1">
                          {itinerary.title}
                        </h3>
                        <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                          Saved on {itinerary.timestamp}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItinerary(itinerary.id)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete itinerary"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Preview / Full Content */}
                    <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed font-medium bg-[#F8FAFC] p-3 rounded-2xl border border-gray-100 max-h-60 overflow-y-auto">
                      {isExpanded ? itinerary.content : itinerary.content.slice(0, 220) + (itinerary.content.length > 220 ? '...' : '')}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {itinerary.content.length > 220 && (
                        <button
                          type="button"
                          onClick={() => setExpandedItineraryId(isExpanded ? null : itinerary.id)}
                          className="text-xs font-bold text-[#177F91] hover:underline cursor-pointer"
                        >
                          {isExpanded ? 'Show less ▲' : 'Read full itinerary ▼'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onAskGAI(`Can you customize my itinerary "${itinerary.title}"? Here is what I want to modify...`)}
                        className="text-xs font-bold text-[#FF6B4A] hover:underline cursor-pointer ml-auto flex items-center gap-1"
                      >
                        <span>Modify with GAI ✨</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: LIKED & SAVED PLACES */}
        {activeTab === 'saved_places' && (
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(['all', 'destination', 'stay', 'food', 'culture', 'coupon'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPlaceCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer capitalize ${
                    placeCategoryFilter === cat
                      ? 'bg-[#177F91] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat === 'all' ? 'All Saved' : cat}
                </button>
              ))}
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-gray-200/80 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mx-auto">
                  ❤️
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">No saved places in this category</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-[260px] mx-auto">
                    Heart or bookmark landmarks, stays, food spots, cultural events, or coupons across the app to see them here!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {filteredPlaces.map((place) => {
                  const badge = getCategoryBadge(place.category);
                  return (
                    <motion.div
                      key={place.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {place.image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                            <img
                              src={place.image}
                              alt={place.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-xl ${badge.bg} ${badge.text} flex items-center justify-center text-xl shrink-0 font-bold`}>
                            {badge.icon}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md ${badge.bg} ${badge.text} text-[10px] font-black uppercase tracking-wider`}>
                              {badge.label}
                            </span>
                            {place.ratingOrPrice && (
                              <span className="text-[11px] font-semibold text-gray-500 truncate">
                                · {place.ratingOrPrice}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-extrabold text-gray-900 truncate mt-0.5">
                            {place.title}
                          </h4>

                          {place.location && (
                            <p className="text-xs text-gray-500 truncate font-medium mt-0.5">
                              📍 {place.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onAskGAI(`Tell me details and how to visit ${place.title} in Goa.`)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#FFEAE5] hover:text-[#FF6B4A] text-gray-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          title="Ask GAI about this place"
                        >
                          ✨
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveSavedPlace(place.id)}
                          className="w-8 h-8 rounded-full hover:bg-red-50 text-red-500 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          ❤️
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
