/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingStepOne } from './components/OnboardingStepOne';
import { OnboardingStepTwo } from './components/OnboardingStepTwo';
import { HeroSection } from './components/HeroSection';
import { ModuleGrid } from './components/ModuleGrid';
import { GAIChatPage } from './components/GAIChatPage';
import { StayPage } from './components/StayPage';
import { UserProfileModal } from './components/UserProfileModal';
import { UserPreferences, DEFAULT_PREFERENCES } from './types/onboarding';

const ONBOARDING_COMPLETED_KEY = 'goamitra_onboarding_completed';
const USER_PREFERENCES_KEY = 'goamitra_user_preferences';

export default function App() {
  // Check localStorage: if onboarding completed once, show homepage directly on refresh
  const [currentScreen, setCurrentScreen] = useState<
    'onboarding_step_1' | 'onboarding_step_2' | 'homepage' | 'gai_chat' | 'stay'
  >(() => {
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

  // Profile Modal state on Homepage
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Optional initial prompt when transitioning to GAI chat
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
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

    setCurrentScreen('homepage');
  };

  const handleOpenChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setCurrentScreen('gai_chat');
  };

  // Smooth right-to-left transition variant matching other screens
  const pageVariants = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-25%', opacity: 0 },
  };

  const pageTransition = {
    duration: 0.35,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  return (
    <main className="w-full min-h-screen bg-[#E5E5DF] sm:py-0 flex items-center justify-center">
      {/* Mobile Screen Viewport Container */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#F7F7F5] relative shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-x-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Name, Tourism Type, Travel Month */}
          {currentScreen === 'onboarding_step_1' && (
            <motion.div
              key="step_1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-screen"
            >
              <OnboardingStepOne
                name={name}
                setName={setName}
                selectedInterests={selectedInterests}
                toggleInterest={toggleInterest}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                onContinue={() => setCurrentScreen('onboarding_step_2')}
              />
            </motion.div>
          )}

          {/* Step 2: Member Count & Group Type */}
          {currentScreen === 'onboarding_step_2' && (
            <motion.div
              key="step_2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-screen"
            >
              <OnboardingStepTwo
                name={name.trim() || 'Explorer'}
                memberCount={memberCount}
                setMemberCount={setMemberCount}
                travelType={travelType}
                setTravelType={setTravelType}
                onBack={() => setCurrentScreen('onboarding_step_1')}
                onFinish={handleFinishOnboarding}
              />
            </motion.div>
          )}

          {/* Step 3: Main Homepage */}
          {currentScreen === 'homepage' && (
            <motion.div
              key="homepage"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-screen flex flex-col justify-start pb-6"
            >
              {/* Hero Section with personalized name, tourism type, and travel month */}
              <HeroSection
                preferences={savedPreferences}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenChat={() => handleOpenChat()}
              />

              {/* 2-Column Module Grid: Stay, Destinations, Food, Culture, Coupons, Emergency */}
              <ModuleGrid onOpenStay={() => setCurrentScreen('stay')} />

              {/* Travel Profile Modal */}
              <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                preferences={savedPreferences}
                onEditPreferences={() => {
                  setIsProfileOpen(false);
                  setCurrentScreen('onboarding_step_1');
                }}
              />
            </motion.div>
          )}

          {/* Step 4: Stay Page (Hotels & Village Homestays) */}
          {currentScreen === 'stay' && (
            <motion.div
              key="stay"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-screen"
            >
              <StayPage
                preferences={savedPreferences}
                onBack={() => setCurrentScreen('homepage')}
                onOpenProfile={() => setIsProfileOpen(true)}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
              />
            </motion.div>
          )}

          {/* Step 5: GAI AI Travel Chatbot Page */}
          {currentScreen === 'gai_chat' && (
            <motion.div
              key="gai_chat"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-screen"
            >
              <GAIChatPage
                preferences={savedPreferences}
                initialPrompt={chatInitialPrompt}
                onBack={() => {
                  setChatInitialPrompt(undefined);
                  setCurrentScreen('homepage');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
