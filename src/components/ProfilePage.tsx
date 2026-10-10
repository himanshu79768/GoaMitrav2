import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPreferences,
  SavedPlaceItem,
  SavedItineraryItem,
  AccessibilitySettings,
  DisabilityType,
  GAIResponseTone,
  getDisabilityDefaults,
} from '../types/onboarding';
import { StayBooking, getStoredStayBookings } from '../types/booking';

interface ProfilePageProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (partial: Partial<AccessibilitySettings>) => void;
  savedPlaces: SavedPlaceItem[];
  savedItineraries: SavedItineraryItem[];
  onRemoveSavedPlace: (id: string) => void;
  onRemoveItinerary: (id: string) => void;
  onBack: () => void;
  onOpenMyGoaScreen: (tab?: 'itineraries' | 'saved_places') => void;
  onNavigateToStay?: () => void;
  onLogout: () => void;
  onShowToast?: (toast: {
    message: string;
    subMessage?: string;
    icon?: 'heart' | 'heart-broken' | 'itinerary' | 'check' | 'delete' | 'sparkles';
    type?: 'success' | 'info' | 'favorite' | 'remove';
  }) => void;
}

type ProfileTab = 'impact' | 'my_goa' | 'settings';

interface BookingPreset {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  hostName: string;
  location: string;
}

const SAMPLE_BOOKINGS: BookingPreset[] = [
  {
    id: 'bk-homestay-majorda',
    title: 'Casa Da Majorda Heritage Homestay (3 Nights)',
    category: 'Homestay Stay',
    amount: 7500,
    date: '12 Oct 2026',
    hostName: 'Fernandes Family',
    location: 'Majorda, South Goa',
  },
  {
    id: 'bk-spice-feast',
    title: 'Sahakari Spice Farm & Traditional Goan Thali',
    category: 'Culinary & Culture',
    amount: 2200,
    date: '14 Oct 2026',
    hostName: 'Savitri Naik (Host Family)',
    location: 'Ponda, Central Goa',
  },
  {
    id: 'bk-chorao-kayak',
    title: 'Chorao Mangrove Eco-Kayak & Island Ferry',
    category: 'Eco-Tour Guide',
    amount: 1400,
    date: '15 Oct 2026',
    hostName: 'Capt. Prakash Naik',
    location: 'Chorao Island',
  },
  {
    id: 'bk-total-trip',
    title: 'Combined Trip Package (Stay + Dining + Tours)',
    category: 'Full Itinerary Booking',
    amount: 11100,
    date: 'Entire Visit',
    hostName: 'Verified Goan Host Network',
    location: 'Goa State Wide',
  },
];

const TONE_OPTIONS: {
  id: GAIResponseTone;
  title: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: 'local',
    title: 'Warm & Goan Local',
    desc: 'Welcoming Susegad warmth, local Konkani phrases & village tips',
    icon: '🌴',
  },
  {
    id: 'concise',
    title: 'Concise & Direct',
    desc: 'Short 2-sentence answers, clear bullet points, zero fluff',
    icon: '⚡',
  },
  {
    id: 'sensory',
    title: 'Descriptive & Sensory',
    desc: 'Evocative imagery (ocean breezes, spices, church bells)',
    icon: '🌅',
  },
  {
    id: 'calm',
    title: 'Calm & Gentle',
    desc: 'Serene pacing, low-anxiety supportive guidance',
    icon: '🕊️',
  },
  {
    id: 'plain',
    title: 'Plain Language',
    desc: 'Easy-to-read everyday words, simplified grammar',
    icon: '📖',
  },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  preferences,
  onUpdatePreferences,
  accessibility,
  onUpdateAccessibility,
  savedPlaces,
  savedItineraries,
  onRemoveSavedPlace,
  onRemoveItinerary,
  onBack,
  onOpenMyGoaScreen,
  onNavigateToStay,
  onLogout,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('impact');

  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(preferences.name);

  // Stay Bookings State (loaded from storage & reactive)
  const [stayBookings, setStayBookings] = useState<StayBooking[]>(() => getStoredStayBookings());

  useEffect(() => {
    setStayBookings(getStoredStayBookings());
  }, [activeTab]);

  // Impact Receipt State
  const [selectedBookingId, setSelectedBookingId] = useState<string>(() => {
    const list = getStoredStayBookings();
    return list.length > 0 ? list[0].id : '';
  });
  const [customAmount, setCustomAmount] = useState<number | ''>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activeDivision, setActiveDivision] = useState<'local' | 'govt' | 'app' | null>('local');
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Sync selectedBookingId if bookings change
  useEffect(() => {
    if (stayBookings.length > 0 && (!selectedBookingId || !stayBookings.some((b) => b.id === selectedBookingId))) {
      setSelectedBookingId(stayBookings[0].id);
    }
  }, [stayBookings]);

  // Selected Booking Calculation
  const currentBooking = stayBookings.find((b) => b.id === selectedBookingId) || stayBookings[0] || null;
  const bookingTotal = currentBooking
    ? isCustomMode
      ? typeof customAmount === 'number' && customAmount > 0
        ? customAmount
        : currentBooking.totalAmount
      : currentBooking.totalAmount
    : 0;

  // Breakdown percentages:
  // Local Community: 78%
  // Goa Govt / Heritage Fund: 14%
  // GoaMitra App Ops: 8%
  const localShare = currentBooking ? currentBooking.localShare || Math.round(bookingTotal * 0.78) : 0;
  const govtShare = currentBooking ? currentBooking.govtShare || Math.round(bookingTotal * 0.14) : 0;
  const appShare = currentBooking ? currentBooking.appShare || (bookingTotal - localShare - govtShare) : 0;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdatePreferences({ name: nameInput.trim() });
      setIsEditingName(false);
      onShowToast?.({
        message: 'Name updated successfully',
        type: 'success',
        icon: 'check',
      });
    }
  };

  const handleCopyReceipt = () => {
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
    onShowToast?.({
      message: 'Impact Receipt copied to clipboard',
      subMessage: '₹' + localShare.toLocaleString('en-IN') + ' directly supported Goan locals!',
      type: 'success',
      icon: 'sparkles',
    });
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between select-none relative overflow-hidden w-full font-sans">
      {/* 1. Header */}
      <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Back"
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

        <div className="text-center">
          <h1 className="text-[19px] font-black text-[#111111] tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-[11px] text-gray-500 font-semibold">
            Sustainable Goan Explorer
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleCopyReceipt}
          className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
          title="Share Impact"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </motion.button>
      </header>

      {/* 2. Scrollable Container */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3 pb-16 space-y-4 min-h-0 overscroll-contain touch-pan-y no-scrollbar max-w-2xl mx-auto w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* User Identity Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100/50 via-emerald-50/20 to-transparent rounded-full -mr-8 -mt-8 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#177F91] to-[#2DD4BF] text-white flex items-center justify-center font-black text-xl shadow-xs">
                {preferences.name.charAt(0).toUpperCase() || 'E'}
              </div>
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-2.5 py-1 text-[15px] font-bold border border-teal-500 rounded-lg bg-teal-50/30 focus:outline-hidden"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-2.5 py-1 text-xs font-bold bg-[#177F91] text-white rounded-lg shadow-2xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setNameInput(preferences.name);
                        setIsEditingName(false);
                      }}
                      className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-black text-gray-900 leading-tight">
                      {preferences.name}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                      title="Edit Name"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                  </div>
                )}

                <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                  Visiting in <span className="text-gray-800 font-semibold">{preferences.travelMonth}</span> · {preferences.memberCount} {preferences.memberCount === 1 ? 'Guest' : 'Guests'} ({preferences.travelType})
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold shadow-2xs">
                <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Eco-Traveler
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                100% Susegad Certified
              </span>
            </div>
          </div>

          {/* Interests Pill Row */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
            {preferences.tourismTypes.map((type) => (
              <span
                key={type}
                className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-semibold"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* 3-Section Segmented Tab Bar */}
        <div className="bg-[#EAEAE8] p-1 rounded-2xl flex items-center shadow-inner relative">
          <button
            onClick={() => setActiveTab('impact')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-[13px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'impact'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🧾</span>
            <span>Impact Receipt</span>
          </button>

          <button
            onClick={() => setActiveTab('my_goa')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-[13px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'my_goa'
                ? 'bg-white text-[#177F91] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🌴</span>
            <span>MY GOA</span>
            {(savedPlaces.length > 0 || savedItineraries.length > 0) && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#177F91] text-white text-[10px] font-bold">
                {savedPlaces.length + savedItineraries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-[13px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>⚙️</span>
            <span>All Settings</span>
          </button>
        </div>

        {/* TAB 1: IMPACT RECEIPT */}
        {activeTab === 'impact' && (
          <div className="space-y-4">
            {/* Impact Feature Banner */}
            <div className="bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span>🌱</span>
                  Zero Middleman Leakage
                </div>
                <h3 className="text-[20px] font-black tracking-tight leading-tight">
                  Transparent Impact Receipt
                </h3>
                <p className="text-[12.5px] text-emerald-100/90 mt-1 leading-relaxed">
                  Every rupee you spend through GoaMitra verified stays & local bookings directly builds the Goan community, preserves coastal ecology, and protects heritage.
                </p>
              </div>

              {/* Decorative Background Circles */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-emerald-400/10 pointer-events-none" />
              <div className="absolute -top-6 right-20 w-24 h-24 rounded-full bg-teal-400/10 pointer-events-none" />
            </div>

            {/* Condition: Show Pie Chart ONLY when user books a stay */}
            {stayBookings.length === 0 ? (
              /* EMPTY STATE: Prompt user to book a homestay */
              <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 mx-auto flex items-center justify-center text-3xl shadow-2xs">
                  🏡
                </div>
                <div>
                  <h4 className="text-[17px] font-black text-gray-900 tracking-tight">
                    No Stay Booked Yet
                  </h4>
                  <p className="text-[12.5px] text-gray-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    The Impact Division pie chart is generated automatically when you complete a stay booking. Book any verified Goan homestay to see exactly where your money goes!
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="font-bold text-gray-700 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>How Your Money Will Be Divided:</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-800 font-semibold">
                    <span>• Local Host Family (incl. 10% Dev Fund):</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-800 font-semibold">
                    <span>• GTDC & Heritage Conservation:</span>
                    <span className="font-bold">14%</span>
                  </div>
                  <div className="flex items-center justify-between text-teal-800 font-semibold">
                    <span>• GoaMitra Safety & 24/7 SOS Ops:</span>
                    <span className="font-bold">8%</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToStay) {
                      onNavigateToStay();
                    } else {
                      onBack();
                    }
                  }}
                  className="w-full max-w-xs py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF5436] to-[#E03F22] text-white font-extrabold text-sm shadow-md hover:brightness-105 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Explore & Book Verified Stays</span>
                  <span>→</span>
                </button>
              </div>
            ) : (
              /* ACTIVE STATE: User has booked stay -> Show Pie Chart & Full Breakdown */
              <>
                {/* Select Stay Booking */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[13px] font-bold text-gray-800">
                        Your Booked Stays ({stayBookings.length})
                      </label>
                      <p className="text-[11px] text-gray-500">
                        Select a homestay booking to view the impact division
                      </p>
                    </div>
                    {onNavigateToStay && (
                      <button
                        type="button"
                        onClick={onNavigateToStay}
                        className="text-[11.5px] font-bold text-[#FF5436] hover:underline cursor-pointer"
                      >
                        + Book Another
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {stayBookings.map((b) => {
                      const isSelected = b.id === (currentBooking ? currentBooking.id : '');
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBookingId(b.id)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                              : 'bg-gray-50/60 border-gray-200 hover:bg-gray-100/70 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={b.stayImage}
                              alt={b.stayName}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                  {b.id}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {b.durationNights} {b.durationNights === 1 ? 'Night' : 'Nights'}
                                </span>
                              </div>
                              <h4 className="text-[13px] font-bold text-gray-900 mt-0.5 truncate">
                                {b.stayName}
                              </h4>
                              <p className="text-[10.5px] text-gray-500 truncate">
                                Guest: {b.guestName} · {b.bookedAt}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[14px] font-black text-gray-900">
                              ₹{b.totalAmount.toLocaleString('en-IN')}
                            </span>
                            <div className="text-[10px] text-emerald-700 font-bold">
                              Paid & Confirmed
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Visual Pie Chart / Donut Chart Card */}
                {currentBooking && (
                  <>
                    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs">
                      <div className="text-center mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Where Your Money Went
                        </span>
                        <h4 className="text-[18px] font-black text-gray-900 mt-0.5">
                          Total Division: ₹{currentBooking.totalAmount.toLocaleString('en-IN')}
                        </h4>
                        <p className="text-[11.5px] text-emerald-700 font-semibold mt-0.5">
                          {currentBooking.stayName} · {currentBooking.durationNights} Nights
                        </p>
                      </div>

                      {/* Responsive SVG Donut Chart */}
                      <div className="flex flex-col items-center justify-center my-2">
                        <div className="relative w-52 h-52">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background track circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#F3F4F6"
                              strokeWidth="14"
                            />

                            {/* Slice 1: Local Community (78%) -> Dasharray 196.0 out of 251.3 */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#059669"
                              strokeWidth={activeDivision === 'local' ? '17' : '14'}
                              strokeDasharray={`${251.3 * 0.78} 251.3`}
                              strokeDashoffset="0"
                              className="cursor-pointer transition-all duration-300 hover:opacity-90"
                              onClick={() => setActiveDivision('local')}
                            />

                            {/* Slice 2: Goa Govt / Heritage (14%) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#D97706"
                              strokeWidth={activeDivision === 'govt' ? '17' : '14'}
                              strokeDasharray={`${251.3 * 0.14} 251.3`}
                              strokeDashoffset={`${-251.3 * 0.78}`}
                              className="cursor-pointer transition-all duration-300 hover:opacity-90"
                              onClick={() => setActiveDivision('govt')}
                            />

                            {/* Slice 3: GoaMitra App Ops (8%) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#0F766E"
                              strokeWidth={activeDivision === 'app' ? '17' : '14'}
                              strokeDasharray={`${251.3 * 0.08} 251.3`}
                              strokeDashoffset={`${-251.3 * (0.78 + 0.14)}`}
                              className="cursor-pointer transition-all duration-300 hover:opacity-90"
                              onClick={() => setActiveDivision('app')}
                            />
                          </svg>

                          {/* Donut Center Label */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                            <span className="text-[11px] font-bold text-gray-500 uppercase">
                              Local First
                            </span>
                            <span className="text-[24px] font-black text-emerald-800 leading-none">
                              78%
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold mt-0.5">
                              Direct to Locals
                            </span>
                          </div>
                        </div>

                        {/* Interactive Legend with click triggers */}
                        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setActiveDivision('local')}
                            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                              activeDivision === 'local'
                                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300/30'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                              <span className="text-[11px] font-bold text-gray-900">Local (78%)</span>
                            </div>
                            <p className="text-[13px] font-black text-emerald-800 mt-0.5">
                              ₹{localShare.toLocaleString('en-IN')}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveDivision('govt')}
                            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                              activeDivision === 'govt'
                                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/30'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                              <span className="text-[11px] font-bold text-gray-900">Govt (14%)</span>
                            </div>
                            <p className="text-[13px] font-black text-amber-800 mt-0.5">
                              ₹{govtShare.toLocaleString('en-IN')}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveDivision('app')}
                            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                              activeDivision === 'app'
                                ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-300/30'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
                              <span className="text-[11px] font-bold text-gray-900">App (8%)</span>
                            </div>
                            <p className="text-[13px] font-black text-teal-800 mt-0.5">
                              ₹{appShare.toLocaleString('en-IN')}
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Active Division Detailed Breakdown Box */}
                      <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                        {activeDivision === 'local' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#059669]" />
                                <h5 className="text-[14px] font-bold text-gray-900">
                                  Local Community Division (78%)
                                </h5>
                              </div>
                              <span className="text-[14px] font-black text-emerald-800">
                                ₹{localShare.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-[12px] text-gray-600 leading-relaxed">
                              Entire local community division goes directly to {currentBooking.stayName}'s host family, with 10% in the host amount reserved for the village development fund.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-gray-700">
                              <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                                <div className="text-[10px] text-gray-500 font-medium">Direct to Host</div>
                                <div className="text-[12px] font-bold text-gray-900 mt-0.5">
                                  🏡 Host Family: ₹{Math.round(localShare * 0.9).toLocaleString('en-IN')}
                                </div>
                              </div>
                              <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                                <div className="text-[10px] text-emerald-600 font-medium">In Host Amount</div>
                                <div className="text-[12px] font-bold text-emerald-800 mt-0.5">
                                  🏛️ Development Fund (10%): ₹{Math.round(localShare * 0.1).toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeDivision === 'govt' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#D97706]" />
                                <h5 className="text-[14px] font-bold text-gray-900">
                                  Govt Tourism & Conservation (14%)
                                </h5>
                              </div>
                              <span className="text-[14px] font-black text-amber-800">
                                ₹{govtShare.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-[12px] text-gray-600 leading-relaxed">
                              Contributes to Goa Tourism Development Corporation (GTDC) statutory eco-cess, coastal beach cleaning drives, and preservation of UNESCO heritage monuments.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-gray-700">
                              <div className="p-2 rounded-lg bg-white border border-gray-200">
                                🏖️ Beach Cleanliness: ₹{Math.round(govtShare * 0.45).toLocaleString('en-IN')}
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-gray-200">
                                🏛️ Heritage Restoration: ₹{Math.round(govtShare * 0.35).toLocaleString('en-IN')}
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-gray-200">
                                🌳 Goa Forestry Fund: ₹{Math.round(govtShare * 0.2).toLocaleString('en-IN')}
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-gray-200 text-amber-800 font-bold">
                                📜 Official Panchayati Tax
                              </div>
                            </div>
                          </div>
                        )}

                        {activeDivision === 'app' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#0F766E]" />
                                <h5 className="text-[14px] font-bold text-gray-900">
                                  GoaMitra App & Operations (8%)
                                </h5>
                              </div>
                              <span className="text-[14px] font-black text-teal-800">
                                ₹{appShare.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-[12px] text-gray-600 leading-relaxed">
                              Maintains transparent platform servers, 24x7 Goa Police & Tourist SOS dispatch lines, and in-person homestay verification audits.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-gray-700">
                              <div className="p-2 rounded-lg bg-white border border-gray-200">
                                🚨 24x7 SOS Dispatch
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-gray-200">
                                🛡️ In-Person Safety Audits
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-gray-200">
                                🌐 Multilingual App Host
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-gray-200 text-teal-800 font-bold">
                                ⚡ 0% Hidden Surcharges
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Official Impact Receipt Card */}
                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-5 shadow-xs relative">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Official Impact Receipt
                          </span>
                          <h4 className="text-[15px] font-black text-gray-900 mt-1">
                            #GM-GOA-{currentBooking.id.toUpperCase().slice(0, 10)}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-gray-400 font-medium">Issue Date</span>
                          <p className="text-[12px] font-bold text-gray-800">{currentBooking.bookedAt}</p>
                        </div>
                      </div>

                      {/* Line item receipt */}
                      <div className="py-3 space-y-2 border-b border-gray-100 text-xs">
                        <div className="flex justify-between font-bold text-gray-800">
                          <span>{currentBooking.stayName} ({currentBooking.durationNights} Nights)</span>
                          <span>₹{currentBooking.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-[11px]">
                          <span>Guest: {currentBooking.guestName}</span>
                          <span>{currentBooking.paymentMethodTitle}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-[11px]">
                          <span>Direct to Local Host & Village</span>
                          <span className="text-emerald-700 font-semibold">₹{localShare.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-[11px]">
                          <span>GTDC & Heritage Preservation Fund</span>
                          <span className="text-amber-700 font-semibold">₹{govtShare.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-[11px]">
                          <span>GoaMitra Operations & SOS Safety</span>
                          <span className="text-teal-700 font-semibold">₹{appShare.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="pt-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10.5px] text-gray-500">Estimated Carbon Offset</p>
                          <p className="text-[12px] font-bold text-emerald-800">🌱 14.8 kg CO₂ via Homestay vs Resort</p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={handleCopyReceipt}
                          className="px-3.5 py-1.5 bg-[#177F91] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#136675] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedReceipt ? (
                            <>
                              <span>✓</span>
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              <span>Share Receipt</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 2: MY GOA */}
        {activeTab === 'my_goa' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-black text-gray-900 leading-tight">
                  Your Personal Goa Vault
                </h3>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  {savedPlaces.length} saved places · {savedItineraries.length} tailored itineraries
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenMyGoaScreen()}
                className="px-3.5 py-2 bg-[#177F91] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#136675] transition-colors cursor-pointer"
              >
                Open Full Vault →
              </motion.button>
            </div>

            {/* Saved Places Preview List */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[14px] font-black text-gray-900">
                  Saved Places ({savedPlaces.length})
                </h4>
                <button
                  type="button"
                  onClick={() => onOpenMyGoaScreen('saved_places')}
                  className="text-xs font-bold text-[#177F91] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {savedPlaces.length === 0 ? (
                <div className="text-center py-6 px-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl">📍</span>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    No saved places yet. Tap the bookmark icon on any homestay, destination, or food dish to save it here!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedPlaces.slice(0, 4).map((place) => (
                    <div
                      key={place.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                          {place.image ? (
                            <img src={place.image} alt={place.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">📍</div>
                          )}
                        </div>
                        <div>
                          <h5 className="text-[13px] font-bold text-gray-900 leading-tight">
                            {place.title}
                          </h5>
                          <p className="text-[11px] text-gray-500">
                            {place.category} {place.location ? `· ${place.location}` : ''}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveSavedPlace(place.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Itineraries Preview */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[14px] font-black text-gray-900">
                  Saved Itineraries ({savedItineraries.length})
                </h4>
                <button
                  type="button"
                  onClick={() => onOpenMyGoaScreen('itineraries')}
                  className="text-xs font-bold text-[#177F91] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {savedItineraries.length === 0 ? (
                <div className="text-center py-6 px-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl">🗺️</span>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    No custom itineraries saved. Chat with GAI in the assistant tab to generate and save your dream Goan plan!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedItineraries.slice(0, 3).map((itinerary) => (
                    <div
                      key={itinerary.id}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-[13px] font-bold text-gray-900">
                          {itinerary.title}
                        </h5>
                        <button
                          onClick={() => onRemoveItinerary(itinerary.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove Itinerary"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {itinerary.content}
                      </p>
                      <span className="inline-block text-[10px] text-gray-400 font-semibold">
                        Saved {new Date(itinerary.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ALL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Travel Preferences Adjustments */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
              <h4 className="text-[14px] font-black text-gray-900">
                Trip Preferences
              </h4>

              {/* Month */}
              <div>
                <label className="text-[12px] font-bold text-gray-700 block mb-1">
                  Visiting Month
                </label>
                <select
                  value={preferences.travelMonth}
                  onChange={(e) => onUpdatePreferences({ travelMonth: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800"
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Party Type & Members */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[12px] font-bold text-gray-700 block mb-1">
                    Group Type
                  </label>
                  <select
                    value={preferences.travelType}
                    onChange={(e) => onUpdatePreferences({ travelType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800"
                  >
                    <option value="Solo Traveler">Solo Traveler</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends Group</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-bold text-gray-700 block mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.memberCount}
                    onChange={(e) => onUpdatePreferences({ memberCount: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Accessibility Settings Suite */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-black text-gray-900">
                    Accessibility & Inclusivity Suite
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Motor, visual, cognitive and auditory adaptations
                  </p>
                </div>
                <span className="text-xl">♿</span>
              </div>

              {/* Disability Preset */}
              <div>
                <label className="text-[12px] font-bold text-gray-700 block mb-1">
                  Disability / Assistance Profile
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(['none', 'deaf', 'unsound', 'visual', 'motor', 'everything'] as DisabilityType[]).map((mode) => {
                    const isSelected = accessibility.disabilityType === mode;
                    const labels: Record<DisabilityType, string> = {
                      none: 'Standard / None',
                      deaf: 'Hearing / Captions',
                      unsound: 'Soft & Calm',
                      visual: 'Visual High Contrast',
                      motor: 'Motor Assistance',
                      everything: 'Full Assistance',
                    };
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          const defaults = getDisabilityDefaults(mode);
                          onUpdateAccessibility(defaults);
                        }}
                        className={`py-2 px-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#177F91] text-white border-[#177F91] shadow-2xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {labels[mode]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">High Contrast Mode</span>
                    <span className="text-[10px] text-gray-500">Maximum contrast for outdoor sunlight</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={accessibility.highContrast}
                    onChange={(e) => onUpdateAccessibility({ highContrast: e.target.checked })}
                    className="w-4 h-4 accent-[#177F91] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Screen Audio Narration</span>
                    <span className="text-[10px] text-gray-500">Spoken readouts for text and destinations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={accessibility.narration}
                    onChange={(e) => onUpdateAccessibility({ narration: e.target.checked })}
                    className="w-4 h-4 accent-[#177F91] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Live Speech Captions</span>
                    <span className="text-[10px] text-gray-500">Display persistent captions for spoken content</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={accessibility.captions}
                    onChange={(e) => onUpdateAccessibility({ captions: e.target.checked })}
                    className="w-4 h-4 accent-[#177F91] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Eye-Control Gaze Dwell</span>
                    <span className="text-[10px] text-gray-500">Assistive hands-free pointer overlay</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={accessibility.eyeControl}
                    onChange={(e) => onUpdateAccessibility({ eyeControl: e.target.checked })}
                    className="w-4 h-4 accent-[#177F91] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* GAI Assistant Tone Settings */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-2.5">
              <h4 className="text-[14px] font-black text-gray-900">
                GAI Assistant Tone & Voice
              </h4>
              <div className="space-y-1.5">
                {TONE_OPTIONS.map((tone) => {
                  const isSelected = accessibility.gaiResponseTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => onUpdateAccessibility({ gaiResponseTone: tone.id })}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50/70 border-[#177F91] ring-1 ring-[#177F91]'
                          : 'bg-gray-50/60 border-gray-200 hover:bg-gray-100/60'
                      }`}
                    >
                      <span className="text-xl">{tone.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-gray-900">{tone.title}</h5>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-[#177F91]">Active</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{tone.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account & Data Management */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-2.5">
              <h4 className="text-[14px] font-black text-gray-900">
                Session & Preferences Reset
              </h4>
              <p className="text-xs text-gray-500">
                Reset your onboarding steps or clear local trip cache.
              </p>

              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2.5 px-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Restart Onboarding & Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
