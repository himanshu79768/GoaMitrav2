import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences } from '../types/onboarding';

interface EmergencyPageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onAskGAI: (initialPrompt?: string) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({
  preferences,
  onBack,
  onAskGAI,
}) => {
  const [activeModal, setActiveModal] = useState<
    'sos' | 'checkin' | 'translate' | 'helplines' | 'roadside' | null
  >(null);

  const [userLocality, setUserLocality] = useState<string>('Calangute, North Goa');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: 15.5438,
    lng: 73.7554,
  });

  const [sosCountdown, setSosCountdown] = useState<number>(3);
  const [isSosCounting, setIsSosCounting] = useState<boolean>(false);

  // Retrieve user location
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('goamitra_accurate_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.placeName) {
          setUserLocality(parsed.placeName.split('(')[0].trim() || 'North Goa');
        }
        if (parsed.lat && parsed.lng) {
          setUserCoords({ lat: parsed.lat, lng: parsed.lng });
        }
      }
    } catch {}
  }, []);

  // SOS Countdown timer
  useEffect(() => {
    let timer: any;
    if (isSosCounting && sosCountdown > 0) {
      timer = setTimeout(() => setSosCountdown((prev) => prev - 1), 1000);
    } else if (isSosCounting && sosCountdown === 0) {
      window.location.href = 'tel:112';
      setIsSosCounting(false);
    }
    return () => clearTimeout(timer);
  }, [isSosCounting, sosCountdown]);

  const startSos = () => {
    setActiveModal('sos');
    setSosCountdown(3);
    setIsSosCounting(true);
  };

  const cancelSos = () => {
    setIsSosCounting(false);
    setSosCountdown(3);
    setActiveModal(null);
  };

  const checkinMessage = `Hi! I'm traveling in Goa and currently at ${userLocality} (GPS: ${userCoords.lat.toFixed(
    4
  )}, ${userCoords.lng.toFixed(4)}). Just letting you know I am safe! Sent via GoaMitra.`;

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between select-none relative overflow-hidden w-full">
      {/* 1. 100% Pinned Sticky Top Navigation Bar */}
      <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 py-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
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
          Emergency & Safety
        </h1>

        {/* Right Balance Spacer */}
        <div className="w-9 h-9" />
      </header>

      {/* 2. Scrollable Body Container (Header stays 100% fixed) */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3.5 pb-10 space-y-4 min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Hero Card: Coastal lighthouse & sunrise */}
        <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[170px] flex items-end p-5 bg-gradient-to-br from-[#E0F2FE] to-[#FCE7F3]">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80"
            alt="Goa Coastal Safety"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Hero Copy */}
          <div className="relative z-10 text-white w-full">
            <h2 className="text-[23px] font-black tracking-tight leading-tight drop-shadow-sm">
              We've got you covered.
            </h2>
            <p className="text-[13px] font-medium text-white/90 mt-1 drop-shadow-xs">
              Help is always one tap away.
            </p>
          </div>
        </div>

        {/* SOS Urgent Banner (Red gradient button) */}
        <button
          type="button"
          onClick={startSos}
          className="w-full rounded-[22px] bg-gradient-to-r from-[#FF5436] to-[#EF4444] p-4 text-white shadow-[0_4px_16px_rgba(239,68,68,0.3)] flex items-center justify-between hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            {/* Phone Pulse Icon */}
            <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>

            <div>
              <h3 className="text-[16px] font-black tracking-tight leading-tight">
                SOS — Tap for immediate help
              </h3>
              <p className="text-[11.5px] font-medium text-white/90 leading-tight mt-0.5">
                Connects to 112 India Emergency + shares your live location
              </p>
            </div>
          </div>

          <span className="text-xl font-bold opacity-80 pr-1">›</span>
        </button>

        {/* 2x2 or 4x1 Action Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* 1. Check-in Card (Teal) */}
          <div
            onClick={() => setActiveModal('checkin')}
            className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer flex flex-col justify-between min-h-[145px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F7F5] border border-[#BDEFEA] text-[#0D9488] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 12l-4-4 1.41-1.41L11 11.17l6.59-6.59L19 6l-8 8z" />
                </svg>
              </div>
              <span className="text-gray-300 font-bold text-sm">›</span>
            </div>

            <div>
              <h4 className="text-[15px] font-black text-gray-900 leading-tight">
                Check-in
              </h4>
              <p className="text-[11.5px] text-gray-500 leading-snug mt-0.5">
                Let someone know you're safe
              </p>
            </div>

            <div className="text-[10px] font-semibold text-[#0D9488] pt-1">
              Auto-message to your contact
            </div>
          </div>

          {/* 2. Translate & Show Card (Amber/Brown) */}
          <div
            onClick={() => setActiveModal('translate')}
            className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer flex flex-col justify-between min-h-[145px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z" />
                </svg>
              </div>
              <span className="text-gray-300 font-bold text-sm">›</span>
            </div>

            <div>
              <h4 className="text-[15px] font-black text-gray-900 leading-tight">
                Translate & Show
              </h4>
              <p className="text-[11.5px] text-gray-500 leading-snug mt-0.5">
                Emergency ID card
              </p>
            </div>

            <div className="text-[10px] font-semibold text-[#B45309] pt-1 line-clamp-1">
              Medical info + ID in local language
            </div>
          </div>

          {/* 3. Helplines Card (Coral) */}
          <div
            onClick={() => setActiveModal('helplines')}
            className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer flex flex-col justify-between min-h-[145px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] text-[#E11D48] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <span className="text-gray-300 font-bold text-sm">›</span>
            </div>

            <div>
              <h4 className="text-[15px] font-black text-gray-900 leading-tight">
                Helplines
              </h4>
              <p className="text-[11.5px] text-gray-500 leading-snug mt-0.5">
                Police · Medical · Women's safety
              </p>
            </div>

            <div className="text-[10px] font-semibold text-[#E11D48] pt-1">
              One tap to call
            </div>
          </div>

          {/* 4. Roadside Help Card (Blue) */}
          <div
            onClick={() => setActiveModal('roadside')}
            className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer flex flex-col justify-between min-h-[145px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                </svg>
              </div>
              <span className="text-gray-300 font-bold text-sm">›</span>
            </div>

            <div>
              <h4 className="text-[15px] font-black text-gray-900 leading-tight">
                Roadside help
              </h4>
              <p className="text-[11.5px] text-gray-500 leading-snug mt-0.5">
                Car & scooter repair
              </p>
            </div>

            <div className="text-[10px] font-semibold text-[#2563EB] pt-1">
              Nearby verified mechanics
            </div>
          </div>
        </div>
      </div>

      {/* --- ALL FUNCTIONAL MODALS --- */}
      <AnimatePresence>
        {/* 1. SOS MODAL */}
        {activeModal === 'sos' && (
          <motion.div
            key="sos-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="w-full max-w-[360px] bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl font-black animate-pulse">
                {sosCountdown}
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900">Connecting to 112</h3>
                <p className="text-xs text-gray-500 mt-1">
                  National Emergency Service (India). Your location ({userLocality}) will be shared.
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-2xl text-xs text-red-800 font-medium">
                GPS: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="tel:112"
                  className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold text-sm block shadow-md hover:bg-red-700"
                >
                  Call 112 Immediately
                </a>

                <button
                  type="button"
                  onClick={cancelSos}
                  className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. CHECK-IN MODAL */}
        {activeModal === 'checkin' && (
          <motion.div
            key="checkin-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg md:max-w-xl bg-white rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
              <h3 className="text-lg font-black text-gray-900">Send "I am Safe" Check-in</h3>
              <p className="text-xs text-gray-500">
                Share your verified live Goan locality and GPS coordinates with family or friends via WhatsApp or SMS.
              </p>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-800 font-mono">
                {checkinMessage}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(checkinMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-2xl bg-[#25D366] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>WhatsApp</span>
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>

                <a
                  href={`sms:?body=${encodeURIComponent(checkinMessage)}`}
                  className="py-3 rounded-2xl bg-gray-900 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Send SMS</span>
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 3. TRANSLATE & SHOW EMERGENCY ID */}
        {activeModal === 'translate' && (
          <motion.div
            key="translate-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg md:max-w-xl bg-white rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
              <h3 className="text-lg font-black text-gray-900">Emergency ID Card</h3>
              <p className="text-xs text-gray-500">
                Show this directly to local Goan doctors, pharmacists, police, or responders.
              </p>

              <div className="bg-[#FEF3C7]/40 border border-[#FDE68A] rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-[#FDE68A]/60 pb-2">
                  <span className="text-xs font-bold text-gray-600">Traveler Name:</span>
                  <span className="text-sm font-black text-gray-900">{preferences.name || 'Traveler'}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#B45309]">Medical Help Needed:</div>
                  <div className="text-xs text-gray-800">"I need urgent medical attention."</div>
                  <div className="text-xs text-[#92400E] font-medium">कोंकणी: "म्हाका तातडीची वैजकी मदत जाय."</div>
                  <div className="text-xs text-gray-600 font-medium">हिंदी: "मुझे तुरंत डॉक्टरी सहायता चाहिए।"</div>
                </div>

                <div className="space-y-1 pt-2 border-t border-[#FDE68A]/60">
                  <div className="text-[11px] font-bold text-[#B45309]">Police / Safety Help:</div>
                  <div className="text-xs text-gray-800">"Please help me reach the police or my hotel."</div>
                  <div className="text-xs text-[#92400E] font-medium">कोंकणी: "उपकार करून म्हाका पुलीसां लागीं पावोवपाक मदत करात."</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-3 rounded-2xl bg-gray-900 text-white font-bold text-xs"
              >
                Close ID Card
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 4. HELPLINES SHEET */}
        {activeModal === 'helplines' && (
          <motion.div
            key="helplines-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg md:max-w-xl bg-white rounded-t-[32px] sm:rounded-3xl p-6 space-y-3 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
              <h3 className="text-lg font-black text-gray-900">Official Goa Helplines</h3>
              <p className="text-xs text-gray-500">Tap to call verified emergency numbers directly.</p>

              <div className="space-y-2 pt-1">
                {[
                  { name: '112 India All-In-One Emergency', number: '112', type: 'Police, Fire, Ambulance' },
                  { name: 'Goa Women Police Helpline', number: '1091', type: '24x7 Women Safety & Support' },
                  { name: '108 Goa Medical Ambulance', number: '108', type: 'Emergency Hospital Transport' },
                  { name: 'Goa Tourist Police Helpline', number: '1364', type: 'Tourist Assistance & Protection' },
                  { name: 'Goa Police Control Room', number: '100', type: 'Statewide Police Dispatch' },
                  { name: 'Fire & Rescue Services', number: '101', type: 'Fire, Coastal Water Rescue' },
                ].map((item) => (
                  <a
                    key={item.number}
                    href={`tel:${item.number}`}
                    className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900">{item.name}</div>
                      <div className="text-[10.5px] text-gray-500">{item.type}</div>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 font-black text-xs rounded-full inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{item.number}</span>
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 5. ROADSIDE HELP SHEET */}
        {activeModal === 'roadside' && (
          <motion.div
            key="roadside-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg md:max-w-xl bg-white rounded-t-[32px] sm:rounded-3xl p-6 space-y-3 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
              <h3 className="text-lg font-black text-gray-900">Roadside Repair & Mechanics</h3>
              <p className="text-xs text-gray-500">Verified scooter & car puncture services in Goa.</p>

              <div className="space-y-2 pt-1">
                {[
                  { name: 'Mapusa 24x7 Scooter & Puncture Clinic', phone: '+919822100000', area: 'Mapusa & Porvorim Highway', time: '10 min away' },
                  { name: 'Calangute Coastal Bike Breakdown Aid', phone: '+919822200000', area: 'Calangute / Baga / Candolim', time: '8 min away' },
                  { name: 'Panaji Capital Towing & Battery Jump', phone: '+919822300000', area: 'Panjim & Miramar', time: '12 min away' },
                ].map((item) => (
                  <div key={item.name} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-gray-900">{item.name}</div>
                      <div className="text-[10px] text-gray-500">{item.area} · {item.time}</div>
                    </div>
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3 py-1 bg-blue-100 text-blue-600 font-bold text-xs rounded-full"
                    >
                      Call
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
