import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveCaptionsBarProps {
  captionText: string | null;
  onClear?: () => void;
  onClose?: () => void;
}

export const LiveCaptionsBar: React.FC<LiveCaptionsBarProps> = ({
  captionText,
  onClear,
  onClose,
}) => {
  if (!captionText) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[900] w-[92%] max-w-xl pointer-events-auto"
      >
        <div className="bg-black/90 text-white rounded-2xl px-4 py-3 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <span className="text-sm bg-white/20 text-yellow-300 font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0 mt-0.5">
              CC
            </span>
            <p className="text-[13px] sm:text-[14px] font-medium text-gray-100 leading-snug break-words">
              {captionText}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-white p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
                title="Hide Captions"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
