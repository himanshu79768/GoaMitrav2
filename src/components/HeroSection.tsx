import React from 'react';
import { motion } from 'motion/react';
import heroSummerImage from '../assets/images/hero.png';
import heroWinterImage from '../assets/images/divar_paddy_winter_1790959654093.jpg';
import heroRainyImage from '../assets/images/dudhsagar_rainy_1790959667095.jpg';
import { UserPreferences } from '../types/onboarding';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroSectionProps {
  preferences: UserPreferences;
  onOpenProfile: () => void;
  onOpenChat: () => void;
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
      src: heroWinterImage,
      alt: 'Divar Island Paddy Fields in Misty Winter',
    };
  }

  // Summer / Default: March, April, May
  return {
    src: heroSummerImage,
    alt: 'Goa Coastal Beach Landscape in Summer',
  };
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  preferences,
  onOpenProfile,
  onOpenChat,
}) => {
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
        {/* Subtle, translucent overlay: keeps hero image vibrant and visible through liquid glass GAI bar */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 18%, rgba(255,255,255,0.12) 46%, rgba(247,247,245,0.28) 68%, rgba(247,247,245,0.88) 88%, #F7F7F5 100%)',
          }}
        />
      </div>

      {/* Top Bar: Location Pill, PWA Install & Profile Button */}
      <div className="flex items-center justify-between pt-1 gap-2">
        {/* Location Pill */}
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenProfile}
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

          {/* Profile Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={onOpenProfile}
            className="water-drop-lens w-10 h-10 rounded-full bg-white/20 border border-white/60 flex items-center justify-center text-[#1E293B] transition-all cursor-pointer"
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
          </motion.button>
        </div>
      </div>

      {/* Greeting Area */}
      <div className="mt-7 mb-5">
        <h2 className="text-[23px] font-semibold text-[#111111] tracking-tight leading-snug">
          Good morning,
        </h2>

        {/* User Name with SVG Sun Icon */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[35px] font-extrabold text-[#111111] tracking-tight truncate max-w-[280px]">
            {preferences.name || 'User'}
          </span>

          {/* Clean Radiant SVG Sun Icon */}
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
        </div>

        {/* Subtitle with Travel Month context */}
        <p className="mt-2 text-[14.5px] font-medium text-[#4B5763] leading-[1.38]">
          Ready to explore Goa in {preferences.travelMonth || 'today'}?
          <br />
          Let’s plan something amazing.
        </p>
      </div>

      {/* AI Search / GAI Bar with Slow Soft Border & iOS Liquid Glass Effect (Redirects to GAI Chat) */}
      <div className="relative mt-6">
        {/* Soft, Slow Animated Non-Harsh Border (No colorful gradient) */}
        <div className="relative p-[1.5px] rounded-full gai-soft-liquid-border shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_16px_rgba(255,255,255,0.45)]">
          {/* Inner iOS Liquid Glassmorphism Pill: Click opens Chatbot */}
          <div
            onClick={onOpenChat}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenChat();
            }}
            className="water-drop-lens flex items-center justify-between p-2 pl-3 rounded-full bg-white/10 sm:bg-white/12 border border-white/50 active:scale-[0.99] transition-all cursor-pointer"
          >
            {/* Left: Search Button */}
            <div className="flex items-center gap-3 min-w-0 flex-1 z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/50 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.85)] flex items-center justify-center text-[#222E3A] shrink-0">
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
              </div>

              {/* Prompt Texts */}
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-[15.5px] font-bold text-[#141C24] tracking-tight leading-tight truncate drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
                  Ask GAI anything...
                </span>
                <span className="text-[12px] text-[#374151] font-semibold tracking-normal truncate mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  Find places, food, routes, safety info...
                </span>
              </div>
            </div>

            {/* Right: Circular Arrow Action Button */}
            <div
              className="w-10 h-10 rounded-full bg-white/28 backdrop-blur-md border border-white/60 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#111111] hover:scale-105 active:scale-95 transition-all shrink-0 ml-1 z-10"
              aria-label="Open GAI Chat"
            >
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
