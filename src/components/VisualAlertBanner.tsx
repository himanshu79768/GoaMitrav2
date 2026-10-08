import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualAlertBannerProps {
  alert: {
    title: string;
    description?: string;
    icon?: string;
  } | null;
  onDismiss?: () => void;
}

export const VisualAlertBanner: React.FC<VisualAlertBannerProps> = ({
  alert,
  onDismiss,
}) => {
  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[950] w-[90%] max-w-md pointer-events-auto select-none"
      >
        <div className="bg-amber-400 text-black px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(251,191,36,0.5)] border-2 border-black flex items-center justify-between gap-3 font-sans animate-pulse">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{alert.icon || '🔔'}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-amber-300 px-1.5 py-0.5 rounded">
                  VISUAL ALERT
                </span>
                <h4 className="text-[13.5px] font-black text-black leading-tight">
                  {alert.title}
                </h4>
              </div>
              {alert.description && (
                <p className="text-[12px] font-semibold text-gray-900 mt-0.5 leading-snug truncate">
                  {alert.description}
                </p>
              )}
            </div>
          </div>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 text-black flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
