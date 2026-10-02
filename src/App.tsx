/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingStepOne } from './components/OnboardingStepOne';
import { OnboardingStepTwo } from './components/OnboardingStepTwo';
import { HeroSection } from './components/HeroSection';
import { ModuleGrid } from './components/ModuleGrid';
import { GAIChatPage } from './components/GAIChatPage';
import { StayPage } from './components/StayPage';
import { DestinationsPage, DestinationItem, ALL_DESTINATIONS } from './components/DestinationsPage';
import { TravelPage } from './components/TravelPage';
import { FoodPage } from './components/FoodPage';
import { CulturePage } from './components/CulturePage';
import { CouponsPage } from './components/CouponsPage';
import { EmergencyPage } from './components/EmergencyPage';
import { MyGoaPage } from './components/MyGoaPage';
import { UserProfileModal } from './components/UserProfileModal';
import { UserPreferences, DEFAULT_PREFERENCES } from './types/onboarding';
import { preloadAllAppImages } from './utils/imagePreloader';
import { OfflineIndicator } from './components/OfflineIndicator';

const ONBOARDING_COMPLETED_KEY = 'goamitra_onboarding_completed';
const USER_PREFERENCES_KEY = 'goamitra_user_preferences';

type ScreenType =
  | 'onboarding_step_1'
  | 'onboarding_step_2'
  | 'homepage'
  | 'gai_chat'
  | 'stay'
  | 'destinations'
  | 'travel'
  | 'food'
  | 'culture'
  | 'coupons'
  | 'emergency'
  | 'my_goa';

export default function App() {
  // Preload all app photography and assets immediately on boot
  useEffect(() => {
    preloadAllAppImages();
  }, []);

  // Check localStorage: if onboarding completed once, show homepage directly on refresh
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const isCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (isCompleted === 'true') {
        return 'homepage';
      }
    } catch {
      // Fallback
    }
    return 'onboarding_step_1';
  });

  // Navigation direction tracker for pure slide transitions (forward: right-to-left, backward: left-to-right)
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');

  // Helper forward navigation
  const navigateForward = (screen: ScreenType) => {
    setNavDirection('forward');
    setCurrentScreen(screen);
  };

  // Helper backward navigation
  const navigateBack = (screen: ScreenType) => {
    setNavDirection('backward');
    setCurrentScreen(screen);
  };

  // Persistent user preferences
  const [savedPreferences, setSavedPreferences] = useState<UserPreferences>(() => {
    try {
      const isCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
      const stored = localStorage.getItem(USER_PREFERENCES_KEY);
      if (isCompleted === 'true' && stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PREFERENCES;
  });

  // User input states for onboarding
  const [name, setName] = useState<string>(() => savedPreferences.name || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => savedPreferences.tourismTypes || []);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => savedPreferences.travelMonth || '');
  const [memberCount, setMemberCount] = useState<number>(() => savedPreferences.memberCount || 2);
  const [travelType, setTravelType] = useState<string>(() => savedPreferences.travelType || 'Couple / Duo');

  // Selected Destination for Travel Page
  const [selectedDestinationForTravel, setSelectedDestinationForTravel] = useState<DestinationItem>(ALL_DESTINATIONS[0]);

  // Optional initial prompt when transitioning to GAI chat
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // Name Change Floating Dialog state
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [tempNameInput, setTempNameInput] = useState('');

  const handleOpenNameDialog = () => {
    setTempNameInput(savedPreferences.name || '');
    setIsNameDialogOpen(true);
  };

  const handleUpdateName = (newName: string) => {
    setName(newName);
    const updated = { ...savedPreferences, name: newName };
    setSavedPreferences(updated);
    try {
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update name in localStorage', e);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem(USER_PREFERENCES_KEY);
    } catch (e) {
      console.error('Failed to remove stored items', e);
    }
    setSavedPreferences(DEFAULT_PREFERENCES);
    setName('');
    setSelectedInterests([]);
    setSelectedMonth('');
    setMemberCount(2);
    setTravelType('Couple / Duo');
    navigateBack('onboarding_step_1');
  };

  const handleFinishOnboarding = () => {
    const finalPreferences: UserPreferences = {
      name: name.trim() || 'Explorer',
      tourismTypes:
        selectedInterests.length > 0
          ? selectedInterests
          : ['Cultural Tourism', 'Heritage Tourism'],
      travelMonth: selectedMonth || 'November',
      memberCount: memberCount || 2,
      travelType: travelType || 'Couple / Duo',
    };

    setSavedPreferences(finalPreferences);

    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(finalPreferences));
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }

    navigateForward('homepage');
  };

  const handleOpenChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    navigateForward('gai_chat');
  };

  const handleOpenTravelForDestination = (dest: DestinationItem) => {
    setSelectedDestinationForTravel(dest);
    navigateForward('travel');
  };



  // Pure Slide Transitions with Zero Fading and Zero Delay (Native iOS feel)
  const pageVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? '100%' : '-25%',
      opacity: 1, // NO FADE
    }),
    animate: {
      x: 0,
      opacity: 1, // NO FADE
      transition: {
        type: 'tween' as const,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        duration: 0.25,
      },
    },
    exit: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? '-25%' : '100%',
      opacity: 1, // NO FADE
      transition: {
        type: 'tween' as const,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        duration: 0.22,
      },
    }),
  };

  const isOnboarding = currentScreen === 'onboarding_step_1' || currentScreen === 'onboarding_step_2';

  return (
    <main className="w-full min-h-screen bg-[#E5E5DF] sm:py-0 flex items-center justify-center">
      {/* Mobile Screen Viewport Container */}
      <div className="w-full max-w-[430px] h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] relative shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Persistent Pre-warmed Homepage (Always Active in Background once onboarded) */}
        {!isOnboarding && (
          <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto flex flex-col justify-start pb-6 absolute inset-0 z-0 bg-[#F7F7F5]">
            <HeroSection
              preferences={savedPreferences}
              onOpenChat={() => handleOpenChat()}
              onOpenMyGoa={() => navigateForward('my_goa')}
              onOpenNameDialog={handleOpenNameDialog}
              onLogout={handleLogout}
            />

            <ModuleGrid
              onOpenStay={() => navigateForward('stay')}
              onOpenDestinations={() => navigateForward('destinations')}
              onOpenFood={() => navigateForward('food')}
              onOpenCulture={() => navigateForward('culture')}
              onOpenCoupons={() => navigateForward('coupons')}
              onOpenEmergency={() => navigateForward('emergency')}
            />
          </div>
        )}

        {/* Screen Transitions Layer */}
        <AnimatePresence custom={navDirection} initial={false}>
          {/* Step 1: Onboarding Step 1 */}
          {currentScreen === 'onboarding_step_1' && (
            <motion.div
              key="step_1"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <OnboardingStepOne
                name={name}
                setName={setName}
                selectedInterests={selectedInterests}
                toggleInterest={toggleInterest}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                onContinue={() => navigateForward('onboarding_step_2')}
              />
            </motion.div>
          )}

          {/* Step 2: Onboarding Step 2 */}
          {currentScreen === 'onboarding_step_2' && (
            <motion.div
              key="step_2"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <OnboardingStepTwo
                name={name.trim() || 'Explorer'}
                memberCount={memberCount}
                setMemberCount={setMemberCount}
                travelType={travelType}
                setTravelType={setTravelType}
                onBack={() => navigateBack('onboarding_step_1')}
                onFinish={handleFinishOnboarding}
              />
            </motion.div>
          )}

          {/* Step 4: Stay Page */}
          {currentScreen === 'stay' && (
            <motion.div
              key="stay"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <StayPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
              />
            </motion.div>
          )}

          {/* Step 5: Destinations Page */}
          {currentScreen === 'destinations' && (
            <motion.div
              key="destinations"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <DestinationsPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onSelectDestination={handleOpenTravelForDestination}
              />
            </motion.div>
          )}

          {/* Step 6: Travel Page */}
          {currentScreen === 'travel' && (
            <motion.div
              key="travel"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <TravelPage
                destination={selectedDestinationForTravel}
                preferences={savedPreferences}
                onBack={() => navigateBack('destinations')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
              />
            </motion.div>
          )}

          {/* Step 7: Food Page */}
          {currentScreen === 'food' && (
            <motion.div
              key="food"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <FoodPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
              />
            </motion.div>
          )}

          {/* Step 7.5: Culture Page */}
          {currentScreen === 'culture' && (
            <motion.div
              key="culture"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <CulturePage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onOpenProfile={() => setIsProfileOpen(true)}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
              />
            </motion.div>
          )}

          {/* Step 8: Coupons Page */}
          {currentScreen === 'coupons' && (
            <motion.div
              key="coupons"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <CouponsPage
                onBack={() => navigateBack('homepage')}
              />
            </motion.div>
          )}

          {/* Step 9: Emergency & Safety Page */}
          {currentScreen === 'emergency' && (
            <motion.div
              key="emergency"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <EmergencyPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
              />
            </motion.div>
          )}

          {/* Step 10: GAI Chatbot Page */}
          {currentScreen === 'gai_chat' && (
            <motion.div
              key="gai_chat"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <GAIChatPage
                preferences={savedPreferences}
                initialPrompt={chatInitialPrompt}
                onBack={() => {
                  setChatInitialPrompt(undefined);
                  navigateBack('homepage');
                }}
              />
            </motion.div>
          )}

          {/* Step 11: My Goa Screen */}
          {currentScreen === 'my_goa' && (
            <motion.div
              key="my_goa"
              custom={navDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5]"
            >
              <MyGoaPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onEditPreferences={() => navigateForward('onboarding_step_1')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Root-Level Floating Dialog Box for Changing Name (z-[9999] guarantees it renders ABOVE ModuleGrid) */}
        <AnimatePresence>
          {isNameDialogOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNameDialogOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs z-0"
              />

              {/* Floating Dialog Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 12 }}
                transition={{ type: 'spring', damping: 25, stiffness: 380 }}
                className="w-full max-w-[340px] bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-5 shadow-2xl relative z-10"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Change Name</h3>
                  <button
                    type="button"
                    onClick={() => setIsNameDialogOpen(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={tempNameInput}
                    onChange={(e) => setTempNameInput(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tempNameInput.trim()) {
                        handleUpdateName(tempNameInput.trim());
                        setIsNameDialogOpen(false);
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/15 transition-all"
                  />
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNameDialogOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tempNameInput.trim()) {
                        handleUpdateName(tempNameInput.trim());
                        setIsNameDialogOpen(false);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF6B4A] text-white shadow-md hover:bg-[#FF5436] active:scale-95 transition-all cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Offline Mode Banner Indicator */}
      <OfflineIndicator />
    </main>
  );
}
