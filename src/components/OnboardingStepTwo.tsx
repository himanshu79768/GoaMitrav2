import React from 'react';

interface OnboardingStepTwoProps {
  name: string;
  memberCount: number;
  setMemberCount: (count: number) => void;
  travelType: string;
  setTravelType: (type: string) => void;
  onBack: () => void;
  onFinish: () => void;
}

const PRESET_OPTIONS = [
  {
    type: 'Solo Traveler',
    count: 1,
    icon: '👤',
    subtitle: 'Exploring Goa solo (locked to 1 member)',
  },
  {
    type: 'Couple / Duo',
    count: 2,
    icon: '👥',
    subtitle: 'Romantic trip for two (locked to 2 members)',
  },
  {
    type: 'Friends / Group',
    count: 4,
    icon: '🏄‍♂️',
    subtitle: 'Water sports, shacks, nightlife & forts',
  },
  {
    type: 'Family Vacation',
    count: 5,
    icon: '👨‍👩‍👧‍👦',
    subtitle: 'Comfortable stays, heritage & kid-friendly fun',
  },
  {
    type: 'Large Group',
    count: 10,
    icon: '🚌',
    subtitle: 'Private villas, group tours & celebration',
  },
];

export const OnboardingStepTwo: React.FC<OnboardingStepTwoProps> = ({
  name,
  memberCount,
  setMemberCount,
  travelType,
  setTravelType,
  onBack,
  onFinish,
}) => {
  // Solo is locked to 1, Couple is locked to 2
  const isCountLocked = travelType === 'Solo Traveler' || travelType === 'Couple / Duo';

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#F7F7F5] flex flex-col justify-between max-w-[430px] mx-auto select-none overflow-hidden relative font-sans">
      {/* Scrollable Content Area (Auto-adjusts according to screen size) */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 pt-6 pb-6 no-scrollbar">
        {/* Top Header: Back Button, Logo, 2-Segment Progress Bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
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

            <div className="flex flex-col gap-1.5">
              {/* GOAMITRA Brand Wordmark */}
              <div className="flex items-center tracking-[0.28em] text-[12px] font-black text-[#111111]">
                <span>G</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#177F91] mx-0.5 inline-block" />
                <span>AMITRA</span>
              </div>

              {/* Progress Bar (2 segments filled) */}
              <div className="flex items-center gap-1.5">
                <div className="w-11 h-1.5 bg-[#FF6B4A] rounded-full" />
                <div className="w-11 h-1.5 bg-[#FF6B4A] rounded-full transition-all" />
              </div>
            </div>
          </div>
        </header>

        {/* Title Section */}
        <section className="mt-6 sm:mt-7">
          <span className="text-[10.5px] font-bold tracking-widest text-gray-400 uppercase">
            TRAVEL COMPANIONS
          </span>
          <h1 className="text-[26px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight leading-[1.2] mt-0.5">
            How many members are visiting <span className="text-[#FF6B4A]">Goa?</span>
          </h1>
          <p className="text-gray-500 text-[13px] mt-0.5">
            We’ll tailor recommendations for your party size.
          </p>
        </section>

        {/* Interactive Member Count Stepper (Locked for Solo & Couple) */}
        <section className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                TOTAL MEMBERS
              </span>
              {isCountLocked && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  Locked to {memberCount}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[30px] sm:text-[34px] font-extrabold text-[#111111] tabular-nums">
                {memberCount}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-500">
                {memberCount === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>

          {/* Minus & Plus Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              disabled={isCountLocked || memberCount <= 1}
              onClick={() => {
                if (!isCountLocked) {
                  setMemberCount(Math.max(1, memberCount - 1));
                }
              }}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center text-xl font-bold transition-all ${
                isCountLocked || memberCount <= 1
                  ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                  : 'border-gray-300 text-gray-700 bg-white hover:border-[#FF6B4A] hover:text-[#FF6B4A] active:scale-95 cursor-pointer'
              }`}
              aria-label="Decrease members"
            >
              −
            </button>

            <button
              type="button"
              disabled={isCountLocked}
              onClick={() => {
                if (!isCountLocked) {
                  setMemberCount(memberCount + 1);
                }
              }}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                isCountLocked
                  ? 'border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed opacity-60 shadow-none'
                  : 'bg-[#FF6B4A] text-white hover:bg-[#FF5436] active:scale-95 shadow-[0_4px_12px_rgba(255,107,74,0.3)] cursor-pointer'
              }`}
              aria-label="Increase members"
            >
              +
            </button>
          </div>
        </section>

        {/* Travel Style Presets */}
        <section className="mt-5 mb-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            WHO ARE YOU TRAVELING WITH?
          </span>

          <div className="space-y-2 mt-2">
            {PRESET_OPTIONS.map((item) => {
              const isSelected = travelType === item.type;
              return (
                <div
                  key={item.type}
                  onClick={() => {
                    setTravelType(item.type);
                    if (item.type === 'Solo Traveler') {
                      setMemberCount(1);
                    } else if (item.type === 'Couple / Duo') {
                      setMemberCount(2);
                    } else {
                      if (memberCount <= 2) {
                        setMemberCount(item.count);
                      }
                    }
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#FF6B4A] bg-[#FFF2EE] shadow-[0_4px_16px_rgba(255,107,74,0.12)]'
                      : 'border-gray-200/80 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl sm:text-2xl shrink-0">{item.icon}</span>
                    <div className="truncate">
                      <div className="text-[14px] sm:text-[14.5px] font-bold text-gray-900 leading-tight">
                        {item.type}
                      </div>
                      <div className="text-[11px] sm:text-[11.5px] text-gray-500 font-normal leading-tight mt-0.5 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Radio indicator */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-2 transition-all ${
                      isSelected
                        ? 'bg-[#FF6B4A] text-white'
                        : 'border-2 border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Persistent Bottom Action Bar (Fixed, never cutoff, auto-pads for all screens) */}
      <div className="shrink-0 z-20 px-5 sm:px-6 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] bg-[#F7F7F5]/95 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={onFinish}
          className="w-full py-3.5 sm:py-4 rounded-2xl font-bold text-[15.5px] sm:text-[16px] bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-[0_8px_24px_rgba(255,107,74,0.38)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Explore Goa Now</span>
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
      </div>
    </div>
  );
};
