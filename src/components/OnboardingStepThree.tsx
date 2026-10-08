import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AccessibilitySettings,
  DisabilityType,
  getDisabilityDefaults,
} from '../types/onboarding';

interface OnboardingStepThreeProps {
  name: string;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (partial: Partial<AccessibilitySettings>) => void;
  onBack: () => void;
  onFinish: () => void;
}

const DISABILITY_OPTIONS: {
  id: DisabilityType;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  features: string[];
}[] = [
  {
    id: 'deaf',
    title: 'Deaf & Hard of Hearing',
    subtitle: 'Live visual subtitles, vibration/flash alert banners, zero audio reliance',
    icon: '🦻',
    badge: 'Visual Alerts & Captions',
    features: ['Live Captions Bar', 'Visual Flash Banners', 'Text Landmarks'],
  },
  {
    id: 'unsound',
    title: 'Unsound / Cognitive / Neurodivergent',
    subtitle: 'Calm soft-contrast palette, low sensory stimulus, comforting & plain language GAI',
    icon: '🧠',
    badge: 'Low Stimulus & Plain Language',
    features: ['Soft Calming Palette', 'Gentle Tone GAI', 'Zero Sensory Overload'],
  },
  {
    id: 'visual',
    title: 'Visual Impairment / Low Vision',
    subtitle: 'High contrast OLED theme, spoken audio narration (TTS), large legible typography',
    icon: '👁️',
    badge: 'High Contrast & Narration',
    features: ['High Contrast Theme', 'Voice Narration (TTS)', 'Sensory Rich Descriptions'],
  },
  {
    id: 'motor',
    title: 'Motor / Mobility & Eye Control',
    subtitle: 'Eye-tracking gaze dwell-click (hands-free), oversized touch buttons, voice control',
    icon: '🕹️',
    badge: 'Eye Control & Dwell Click',
    features: ['Eye-Tracking Dwell Cursor', 'Oversized Touch Targets', 'Voice Dictation'],
  },
  {
    id: 'everything',
    title: 'Comprehensive / Everything',
    subtitle: 'Universal accessibility enabled: Contrast + Audio Narration + Captions + Eye Control',
    icon: '🌐',
    badge: 'Universal Access Suite',
    features: ['High Contrast', 'Voice Narration', 'Live Captions', 'Eye Control', 'Plain Language'],
  },
];

export const OnboardingStepThree: React.FC<OnboardingStepThreeProps> = ({
  name,
  accessibility,
  onUpdateAccessibility,
  onBack,
  onFinish,
}) => {
  const handleSelectDisabilityToggle = (hasDisability: boolean) => {
    if (!hasDisability) {
      onUpdateAccessibility(getDisabilityDefaults('none'));
    } else {
      // Default to 'deaf' or preserve existing if already selected
      const currentType = accessibility.disabilityType !== 'none' ? accessibility.disabilityType : 'deaf';
      onUpdateAccessibility(getDisabilityDefaults(currentType));
    }
  };

  const handleSelectDisabilityType = (type: DisabilityType) => {
    onUpdateAccessibility(getDisabilityDefaults(type));
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#F7F7F5] flex flex-col justify-between max-w-xl md:max-w-2xl mx-auto select-none overflow-hidden relative font-sans">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 pt-6 pb-6 no-scrollbar">
        {/* Top Header: Back Button, Logo, 3-Segment Progress Bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              aria-label="Go back to Step 2"
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

              {/* Progress Bar (3 of 3 segments filled) */}
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-1.5 bg-[#FF6B4A] rounded-full" />
                <div className="w-8 h-1.5 bg-[#FF6B4A] rounded-full" />
                <div className="w-8 h-1.5 bg-[#FF6B4A] rounded-full transition-all" />
              </div>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-orange-100/80 border border-orange-200/60 text-[#FF6B4A] text-[11px] font-extrabold tracking-wide uppercase">
            Step 3 of 3
          </div>
        </header>

        {/* Title Section */}
        <section className="mt-5 sm:mt-6">
          <span className="text-gray-500 font-medium text-[13px]">Accessibility & Care, {name}</span>
          <h1 className="text-[25px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight leading-[1.2] mt-0.5">
            Do you have any <span className="text-[#FF6B4A]">disability</span> or need accessibility support?
          </h1>
          <p className="text-gray-500 text-[13px] mt-1 font-normal leading-relaxed">
            Goamitra adapts contrast, audio narration, subtitles, eye-control dwell navigation, and AI personality to suit your physical and sensory comfort.
          </p>
        </section>

        {/* Yes / No Binary Selection Cards */}
        <section className="mt-5 grid grid-cols-2 gap-3">
          {/* Option: NO */}
          <button
            type="button"
            onClick={() => handleSelectDisabilityToggle(false)}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              !accessibility.hasDisability
                ? 'bg-white border-[#177F91] shadow-[0_4px_16px_rgba(23,127,145,0.14)] ring-2 ring-[#177F91]/20'
                : 'bg-white/80 border-gray-200/90 hover:bg-white active:scale-[0.99]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">✨</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  !accessibility.hasDisability
                    ? 'bg-[#177F91] text-white'
                    : 'border-2 border-gray-300'
                }`}
              >
                {!accessibility.hasDisability && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                No, Standard
              </h3>
              <p className="text-[11.5px] text-gray-500 mt-0.5 leading-snug">
                Fast & standard visual interface
              </p>
            </div>
          </button>

          {/* Option: YES */}
          <button
            type="button"
            onClick={() => handleSelectDisabilityToggle(true)}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              accessibility.hasDisability
                ? 'bg-white border-[#FF6B4A] shadow-[0_4px_16px_rgba(255,107,74,0.16)] ring-2 ring-[#FF6B4A]/25'
                : 'bg-white/80 border-gray-200/90 hover:bg-white active:scale-[0.99]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">♿</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  accessibility.hasDisability
                    ? 'bg-[#FF6B4A] text-white'
                    : 'border-2 border-gray-300'
                }`}
              >
                {accessibility.hasDisability && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                Yes, I Need Support
              </h3>
              <p className="text-[11.5px] text-gray-500 mt-0.5 leading-snug">
                Turn on assistive sensory tools
              </p>
            </div>
          </button>
        </section>

        {/* Animated Dropdown Accordion if "YES" is selected */}
        <AnimatePresence>
          {accessibility.hasDisability && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 overflow-hidden"
            >
              <div className="p-4 rounded-3xl bg-white border border-orange-200/70 shadow-[0_4px_24px_rgba(255,107,74,0.06)]">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-[14px] font-extrabold text-gray-900 flex items-center gap-1.5">
                      <span>Adaptive Disability Profile</span>
                    </h3>
                    <p className="text-[11.5px] text-gray-500 mt-0.5">
                      Select your assistance need to adapt the entire application and GAI:
                    </p>
                  </div>
                </div>

                {/* Animated Drop Down List of Options */}
                <div className="mt-3 space-y-2.5">
                  {DISABILITY_OPTIONS.map((opt) => {
                    const isSelected = accessibility.disabilityType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectDisabilityType(opt.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#FFF6F3] border-[#FF6B4A] shadow-[0_2px_10px_rgba(255,107,74,0.12)] ring-1 ring-[#FF6B4A]/30'
                            : 'bg-white border-gray-200/80 hover:bg-gray-50/70'
                        }`}
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[13.5px] font-bold text-gray-900 truncate">
                              {opt.title}
                            </h4>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                                isSelected
                                  ? 'bg-[#FF6B4A] text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-gray-500 mt-1 leading-snug">
                            {opt.subtitle}
                          </p>

                          {/* Quick features pill list */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {opt.features.map((feat, i) => (
                              <span
                                key={i}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                  isSelected
                                    ? 'bg-white text-[#FF6B4A] border border-[#FF6B4A]/30'
                                    : 'bg-gray-100/90 text-gray-600'
                                }`}
                              >
                                ✓ {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Live Active Systems Indicator */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-gray-700">Live Assist Engine Active</span>
                  </div>
                  <span className="font-bold text-[#FF6B4A]">Full app & GAI customized</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="shrink-0 z-20 px-5 sm:px-6 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] bg-[#F7F7F5]/95 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center">
        <button
          type="button"
          onClick={onFinish}
          className="w-full max-w-sm sm:max-w-md py-3.5 sm:py-4 rounded-2xl font-bold text-[15.5px] sm:text-[16px] bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-[0_8px_24px_rgba(255,107,74,0.38)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Complete Setup & Enter Goa</span>
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
