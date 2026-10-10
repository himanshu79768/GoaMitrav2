import React from 'react';
import { motion } from 'motion/react';
import { UserPreferences } from '../types/onboarding';

interface HelpProfilePageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onOpenEmergency: () => void;
  onOpenProfile: () => void;
}

export const HelpProfilePage: React.FC<HelpProfilePageProps> = ({
  preferences,
  onBack,
  onOpenEmergency,
  onOpenProfile,
}) => {
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between select-none relative overflow-hidden w-full font-sans">
      {/* 1. Sticky Top Navigation Bar */}
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
        <h1 className="text-[20px] font-black text-[#111111] tracking-tight">
          Help & Profile
        </h1>

        {/* Right Balance Spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Scrollable Body */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-4 pb-12 space-y-4 min-h-0 overscroll-contain touch-pan-y no-scrollbar max-w-xl mx-auto w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* User Quick Identity Pill */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#177F91] to-[#2DD4BF] text-white flex items-center justify-center font-bold text-base shadow-xs">
              {preferences.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">
                {preferences.name}
              </h2>
              <p className="text-[12px] text-gray-500 font-medium">
                {preferences.travelMonth} · {preferences.memberCount} {preferences.memberCount === 1 ? 'Guest' : 'Guests'} · {preferences.travelType}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#EAF5EE] text-[#059669] text-[11px] font-bold border border-[#A7F3D0]/60">
            Active Trip
          </span>
        </div>

        {/* Section Heading */}
        <div className="px-1 pt-1">
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
            Choose Section
          </p>
        </div>

        {/* TWO PROMINENT TILES */}
        <div className="space-y-3.5">
          {/* TILE 1: Help (Emergency) */}
          <motion.div
            onClick={onOpenEmergency}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[24px] border border-red-200/80 p-5 shadow-[0_4px_20px_rgba(225,29,72,0.06)] cursor-pointer group transition-all relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#FB7185]" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#FEECEC] text-[#E11D48] flex items-center justify-center shrink-0 shadow-xs">
                  {/* Emergency Shield / Cross Icon */}
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm3 10h-2v3h-2v-3H8v-2h3V7h2v3h3v2z" />
                  </svg>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10.5px] font-bold uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    24x7 Immediate Assistance
                  </div>
                  <h3 className="text-[18px] font-black text-gray-900 tracking-tight leading-tight">
                    Help (Emergency)
                  </h3>
                </div>
              </div>

              {/* Arrow button */}
              <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>
            </div>

            <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">
              Instant SOS countdown, Goa Police & Tourist Helplines (112), Medical Hospitals, Women Safety, and roadside vehicle breakdown assistance across North & South Goa.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-bold">
                🚨 Police 112
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-bold">
                🚑 Ambulance 108
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-bold">
                🏖️ Tourist Helpline
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-bold">
                📍 Live GPS Check-in
              </span>
            </div>
          </motion.div>

          {/* TILE 2: Profile page */}
          <motion.div
            onClick={onOpenProfile}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[24px] border border-teal-200/80 p-5 shadow-[0_4px_20px_rgba(20,184,166,0.06)] cursor-pointer group transition-all relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#177F91] via-[#0F766E] to-[#2DD4BF]" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#E6F4F6] text-[#177F91] flex items-center justify-center shrink-0 shadow-xs">
                  {/* User Profile / Identity Icon */}
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10.5px] font-bold uppercase tracking-wider mb-1">
                    Your Travel Account & Impact
                  </div>
                  <h3 className="text-[18px] font-black text-gray-900 tracking-tight leading-tight">
                    Profile page
                  </h3>
                </div>
              </div>

              {/* Arrow button */}
              <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-[#177F91] group-hover:text-white transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>
            </div>

            <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">
              Explore your personal Goan dashboard: view your <strong>Impact Receipt</strong> pie chart (how your money supports locals vs app vs govt), access <strong>MY GOA</strong> saved places, and customize <strong>All Settings</strong>.
            </p>

            {/* Quick Profile Overview */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/60">
                🧾 Impact Receipt (78% Local)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200/60">
                🌴 MY GOA Vault
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-bold">
                ⚙️ All Settings
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-medium">
                👤 {preferences.name}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
