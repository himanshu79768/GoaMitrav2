import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences } from '../types/onboarding';
import { haptics } from '../utils/haptics';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onEditPreferences: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onEditPreferences,
}) => {
  const [hapticsEnabled, setHapticsEnabled] = useState(() => haptics.getIsEnabled());
  const [hapticSoundEnabled, setHapticSoundEnabled] = useState(() => haptics.getIsSoundEnabled());

  const handleToggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    haptics.setEnabled(next);
    if (next) {
      haptics.impact('medium');
    }
  };

  const handleToggleHapticSound = () => {
    const next = !hapticSoundEnabled;
    setHapticSoundEnabled(next);
    haptics.setSoundEnabled(next);
    if (next) {
      haptics.impact('light');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
          {/* Backdrop with smooth blur and fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          />

          {/* Bottom Sheet Modal with silky spring curve and drag-to-dismiss */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 34,
              mass: 0.9,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) {
                haptics.impact('light');
                onClose();
              }
            }}
            className="w-full max-w-[430px] bg-[#F7F7F5] rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl border-t sm:border border-white/60 relative z-10 touch-none max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Handle (Interactive drag bar) */}
            <div className="w-12 h-1.5 bg-gray-300/80 hover:bg-gray-400 rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing transition-colors" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#177F91] to-[#2DD4BF] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {preferences.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {preferences.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Goa Explorer · Verified Traveler
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  haptics.impact('light');
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                aria-label="Close Profile"
              >
                ✕
              </motion.button>
            </div>

            {/* Saved Trip Details */}
            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  INTERESTS
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {preferences.tourismTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2.5 py-1 rounded-lg bg-[#FFEAE5] text-[#FF6B4A] text-xs font-semibold"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    VISITING MONTH
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {preferences.travelMonth}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    PARTY SIZE
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {preferences.memberCount} {preferences.memberCount === 1 ? 'Person' : 'People'}
                  </p>
                </div>
              </div>

              {/* iOS Tactile Haptics Engine Control */}
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📳</span>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-900 leading-tight">
                        Tactile Haptics
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Physical tap pulses & Taptic engine sensations
                      </p>
                    </div>
                  </div>

                  {/* iOS Style Switch */}
                  <button
                    type="button"
                    onClick={handleToggleHaptics}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer relative flex items-center ${
                      hapticsEnabled ? 'bg-[#FF6B4A]' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle haptics"
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm ${
                        hapticsEnabled ? 'ml-auto' : 'mr-auto'
                      }`}
                    />
                  </button>
                </div>

                {/* Tactile Live Test Buttons */}
                {hapticsEnabled && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Test Tactile Tiers
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => haptics.impact('light')}
                        className="py-1.5 px-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold active:scale-95 transition-all text-center"
                      >
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => haptics.impact('medium')}
                        className="py-1.5 px-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold active:scale-95 transition-all text-center"
                      >
                        Medium
                      </button>
                      <button
                        type="button"
                        onClick={() => haptics.impact('heavy')}
                        className="py-1.5 px-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold active:scale-95 transition-all text-center"
                      >
                        Heavy
                      </button>
                      <button
                        type="button"
                        onClick={() => haptics.notification('success')}
                        className="py-1.5 px-1 rounded-xl bg-[#FFEAE5] hover:bg-[#FFD7CE] text-[#FF6B4A] text-[11px] font-bold active:scale-95 transition-all text-center"
                      >
                        Success ✨
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  haptics.impact('medium');
                  onClose();
                  setTimeout(() => {
                    onEditPreferences();
                  }, 120);
                }}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-sm hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Change Travel Preferences</span>
                <span>↺</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptics.impact('light');
                  onClose();
                }}
                className="w-full py-3 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

