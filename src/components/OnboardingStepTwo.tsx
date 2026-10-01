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
    subtitle: 'Exploring Goa at my own pace',
  },
  {
    type: 'Couple / Duo',
    count: 2,
    icon: '👥',
    subtitle: 'Romantic dining, sunsets & quiet beaches',
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
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between px-6 pt-7 pb-8 max-w-[430px] mx-auto select-none">
      <div>
        {/* Top Header: Back Button, Logo, 2-Segment Progress Bar (Skip removed) */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white border border-gray-200/80 shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
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
        <section className="mt-8">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            TRAVEL COMPANIONS
          </span>
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight leading-[1.2] mt-0.5">
            How many members are visiting <span className="text-[#FF6B4A]">Goa?</span>
          </h1>
          <p className="text-gray-500 text-[13.5px] mt-1">
            We’ll tailor recommendations for your party size.
          </p>
        </section>

        {/* Interactive Member Count Stepper */}
        <section className="mt-6 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              TOTAL MEMBERS
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[34px] font-extrabold text-[#111111] tabular-nums">
                {memberCount}
              </span>
              <span className="text-sm font-semibold text-gray-500">
                {memberCount === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>

          {/* Minus & Plus Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={memberCount <= 1}
              onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
              className={`w-11 h-11 rounded-full border flex items-center justify-center text-xl font-bold transition-all cursor-pointer active:scale-95 ${
                memberCount <= 1
                  ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 bg-white hover:border-[#FF6B4A] hover:text-[#FF6B4A]'
              }`}
              aria-label="Decrease members"
            >
              −
            </button>

            <button
              type="button"
              onClick={() => setMemberCount(memberCount + 1)}
              className="w-11 h-11 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-xl font-bold hover:bg-[#FF5436] active:scale-95 transition-all shadow-[0_4px_12px_rgba(255,107,74,0.3)] cursor-pointer"
              aria-label="Increase members"
            >
              +
            </button>
          </div>
        </section>

        {/* Travel Style Presets */}
        <section className="mt-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            WHO ARE YOU TRAVELING WITH?
          </span>

          <div className="space-y-2 mt-2.5">
            {PRESET_OPTIONS.map((item) => {
              const isSelected = travelType === item.type;
              return (
                <div
                  key={item.type}
                  onClick={() => {
                    setTravelType(item.type);
                    setMemberCount(item.count);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#FF6B4A] bg-[#FFF2EE] shadow-[0_4px_16px_rgba(255,107,74,0.12)]'
                      : 'border-gray-200/80 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="truncate">
                      <div className="text-[14.5px] font-bold text-gray-900 leading-tight">
                        {item.type}
                      </div>
                      <div className="text-[11.5px] text-gray-500 font-normal leading-tight mt-0.5 truncate">
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

      {/* Explore Goa Now Button */}
      <div className="pt-6 mt-6">
        <button
          type="button"
          onClick={onFinish}
          className="w-full py-4 rounded-2xl font-bold text-[16px] bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-[0_8px_24px_rgba(255,107,74,0.38)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
