/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { UserPreferences, SavedPlaceItem, SavedItineraryItem, DEFAULT_PREFERENCES } from './types/onboarding';
import { preloadAllAppImages } from './utils/imagePreloader';
import { OfflineIndicator } from './components/OfflineIndicator';

export interface ToastNotification {
  id: string;
  message: string;
  subMessage?: string;
  icon?: 'heart' | 'heart-broken' | 'itinerary' | 'check' | 'delete' | 'sparkles';
  type?: 'success' | 'info' | 'favorite' | 'remove';
}

const ONBOARDING_COMPLETED_KEY = 'goamitra_onboarding_completed';
const USER_PREFERENCES_KEY = 'goamitra_user_preferences';
const SAVED_PLACES_KEY = 'goamitra_saved_places';
const SAVED_ITINERARIES_KEY = 'goamitra_saved_itineraries';
const UNSEEN_PROFILE_ITEMS_KEY = 'goamitra_unseen_profile_items';

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

  // Name Change Floating Dialog state
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [tempNameInput, setTempNameInput] = useState('');

  // Keep track of current screen in a ref for popstate handling
  const currentScreenRef = React.useRef<ScreenType>(currentScreen);
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  // Synchronize browser history on boot
  useEffect(() => {
    if (!window.history.state || typeof window.history.state.screen !== 'string') {
      try {
        window.history.replaceState({ screen: currentScreen }, '');
      } catch {}
    }
  }, []);

  // System & Hardware Back Button Listener (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If Name Change dialog is open, close it
      if (isNameDialogOpen) {
        setIsNameDialogOpen(false);
      }

      const targetScreen = event.state?.screen as ScreenType | undefined;

      if (targetScreen) {
        setNavDirection('backward');
        setCurrentScreen(targetScreen);
      } else {
        // If history ran out or was at root state, but user is in a sub-screen,
        // navigate back to homepage instead of exiting the web app
        const active = currentScreenRef.current;
        if (active !== 'homepage' && active !== 'onboarding_step_1') {
          setNavDirection('backward');
          setCurrentScreen('homepage');
          try {
            window.history.pushState({ screen: 'homepage' }, '');
          } catch {}
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isNameDialogOpen]);

  // Helper forward navigation (pushes state to HTML5 history)
  const navigateForward = (screen: ScreenType) => {
    setNavDirection('forward');
    setCurrentScreen(screen);
    try {
      window.history.pushState({ screen }, '');
    } catch (e) {
      console.error('Failed to push history state', e);
    }
  };

  // Helper backward navigation
  const navigateBack = (screen: ScreenType) => {
    if (window.history.state && window.history.state.screen) {
      window.history.back();
    } else {
      setNavDirection('backward');
      setCurrentScreen(screen);
      try {
        window.history.replaceState({ screen }, '');
      } catch (e) {
        console.error('Failed to replace history state', e);
      }
    }
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

  // Saved Places State
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceItem[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_PLACES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Saved Itineraries State
  const [savedItineraries, setSavedItineraries] = useState<SavedItineraryItem[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_ITINERARIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Global Toast Notification State
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    const id = Date.now().toString();
    setActiveToast({ ...toast, id });
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 2800);
  }, []);

  // Unseen additions indicator badge state (shows dot on profile icon until user views My Goa)
  const [hasNewProfileItem, setHasNewProfileItem] = useState<boolean>(() => {
    try {
      return localStorage.getItem(UNSEEN_PROFILE_ITEMS_KEY) === 'true';
    } catch {}
    return false;
  });

  const handleToggleSavePlace = (place: SavedPlaceItem) => {
    setSavedPlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      const updated = exists ? prev.filter((p) => p.id !== place.id) : [place, ...prev];
      try {
        localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
      } catch {}
      // When a new place is liked/saved, show notification badge on profile
      if (!exists) {
        setHasNewProfileItem(true);
        try {
          localStorage.setItem(UNSEEN_PROFILE_ITEMS_KEY, 'true');
        } catch {}
        showToast({
          message: 'Saved to Liked Places',
          subMessage: place.title,
          icon: 'heart',
          type: 'favorite',
        });
      } else {
        showToast({
          message: 'Removed from Liked Places',
          subMessage: place.title,
          icon: 'heart-broken',
          type: 'remove',
        });
      }
      return updated;
    });
  };

  const handleRemoveSavedPlace = (id: string) => {
    setSavedPlaces((prev) => {
      const target = prev.find((p) => p.id === id);
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
      } catch {}
      showToast({
        message: 'Removed from Liked Places',
        subMessage: target?.title,
        icon: 'delete',
        type: 'remove',
      });
      return updated;
    });
  };

  const handleSaveItinerary = (itinerary: SavedItineraryItem) => {
    setSavedItineraries((prev) => {
      if (prev.some((i) => i.id === itinerary.id)) {
        showToast({
          message: 'Itinerary already in My Goa',
          subMessage: itinerary.title,
          icon: 'check',
          type: 'info',
        });
        return prev;
      }
      const updated = [itinerary, ...prev];
      try {
        localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(updated));
      } catch {}
      // When a new itinerary is added, show notification badge on profile
      setHasNewProfileItem(true);
      try {
        localStorage.setItem(UNSEEN_PROFILE_ITEMS_KEY, 'true');
      } catch {}
      showToast({
        message: 'Itinerary Saved to My Goa!',
        subMessage: itinerary.title,
        icon: 'itinerary',
        type: 'success',
      });
      return updated;
    });
  };

  const handleRemoveItinerary = (id: string) => {
    setSavedItineraries((prev) => {
      const target = prev.find((i) => i.id === id);
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(updated));
      } catch {}
      showToast({
        message: 'Itinerary Removed from My Goa',
        subMessage: target?.title,
        icon: 'delete',
        type: 'remove',
      });
      return updated;
    });
  };

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

  const handleOpenNameDialog = () => {
    setTempNameInput(savedPreferences.name || '');
    setIsNameDialogOpen(true);
  };

  const [myGoaInitialTab, setMyGoaInitialTab] = useState<'itineraries' | 'saved_places'>('itineraries');

  // Auto-hide notification badge as soon as user opens or views My Goa screen
  useEffect(() => {
    if (currentScreen === 'my_goa') {
      setHasNewProfileItem(false);
      try {
        localStorage.setItem(UNSEEN_PROFILE_ITEMS_KEY, 'false');
      } catch {}
    }
  }, [currentScreen]);

  const handleOpenMyGoa = (tab?: 'itineraries' | 'saved_places') => {
    if (tab) setMyGoaInitialTab(tab);
    setHasNewProfileItem(false);
    try {
      localStorage.setItem(UNSEEN_PROFILE_ITEMS_KEY, 'false');
    } catch {}
    navigateForward('my_goa');
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

  const handleUpdatePreferences = (partial: Partial<UserPreferences>) => {
    setSavedPreferences((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update preferences in localStorage', e);
      }
      return updated;
    });
    if (partial.name !== undefined) setName(partial.name);
    if (partial.tourismTypes !== undefined) setSelectedInterests(partial.tourismTypes);
    if (partial.travelMonth !== undefined) setSelectedMonth(partial.travelMonth);
    if (partial.memberCount !== undefined) setMemberCount(partial.memberCount);
    if (partial.travelType !== undefined) setTravelType(partial.travelType);
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

  const isOnboarding = currentScreen === 'onboarding_step_1' || currentScreen === 'onboarding_step_2';

  const handleOpenChat = (prompt?: string) => {
    // Open full GAI Chat screen
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

  return (
    <main className="w-full min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-start">
      {/* Viewport Container: Fluid full width on mobile, nicely bounded and centered on tablet & desktop */}
      <div className="w-full max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] relative md:shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
        {/* Persistent Pre-warmed Homepage (Always Active in Background once onboarded) */}
        {!isOnboarding && (
          <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto flex flex-col justify-start pb-6 absolute inset-0 z-0 bg-[#F7F7F5]">
            <HeroSection
              preferences={savedPreferences}
              hasNewProfileItem={hasNewProfileItem}
              onOpenChat={() => handleOpenChat()}
              onOpenMyGoa={() => handleOpenMyGoa()}
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
            >
              <StayPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
                savedPlaces={savedPlaces}
                onToggleSavePlace={handleToggleSavePlace}
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
            >
              <DestinationsPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onSelectDestination={handleOpenTravelForDestination}
                savedPlaces={savedPlaces}
                onToggleSavePlace={handleToggleSavePlace}
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
            >
              <FoodPage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
                savedPlaces={savedPlaces}
                onToggleSavePlace={handleToggleSavePlace}
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
            >
              <CulturePage
                preferences={savedPreferences}
                onBack={() => navigateBack('homepage')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
                savedPlaces={savedPlaces}
                onToggleSavePlace={handleToggleSavePlace}
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
            >
              <GAIChatPage
                preferences={savedPreferences}
                initialPrompt={chatInitialPrompt}
                onBack={() => {
                  setChatInitialPrompt(undefined);
                  navigateBack('homepage');
                }}
                savedItineraries={savedItineraries}
                onSaveItinerary={handleSaveItinerary}
                onRemoveItinerary={handleRemoveItinerary}
                savedPlaces={savedPlaces}
                onToggleSavePlace={handleToggleSavePlace}
                onNavigateScreen={(screen, initialTab) => {
                  if (screen === 'my_goa' && initialTab) {
                    setMyGoaInitialTab(initialTab);
                  }
                  navigateForward(screen as any);
                }}
                onUpdateName={handleUpdateName}
                onUpdatePreferences={handleUpdatePreferences}
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
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden absolute inset-0 z-20 bg-[#F7F7F5] will-change-transform transform-gpu"
            >
              <MyGoaPage
                preferences={savedPreferences}
                savedPlaces={savedPlaces}
                savedItineraries={savedItineraries}
                initialTab={myGoaInitialTab}
                onBack={() => navigateBack('homepage')}
                onEditPreferences={() => navigateForward('onboarding_step_1')}
                onAskGAI={(prompt) => handleOpenChat(prompt)}
                onRemoveSavedPlace={handleRemoveSavedPlace}
                onRemoveItinerary={handleRemoveItinerary}
                onToggleSavePlace={handleToggleSavePlace}
                onShowToast={showToast}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Sleek Floating iOS Toast Notification with Spring Physics & Blur */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              key={activeToast.id}
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 480,
                damping: 32,
                mass: 0.8,
              }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none select-none max-w-[92vw] sm:max-w-md w-auto"
            >
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#111111]/92 backdrop-blur-2xl text-white border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.38)]">
                {/* Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    activeToast.type === 'favorite'
                      ? 'bg-rose-500/20 text-rose-400'
                      : activeToast.type === 'remove'
                      ? 'bg-gray-700/60 text-gray-300'
                      : activeToast.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-[#177F91]/20 text-[#38BDF8]'
                  }`}
                >
                  {activeToast.icon === 'heart' && (
                    <motion.svg
                      initial={{ scale: 0.7 }}
                      animate={{ scale: [0.7, 1.25, 1] }}
                      transition={{ duration: 0.28 }}
                      className="w-4 h-4 fill-current text-rose-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </motion.svg>
                  )}
                  {activeToast.icon === 'heart-broken' && (
                    <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                  {activeToast.icon === 'itinerary' && (
                    <motion.svg
                      initial={{ scale: 0.7 }}
                      animate={{ scale: [0.7, 1.2, 1] }}
                      transition={{ duration: 0.28 }}
                      className="w-4 h-4 text-[#FF6B4A]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                      <line x1="9" y1="3" x2="9" y2="18" />
                      <line x1="15" y1="6" x2="15" y2="21" />
                    </motion.svg>
                  )}
                  {activeToast.icon === 'delete' && (
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  )}
                  {activeToast.icon === 'check' && (
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {activeToast.icon === 'sparkles' && (
                    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex flex-col min-w-0 pr-1">
                  <span className="text-[13px] font-bold text-white tracking-tight leading-snug truncate">
                    {activeToast.message}
                  </span>
                  {activeToast.subMessage && (
                    <span className="text-[11px] font-medium text-white/70 leading-tight truncate max-w-[240px]">
                      {activeToast.subMessage}
                    </span>
                  )}
                </div>
              </div>
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
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
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
