import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import heroSummerImage from '../assets/images/hero.png';
import heroWinterImage from '../assets/images/divar_paddy_winter_1790959654093.jpg';
import heroRainyImage from '../assets/images/dudhsagar_rainy_1790959667095.jpg';
import { UserPreferences } from '../types/onboarding';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroSectionProps {
  preferences: UserPreferences;
  onOpenChat: () => void;
  onOpenMyGoa: () => void;
  onOpenNameDialog: () => void;
  onLogout: () => void;
  isAwakened?: boolean;
  hasNewProfileItem?: boolean;
}

const getHeroDetails = (monthStr: string = '') => {
  const m = monthStr.toLowerCase().trim();

  // Rainy / Monsoon: June, July, August, September
  if (
    m.includes('june') ||
    m.includes('july') ||
    m.includes('august') ||
    m.includes('september') ||
    m.includes('rain') ||
    m.includes('monsoon')
  ) {
    return {
      season: 'rainy' as const,
      src: heroRainyImage,
      alt: 'Dudhsagar Waterfall in Rainy Season',
    };
  }

  // Winter: October, November, December, January, February
  if (
    m.includes('october') ||
    m.includes('november') ||
    m.includes('december') ||
    m.includes('january') ||
    m.includes('february') ||
    m.includes('winter')
  ) {
    return {
      season: 'winter' as const,
      src: heroWinterImage,
      alt: 'Divar Island Paddy Fields in Misty Winter',
    };
  }

  // Summer / Default: March, April, May
  return {
    season: 'summer' as const,
    src: heroSummerImage,
    alt: 'Goa Coastal Beach Landscape in Summer',
  };
};

const renderSeasonIcon = (season: 'summer' | 'winter' | 'rainy') => {
  if (season === 'rainy') {
    return (
      <svg
        className="w-8 h-8 drop-shadow-sm select-none shrink-0"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Rain"
        role="img"
      >
        <circle cx="16" cy="16" r="14" fill="#3B82F6" fillOpacity="0.16" />
        <path
          d="M10 16.5C8.343 16.5 7 15.157 7 13.5c0-1.5 1.1-2.75 2.55-2.95A4.502 4.502 0 0118 9c1.9 0 3.5 1.25 4.1 3C23.2 12.3 24 13.3 24 14.5c0 1.657-1.343 3-3 3H10z"
          fill="#3B82F6"
        />
        <line x1="10" y1="19.5" x2="8.5" y2="24" stroke="#1D4ED8" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="15" y1="19.5" x2="13.5" y2="24" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="20" y1="19.5" x2="18.5" y2="24" stroke="#1D4ED8" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (season === 'winter') {
    return (
      <svg
        className="w-8 h-8 drop-shadow-sm select-none shrink-0"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Winter Cold"
        role="img"
      >
        <circle cx="16" cy="16" r="14" fill="#0EA5E9" fillOpacity="0.18" />
        <g stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round">
          <line x1="16" y1="6" x2="16" y2="26" />
          <line x1="6" y1="16" x2="26" y2="16" />
          <line x1="9" y1="9" x2="23" y2="23" />
          <line x1="9" y1="23" x2="23" y2="9" />
          <path d="M13 8.5l3 3 3-3" />
          <path d="M13 23.5l3-3 3 3" />
          <path d="M8.5 13l3 3-3 3" />
          <path d="M23.5 13l-3 3 3 3" />
        </g>
        <circle cx="16" cy="16" r="3" fill="#38BDF8" />
      </svg>
    );
  }

  // Summer
  return (
    <svg
      className="w-8 h-8 drop-shadow-sm select-none shrink-0"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sun"
      role="img"
    >
      <circle cx="16" cy="16" r="9" fill="#F59E0B" fillOpacity="0.18" />
      <g stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round">
        <line x1="16" y1="2" x2="16" y2="5" />
        <line x1="16" y1="27" x2="16" y2="30" />
        <line x1="2" y1="16" x2="5" y2="16" />
        <line x1="27" y1="16" x2="30" y2="16" />
        <line x1="6.1" y1="6.1" x2="8.3" y2="8.3" />
        <line x1="23.7" y1="23.7" x2="25.9" y2="25.9" />
        <line x1="6.1" y1="25.9" x2="8.3" y2="23.7" />
        <line x1="23.7" y1="8.3" x2="25.9" y2="6.1" />
      </g>
      <circle cx="16" cy="16" r="6.2" fill="#FBBF24" />
      <circle cx="16" cy="16" r="5.6" fill="#F59E0B" />
      <circle cx="14.8" cy="14.8" r="4.8" fill="#FCD34D" fillOpacity="0.85" />
    </svg>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  preferences,
  onOpenChat,
  onOpenMyGoa,
  onOpenNameDialog,
  onLogout,
  isAwakened = false,
  hasNewProfileItem = false,
}) => {
  // Local state for profile dropdown menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derive trip label from preferences
  const primaryInterest = preferences.tourismTypes[0] || 'Adventure';
  const tripTag = primaryInterest.replace(' Tourism', '');

  // Dynamic seasonal hero image selection based on travel month
  const currentHero = getHeroDetails(preferences.travelMonth);

  return (
    <div className="relative isolate pt-5 pb-5 px-5 select-none">
      {/* Background Hero Photo Container extending through GAI pill */}
      <div className="absolute inset-0 top-0 h-[495px] overflow-hidden pointer-events-none -z-10">
        <img
          key={currentHero.src}
          src={currentHero.src}
          alt={currentHero.alt}
          className="w-full h-full object-cover object-center scale-[1.02] transition-opacity duration-300"
          loading="eager"
        />

        {/* Seasonal Animated Screen Effects Overlay */}
        {currentHero.season === 'rainy' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: 18 }).map((_, i) => {
              const left = (i * 5.8 + (i % 3) * 2.1) % 96;
              const duration = 0.85 + (i % 5) * 0.2;
              const delay = (i * 0.12) % 1.5;
              const height = 18 + (i % 4) * 8;
              return (
                <div
                  key={i}
                  className="rain-drop"
                  style={{
                    left: `${left}%`,
                    height: `${height}px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        {currentHero.season === 'winter' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="fog-mist-layer" />
            <div className="fog-mist-layer-secondary" />
          </div>
        )}

        {currentHero.season === 'summer' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="summer-sunbeam" />
          </div>
        )}

        {/* Subtle, translucent overlay: keeps hero image vibrant and visible through liquid glass GAI bar */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 18%, rgba(255,255,255,0.12) 46%, rgba(247,247,245,0.28) 68%, rgba(247,247,245,0.88) 88%, #F7F7F5 100%)',
          }}
        />
      </div>

      {/* Top Bar: Location Pill, PWA Install & Profile Button */}
      <div className="flex items-center justify-between pt-1 gap-2 relative z-30">
        {/* Location Pill */}
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="water-drop-lens flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 border border-white/60 transition-all cursor-pointer min-w-0"
          aria-label="Current trip preferences"
        >
          {/* Blue SVG Map Pin */}
          <svg
            className="w-4 h-4 text-[#0B72E3] shrink-0 z-10"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 2C6.686 2 4 4.686 4 8c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              clipRule="evenodd"
            />
          </svg>

          {/* Location Text */}
          <span className="text-[12.5px] font-bold text-[#18232D] tracking-tight truncate z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            North Goa <span className="font-normal text-[#475569]">·</span> {tripTag}
          </span>

          {/* Chevron Down */}
          <svg
            className="w-3.5 h-3.5 text-[#475569] ml-0.5 shrink-0 z-10"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </motion.button>

        <div className="flex items-center gap-2 shrink-0">
          {/* In-App PWA Install Prompt Button */}
          <PWAInstallButton />

          {/* Fixed-size Profile Button Wrapper to guarantee zero icon shifting */}
          <div className="relative w-10 h-10 shrink-0">
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="water-drop-lens w-10 h-10 rounded-full bg-white/20 border border-white/60 flex items-center justify-center text-[#1E293B] cursor-pointer relative"
              aria-label="User profile"
            >
              {/* SVG User Silhouette Icon */}
              <svg
                className="w-5 h-5 z-10"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>

              {/* Notification Badge Mark for New Liked Place / Itinerary */}
              {hasNewProfileItem && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B4A] opacity-80" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-tr from-[#FF6B4A] to-[#FF3819] border-2 border-white shadow-xs" />
                </span>
              )}
            </motion.button>

            {/* Translucent Small Dropdown Menu Box - Fixed below profile icon without hover scale */}
            <AnimatePresence>
              {isMenuOpen && (
                <>
                  {/* Transparent Backdrop to dismiss on click outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="liquid-glass-menu top-12 right-0 z-50 w-44 rounded-2xl p-1 flex flex-col gap-0.5 select-none overflow-hidden"
                  >
                    {/* Option 1: Name */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenNameDialog();
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[13px] font-bold text-[#18232D] hover:bg-white/40 active:bg-white/60 transition-colors text-left w-full cursor-pointer z-10"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-700 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <span>Name</span>
                    </button>

                    {/* Option 2: My Goa with Dynamic New Badge */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenMyGoa();
                      }}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[13px] font-bold text-[#18232D] hover:bg-white/40 active:bg-white/60 transition-colors text-left w-full cursor-pointer z-10"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-[#177F91] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>My Goa</span>
                      </div>
                      {hasNewProfileItem && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#FF6B4A] text-white text-[9px] font-extrabold uppercase tracking-wide shadow-xs">
                          NEW
                        </span>
                      )}
                    </button>

                    <div className="h-[1px] bg-white/40 my-0.5 z-10" />

                    {/* Option 3: Logout (Red Text) */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onLogout();
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[13px] font-bold text-red-600 hover:bg-red-500/20 active:bg-red-500/30 transition-colors text-left w-full cursor-pointer z-10"
                    >
                      <svg className="w-3.5 h-3.5 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Greeting Area */}
      <div className="mt-7 mb-5">
        <h2 className="text-[23px] font-semibold text-[#111111] tracking-tight leading-snug">
          Good morning,
        </h2>

        {/* User Name with Dynamic Seasonal Icon */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[35px] font-extrabold text-[#111111] tracking-tight truncate max-w-[280px]">
            {preferences.name || 'User'}
          </span>

          {/* Dynamic Season Icon (Summer Sun, Winter Cold Snowflake, Rainy Rain Cloud) */}
          {renderSeasonIcon(currentHero.season)}
        </div>

        {/* Subtitle with Travel Month context */}
        <p className="mt-2 text-[14.5px] font-medium text-[#4B5763] leading-[1.38]">
          Ready to explore Goa in {preferences.travelMonth || 'today'}?
          <br />
          Let’s plan something amazing.
        </p>
      </div>

      {/* AI Search / GAI Bar with Dynamic Awake State (Gradient Fill Colors & Pulsating Border Rings when Awakened) */}
      <div className="relative mt-6">
        <div
          className={`relative rounded-full transition-all duration-300 ${
            isAwakened
              ? 'p-[2.5px] gai-active-gradient-border scale-[1.01]'
              : 'p-[1.5px] gai-soft-liquid-border shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_16px_rgba(255,255,255,0.45)]'
          }`}
        >
          {/* Inner iOS Liquid Glassmorphism Pill: Click opens Chatbot / Bottomsheet */}
          <div
            onClick={onOpenChat}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenChat();
            }}
            className={`water-drop-lens flex items-center justify-between p-2 pl-3 rounded-full border transition-all cursor-pointer ${
              isAwakened
                ? 'bg-white/90 border-[#FF6B4A]/60 shadow-[0_4px_20px_rgba(255,107,74,0.3)]'
                : 'bg-white/10 sm:bg-white/12 border-white/50 active:scale-[0.99]'
            }`}
          >
            {/* Left: Search / Mic Icon */}
            <div className="flex items-center gap-3 min-w-0 flex-1 z-10">
              <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  isAwakened
                    ? 'bg-gradient-to-tr from-[#FF6B4A] to-[#FF8C66] text-white border-transparent shadow-[0_0_12px_rgba(255,107,74,0.6)] animate-pulse'
                    : 'bg-white/20 backdrop-blur-md border-white/50 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.85)] text-[#222E3A]'
                }`}
              >
                {isAwakened ? (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-[#2B3540]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                )}
              </div>

              {/* Prompt Texts */}
              <div className="flex flex-col min-w-0 pr-2">
                <span
                  className={`text-[15.5px] font-bold tracking-tight leading-tight truncate ${
                    isAwakened
                      ? 'text-[#FF6B4A]'
                      : 'text-[#141C24] drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]'
                  }`}
                >
                  {isAwakened ? 'GAI is listening...' : 'Ask GAI anything...'}
                </span>
                <span
                  className={`text-[12px] font-semibold tracking-normal truncate mt-0.5 ${
                    isAwakened
                      ? 'text-gray-700'
                      : 'text-[#374151] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'
                  }`}
                >
                  {isAwakened ? 'Say your question or say "Hey GAI!"' : 'Find places, food, routes, safety info...'}
                </span>
              </div>
            </div>

            {/* Right: Action Button */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ml-1 z-10 ${
                isAwakened
                  ? 'bg-[#FF6B4A] text-white shadow-[0_0_12px_rgba(255,107,74,0.5)]'
                  : 'bg-white/28 backdrop-blur-md border border-white/60 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9)] text-[#111111] hover:scale-105 active:scale-95'
              }`}
              aria-label="Open GAI Assistant"
            >
              {isAwakened ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-4.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <svg
                  className="w-4 h-4 text-[#111111]"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
