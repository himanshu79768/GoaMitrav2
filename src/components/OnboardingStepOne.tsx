import React, { useState } from 'react';
import culturalImg from '../assets/images/goa_cultural_tourism_1790841178468.jpg';
import heritageImg from '../assets/images/goa_heritage_tourism_1790841197716.jpg';

interface OnboardingStepOneProps {
  name: string;
  setName: (name: string) => void;
  selectedInterests: string[];
  toggleInterest: (interest: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  onContinue: () => void;
}

const MONTHS = [
  { name: 'January', tag: 'Best Weather & Music' },
  { name: 'February', tag: 'Carnival Season' },
  { name: 'March', tag: 'Shigmo & Beach Sun' },
  { name: 'April', tag: 'Warm & Quiet Stays' },
  { name: 'May', tag: 'Summer Vibes & Mangoes' },
  { name: 'June', tag: 'Monsoon Magic' },
  { name: 'July', tag: 'Lush Waterfalls' },
  { name: 'August', tag: 'Scenic Countryside' },
  { name: 'September', tag: 'Late Monsoon Charms' },
  { name: 'October', tag: 'Post-Monsoon Greenery' },
  { name: 'November', tag: 'Pleasant & Cool' },
  { name: 'December', tag: 'Festivals & Peak Vibes' },
];

export const OnboardingStepOne: React.FC<OnboardingStepOneProps> = ({
  name,
  setName,
  selectedInterests,
  toggleInterest,
  selectedMonth,
  setSelectedMonth,
  onContinue,
}) => {
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const isUnlocked =
    name.trim().length > 0 &&
    selectedInterests.length > 0 &&
    selectedMonth.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between px-6 pt-7 pb-8 max-w-[430px] mx-auto select-none">
      <div>
        {/* Top Header: Logo, 2-Segment Progress Bar (Skip removed) */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            {/* GOAMITRA Brand Wordmark */}
            <div className="flex items-center tracking-[0.28em] text-[13px] font-black text-[#111111]">
              <span>G</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#177F91] mx-0.5 inline-block" />
              <span>AMITRA</span>
            </div>

            {/* 2-Segment Progress Bar */}
            <div className="flex items-center gap-1.5">
              <div className="w-11 h-1.5 bg-[#FF6B4A] rounded-full transition-all" />
              <div className="w-11 h-1.5 bg-gray-200 rounded-full" />
            </div>
          </div>
        </header>

        {/* 1. Name Question */}
        <section className="mt-8">
          <span className="text-gray-500 font-medium text-[15px]">Hi there,</span>
          <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight leading-[1.15] mt-0.5">
            What’s your <span className="text-[#FF6B4A]">name?</span>
          </h1>
          <p className="text-gray-500 text-[13.5px] mt-1 font-normal">
            We’ll personalize your Goa experience.
          </p>

          {/* Name Input Box */}
          <div className="mt-3.5 relative rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-4 py-3.5 flex items-center gap-3 focus-within:border-[#FF6B4A] focus-within:ring-2 focus-within:ring-[#FF6B4A]/15 transition-all">
            <svg
              className="w-5 h-5 text-gray-400 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-transparent text-[15.5px] font-medium text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>
        </section>

        {/* 2. Interests Question - ONLY 2 CARDS: Cultural & Heritage */}
        <section className="mt-7">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            INTERESTS
          </span>
          <h2 className="text-[20px] font-bold text-gray-900 tracking-tight mt-0.5 leading-snug">
            What interests you the most?
          </h2>
          <p className="text-gray-500 text-[12.5px] mt-0.5">
            Choose one or more to personalize your experience.
          </p>

          {/* Tourism Cards: Exactly 2 Columns */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Cultural Tourism */}
            <div
              onClick={() => toggleInterest('Cultural Tourism')}
              className={`relative rounded-2xl h-[178px] overflow-hidden cursor-pointer shadow-sm transition-all border-2 ${
                selectedInterests.includes('Cultural Tourism')
                  ? 'border-[#FF6B4A] scale-[1.01] shadow-[0_6px_20px_rgba(255,107,74,0.25)]'
                  : 'border-transparent opacity-95 hover:opacity-100'
              }`}
            >
              <img
                src={culturalImg}
                alt="Cultural Tourism"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Selection Check Circle */}
              <div className="absolute top-2.5 right-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    selectedInterests.includes('Cultural Tourism')
                      ? 'bg-[#FF6B4A] text-white shadow-sm'
                      : 'border-2 border-white/80 bg-black/20'
                  }`}
                >
                  {selectedInterests.includes('Cultural Tourism') && (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Card Label */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <h3 className="font-bold text-[14px] leading-tight">Cultural Tourism</h3>
                <p className="text-[11px] text-white/80 leading-tight mt-0.5">
                  Festivals, art, food & local traditions
                </p>
              </div>
            </div>

            {/* Heritage Tourism */}
            <div
              onClick={() => toggleInterest('Heritage Tourism')}
              className={`relative rounded-2xl h-[178px] overflow-hidden cursor-pointer shadow-sm transition-all border-2 ${
                selectedInterests.includes('Heritage Tourism')
                  ? 'border-[#FF6B4A] scale-[1.01] shadow-[0_6px_20px_rgba(255,107,74,0.25)]'
                  : 'border-transparent opacity-95 hover:opacity-100'
              }`}
            >
              <img
                src={heritageImg}
                alt="Heritage Tourism"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Selection Check Circle */}
              <div className="absolute top-2.5 right-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    selectedInterests.includes('Heritage Tourism')
                      ? 'bg-[#FF6B4A] text-white shadow-sm'
                      : 'border-2 border-white/80 bg-black/20'
                  }`}
                >
                  {selectedInterests.includes('Heritage Tourism') && (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Card Label */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <h3 className="font-bold text-[14px] leading-tight">Heritage Tourism</h3>
                <p className="text-[11px] text-white/80 leading-tight mt-0.5">
                  Forts, churches, museums & historic sites
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Travel Month Question */}
        <section className="mt-7">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            TRAVEL MONTH
          </span>
          <h2 className="text-[20px] font-bold text-gray-900 tracking-tight mt-0.5 leading-snug">
            When do you plan to visit Goa?
          </h2>
          <p className="text-gray-500 text-[12.5px] mt-0.5">
            Choose your preferred month.
          </p>

          {/* Month Selector Dropdown Button */}
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
              className="w-full rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-4 py-3.5 flex items-center justify-between text-left hover:border-gray-300 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span
                  className={`text-[15px] font-medium ${
                    selectedMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {selectedMonth || 'Select month'}
                </span>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isMonthPickerOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu Modal */}
            {isMonthPickerOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 max-h-56 overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30">
                <div className="grid grid-cols-2 gap-1.5">
                  {MONTHS.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(m.name);
                        setIsMonthPickerOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left text-xs font-semibold transition-all ${
                        selectedMonth === m.name
                          ? 'bg-[#FFEAE5] text-[#FF6B4A] border border-[#FF6B4A]/30'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-bold">{m.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal truncate">
                        {m.tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Continue / Unlock Get Started Button */}
      <div className="pt-6 mt-6">
        <button
          type="button"
          disabled={!isUnlocked}
          onClick={onContinue}
          className={`w-full py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all ${
            isUnlocked
              ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-[0_8px_24px_rgba(255,107,74,0.38)] hover:brightness-105 active:scale-[0.98] cursor-pointer'
              : 'bg-gray-200/80 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Continue</span>
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
        </button>

        {!isUnlocked && (
          <p className="text-center text-[11.5px] text-gray-400 mt-2 font-medium">
            Enter your name, pick an interest & travel month to unlock
          </p>
        )}
      </div>
    </div>
  );
};
