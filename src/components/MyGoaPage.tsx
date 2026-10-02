import React from 'react';
import { motion } from 'motion/react';
import { UserPreferences } from '../types/onboarding';

interface MyGoaPageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onEditPreferences: () => void;
  onAskGAI: (initialPrompt?: string) => void;
}

export const MyGoaPage: React.FC<MyGoaPageProps> = ({
  preferences,
  onBack,
  onEditPreferences,
  onAskGAI,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#F7F7F5] select-none overflow-hidden">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 px-5 pt-4 pb-3 bg-[#F7F7F5]/85 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between">
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

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 space-y-4">
        {/* Personalized Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-[#177F91] via-[#105E6D] to-[#0A434F] text-white shadow-xl"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide uppercase text-white/90">
                Tailored Itinerary
              </span>
              <h2 className="text-2xl font-black tracking-tight mt-2.5">
                Hello, {preferences.name || 'Explorer'}! 👋
              </h2>
              <p className="text-xs text-white/80 mt-1 leading-relaxed max-w-[260px]">
                Your customized Goa guide based on your travel month, interests, and party size.
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
              Your Trip Preferences
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
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              TRAVEL STYLE
            </span>
            <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
              {preferences.travelType || 'Couple / Duo'}
            </span>
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
      </div>
    </div>
  );
};
