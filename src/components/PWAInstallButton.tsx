import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop Install Flow
  if (isInstallable) {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={install}
        className="w-full py-3 rounded-xl font-bold text-xs bg-gray-900 text-white shadow-xs hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Install GoaMitra App</span>
      </motion.button>
    );
  }

  // iOS Safari Flow
  if (isIOS) {
    return (
      <>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowIOSGuide(true)}
          className="w-full py-3 rounded-xl font-bold text-xs bg-gray-900 text-white shadow-xs hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Install on iPhone (PWA)</span>
        </motion.button>

        <AnimatePresence>
          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowIOSGuide(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="w-full max-w-sm rounded-t-3xl sm:rounded-2xl bg-white p-6 shadow-2xl relative z-10 border border-gray-100"
              >
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <h3 className="text-[17px] font-black text-gray-900 tracking-tight text-center">
                  Install GoaMitra on iPhone
                </h3>
                <div className="mt-3 space-y-2.5 text-xs text-gray-600 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-gray-900">1.</span>
                    <span>Tap the <strong>Share</strong> icon in Safari's bottom toolbar.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-gray-900">2.</span>
                    <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  Got it
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
};
