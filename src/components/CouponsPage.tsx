import React from 'react';

interface CouponsPageProps {
  onBack: () => void;
}

export const CouponsPage: React.FC<CouponsPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-start max-w-[430px] mx-auto select-none relative w-full">
      {/* 1. Sticky Top Navigation Bar (Profile icon removed, balanced spacer on right) */}
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
          Coupons
        </h1>

        {/* Right Balance Spacer (Profile only on homescreen) */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Body Container (Centered text, natural full-page scrolling) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Empty coupon illustration */}
        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 mb-4 shadow-2xs">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
        </div>

        {/* Exact text requested */}
        <h2 className="text-[19px] font-black text-gray-900 tracking-tight">
          No Coupons available currently!
        </h2>
        <p className="text-[13px] text-gray-500 font-medium mt-1.5 max-w-[260px]">
          Check back during seasonal events for verified local dining and travel discounts.
        </p>
      </div>
    </div>
  );
};
