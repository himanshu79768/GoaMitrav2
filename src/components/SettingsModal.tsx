import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPreferences,
  AccessibilitySettings,
  DisabilityType,
  GAIResponseTone,
  getDisabilityDefaults,
} from '../types/onboarding';
import { speakText, stopSpeaking } from '../utils/narration';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdateName: (newName: string) => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (partial: Partial<AccessibilitySettings>) => void;
  savedPlacesCount: number;
  savedItinerariesCount: number;
  hasNewProfileItem?: boolean;
  onOpenMyGoa: (tab?: 'itineraries' | 'saved_places') => void;
  onEditTravelPreferences?: () => void;
}

const TONE_OPTIONS: {
  id: GAIResponseTone;
  title: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: 'local',
    title: 'Warm & Goan Local',
    desc: 'Welcoming Susegad warmth, local phrases, authentic insider tips',
    icon: '🌴',
  },
  {
    id: 'concise',
    title: 'Concise & Direct',
    desc: 'Short 2-sentence answers, clear bullet points, zero unnecessary fluff',
    icon: '⚡',
  },
  {
    id: 'sensory',
    title: 'Descriptive & Sensory',
    desc: 'Rich evocative imagery (ocean breezes, spices, church bells, sand texture)',
    icon: '🌅',
  },
  {
    id: 'calm',
    title: 'Calm & Gentle',
    desc: 'Serene pacing, low-anxiety supportive guidance, comforting tone',
    icon: '🕊️',
  },
  {
    id: 'plain',
    title: 'Plain Language',
    desc: 'Easy-to-read everyday words, simplified grammar, cognitive-friendly',
    icon: '📖',
  },
];

const DISABILITY_PROFILES: {
  id: DisabilityType;
  title: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: 'none',
    title: 'Standard',
    icon: '✨',
    desc: 'Standard visual experience',
  },
  {
    id: 'deaf',
    title: 'Deaf & Hard of Hearing',
    icon: '🦻',
    desc: 'Visual flash alerts, live captions bar, no audio reliance',
  },
  {
    id: 'unsound',
    title: 'Unsound / Cognitive / Neurodivergent',
    icon: '🧠',
    desc: 'Low-stimulus soothing palette, reduced motion, calm GAI tone',
  },
  {
    id: 'visual',
    title: 'Visual Impairment',
    icon: '👁️',
    desc: 'High contrast theme, voice narration (TTS), large typography',
  },
  {
    id: 'motor',
    title: 'Motor & Eye Control',
    icon: '🕹️',
    desc: 'Eye-tracking gaze dwell clicking, large touch buttons, voice control',
  },
  {
    id: 'everything',
    title: 'Universal (Everything)',
    icon: '🌐',
    desc: 'All accessibility systems enabled simultaneously',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdateName,
  accessibility,
  onUpdateAccessibility,
  savedPlacesCount,
  savedItinerariesCount,
  hasNewProfileItem,
  onOpenMyGoa,
  onEditTravelPreferences,
}) => {
  const [nameInput, setNameInput] = useState(preferences.name);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setNameSavedSuccess(true);
      setTimeout(() => setNameSavedSuccess(false), 2000);
    }
  };

  const handleTestNarration = () => {
    if (isTestingVoice) {
      stopSpeaking();
      setIsTestingVoice(false);
    } else {
      setIsTestingVoice(true);
      speakText(
        `Hello ${preferences.name || 'traveler'}! Voice narration is active. Goa Artificial Intelligence is ready to guide you.`,
        accessibility.narrationSpeed || 1.0,
        () => setIsTestingVoice(false)
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
          {/* Backdrop Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
            className="w-full max-w-lg md:max-w-xl max-h-[90dvh] bg-[#F7F7F5] rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-white/60 relative z-10 flex flex-col overflow-hidden will-change-transform transform-gpu"
          >
            {/* Sheet Handle */}
            <div
              onClick={onClose}
              className="w-12 h-1.5 bg-gray-300/90 hover:bg-gray-400 rounded-full mx-auto mt-3 mb-1 cursor-pointer transition-colors shrink-0"
            />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#177F91] to-[#2DD4BF] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-gray-900 leading-tight">
                    Settings & Accessibility
                  </h3>
                  <p className="text-[11.5px] text-gray-500 font-medium">
                    Personalize your Goa experience & assistive tools
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                aria-label="Close Settings"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
              {/* SECTION 1: NAME MANAGEMENT */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                  YOUR NAME
                </label>
                <form onSubmit={handleSaveName} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/20 transition-all bg-[#FAF9F7]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#177F91] text-white hover:bg-[#126473] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    {nameSavedSuccess ? '✓ Saved' : 'Save'}
                  </button>
                </form>
                {preferences.travelMonth && (
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100 text-[11.5px] text-gray-500">
                    <span>
                      Visiting in <b>{preferences.travelMonth}</b> · {preferences.memberCount} {preferences.memberCount === 1 ? 'Traveler' : 'Travelers'}
                    </span>
                    {onEditTravelPreferences && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          setTimeout(onEditTravelPreferences, 120);
                        }}
                        className="text-[#FF6B4A] font-bold hover:underline cursor-pointer"
                      >
                        Edit Trip Details ↺
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 2: MY GOA SHORTCUT & SAVED ITEMS */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#FF6B4A] flex items-center justify-center font-bold text-lg shrink-0">
                    ❤️
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">My Goa</h4>
                      {hasNewProfileItem && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#FF6B4A] text-white text-[9px] font-extrabold uppercase">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5 truncate">
                      {savedPlacesCount} saved places · {savedItinerariesCount} itineraries
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMyGoa();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  Open My Goa →
                </button>
              </div>

              {/* SECTION 3: GAI RESPONSE TONE */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                    GAI RESPONSE TONE
                  </label>
                  <span className="text-[11px] font-bold text-[#177F91]">
                    {TONE_OPTIONS.find((t) => t.id === accessibility.gaiResponseTone)?.title}
                  </span>
                </div>
                <p className="text-[11.5px] text-gray-500 mb-3 leading-snug">
                  Choose how the AI companion talks, formats responses, and explains sights:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONE_OPTIONS.map((tone) => {
                    const isSelected = accessibility.gaiResponseTone === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => onUpdateAccessibility({ gaiResponseTone: tone.id })}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
                          isSelected
                            ? 'bg-[#EBF7F9] border-[#177F91] shadow-xs ring-1 ring-[#177F91]/30'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5">{tone.icon}</span>
                        <div className="min-w-0">
                          <h5 className="text-[12.5px] font-bold text-gray-900 leading-tight">
                            {tone.title}
                          </h5>
                          <p className="text-[10.5px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">
                            {tone.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: ACCESSIBILITY PRESET / DISABILITY PROFILE */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                    ACCESSIBILITY PROFILE (FOR DISABLED)
                  </label>
                  <span className="text-[11px] font-bold text-[#FF6B4A]">
                    {accessibility.disabilityType.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11.5px] text-gray-500 mb-3 leading-snug">
                  Quick preset profiles adapting the entire web app and GAI:
                </p>

                <div className="space-y-2">
                  {DISABILITY_PROFILES.map((prof) => {
                    const isSelected = accessibility.disabilityType === prof.id;
                    return (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => onUpdateAccessibility(getDisabilityDefaults(prof.id))}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#FFF6F3] border-[#FF6B4A] shadow-xs ring-1 ring-[#FF6B4A]/30'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{prof.icon}</span>
                          <div className="min-w-0">
                            <h5 className="text-[13px] font-bold text-gray-900 leading-tight">
                              {prof.title}
                            </h5>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                              {prof.desc}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#FF6B4A] text-white' : 'border border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: GRANULAR ACCESSIBILITY CONTROLS */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                  FINE-TUNED ACCESSIBILITY TOOLS
                </label>

                {/* 1. CONTRAST */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <h5 className="text-[13px] font-bold text-gray-900">Contrast Mode</h5>
                    <p className="text-[11px] text-gray-500">
                      High contrast sharp borders & dark luminance for low vision
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateAccessibility({
                          highContrast: !accessibility.highContrast,
                          contrastTheme: !accessibility.highContrast ? 'high_contrast' : 'standard',
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        accessibility.highContrast ? 'bg-[#177F91]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accessibility.highContrast ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100" />

                {/* 2. NARRATION (TEXT TO SPEECH) */}
                <div className="py-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-[13px] font-bold text-gray-900">Audio Narration (TTS)</h5>
                      <p className="text-[11px] text-gray-500">
                        Speaks page titles, notifications & GAI responses aloud
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateAccessibility({ narration: !accessibility.narration })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        accessibility.narration ? 'bg-[#FF6B4A]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accessibility.narration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {accessibility.narration && (
                    <div className="mt-2.5 pt-2 flex items-center justify-between bg-orange-50/70 p-2.5 rounded-xl border border-orange-200/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-700">Speed:</span>
                        {[0.8, 1.0, 1.2].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => onUpdateAccessibility({ narrationSpeed: spd })}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                              accessibility.narrationSpeed === spd
                                ? 'bg-[#FF6B4A] text-white'
                                : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleTestNarration}
                        className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#177F91] text-white hover:bg-[#126473] cursor-pointer"
                      >
                        {isTestingVoice ? '⏹ Stop' : '🔊 Test Voice'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="h-[1px] bg-gray-100" />

                {/* 3. AUDIO & HEARING / VISUAL FLASH ALERTS */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <h5 className="text-[13px] font-bold text-gray-900">
                      Visual Flash Alerts (For Deaf)
                    </h5>
                    <p className="text-[11px] text-gray-500">
                      Flashes high-contrast visual banner on events without audio
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAccessibility({ visualAlerts: !accessibility.visualAlerts })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      accessibility.visualAlerts ? 'bg-[#177F91]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accessibility.visualAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="h-[1px] bg-gray-100" />

                {/* 4. CAPTIONS / SUBTITLES */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <h5 className="text-[13px] font-bold text-gray-900">
                      Live Subtitles & Captions Bar
                    </h5>
                    <p className="text-[11px] text-gray-500">
                      Live floating subtitles overlay for speech & screen actions
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAccessibility({ captions: !accessibility.captions })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      accessibility.captions ? 'bg-[#FF6B4A]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accessibility.captions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="h-[1px] bg-gray-100" />

                {/* 5. SPEECH & VOICE INPUT */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <h5 className="text-[13px] font-bold text-gray-900">Voice Dictation Assist</h5>
                    <p className="text-[11px] text-gray-500">
                      Microphone input shortcuts & spoken guidance assistance
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAccessibility({ speechInput: !accessibility.speechInput })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      accessibility.speechInput ? 'bg-[#177F91]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accessibility.speechInput ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="h-[1px] bg-gray-100" />

                {/* 6. EYE CONTROL & DWELL CLICK */}
                <div className="py-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-[13px] font-bold text-gray-900">
                        Eye Control & Dwell Click
                      </h5>
                      <p className="text-[11px] text-gray-500">
                        Hands-free gaze navigation: auto-clicks elements after gaze dwell
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateAccessibility({ eyeControl: !accessibility.eyeControl })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        accessibility.eyeControl ? 'bg-cyan-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accessibility.eyeControl ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {accessibility.eyeControl && (
                    <div className="mt-2.5 pt-2 flex items-center justify-between bg-cyan-50/70 p-2.5 rounded-xl border border-cyan-200/50">
                      <span className="text-xs font-bold text-gray-700">Dwell duration:</span>
                      <div className="flex items-center gap-1.5">
                        {[1.2, 1.5, 2.0].map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => onUpdateAccessibility({ dwellTime: sec })}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                              accessibility.dwellTime === sec
                                ? 'bg-cyan-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            {sec}s
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Done Bar */}
            <div className="px-6 py-3.5 border-t border-gray-200/60 bg-[#F7F7F5] shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-xs hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
