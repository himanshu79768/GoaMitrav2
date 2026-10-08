import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EyeControlOverlayProps {
  dwellTime?: number; // In seconds, e.g. 1.5
  onToggle?: () => void;
  onAnnounceCaption?: (text: string) => void;
}

export const EyeControlOverlay: React.FC<EyeControlOverlayProps> = ({
  dwellTime = 1.5,
  onToggle,
  onAnnounceCaption,
}) => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isDwelling, setIsDwelling] = useState(false);
  const [dwellProgress, setDwellProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const targetElemRef = useRef<HTMLElement | null>(null);
  const dwellStartTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const cooldownRef = useRef<boolean>(false);

  const dwellDurationMs = dwellTime * 1000;

  // Track cursor movement
  useEffect(() => {
    if (isPaused) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });

      if (cooldownRef.current) return;

      // Find clickable target under cursor
      const elem = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const clickable = elem?.closest<HTMLElement>(
        'button, a, input, select, textarea, [role="button"], [tabindex="0"], label'
      );

      if (clickable && clickable !== targetElemRef.current) {
        targetElemRef.current = clickable;
        dwellStartTimeRef.current = performance.now();
        setIsDwelling(true);
        setDwellProgress(0);
      } else if (!clickable) {
        targetElemRef.current = null;
        dwellStartTimeRef.current = null;
        setIsDwelling(false);
        setDwellProgress(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPaused]);

  // Handle Dwell Animation Loop
  const triggerClick = useCallback((target: HTMLElement) => {
    cooldownRef.current = true;
    setJustClicked(true);
    setIsDwelling(false);
    setDwellProgress(100);

    const label = target.getAttribute('aria-label') || target.innerText?.slice(0, 30) || 'Item';
    if (onAnnounceCaption) {
      onAnnounceCaption(`Eye Control Activated: ${label}`);
    }

    try {
      target.click();
    } catch (e) {
      console.warn('Eye control click failed', e);
    }

    setTimeout(() => {
      setJustClicked(false);
      setDwellProgress(0);
      cooldownRef.current = false;
      dwellStartTimeRef.current = null;
      targetElemRef.current = null;
    }, 800);
  }, [onAnnounceCaption]);

  useEffect(() => {
    if (isPaused) {
      setIsDwelling(false);
      setDwellProgress(0);
      return;
    }

    const checkDwell = () => {
      if (dwellStartTimeRef.current && targetElemRef.current && !cooldownRef.current) {
        const elapsed = performance.now() - dwellStartTimeRef.current;
        const progress = Math.min(100, (elapsed / dwellDurationMs) * 100);
        setDwellProgress(progress);

        if (progress >= 100) {
          triggerClick(targetElemRef.current);
        }
      }
      animFrameRef.current = requestAnimationFrame(checkDwell);
    };

    animFrameRef.current = requestAnimationFrame(checkDwell);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dwellDurationMs, isPaused, triggerClick]);

  return (
    <>
      {/* Floating Eye Control HUD Banner */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[999] pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 text-white backdrop-blur-md border border-cyan-400/40 shadow-xl text-xs font-semibold select-none">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span>Eye Control ({dwellTime}s dwell)</span>
          </span>

          <span className="text-gray-500">|</span>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="text-gray-400 hover:text-white text-xs px-1 cursor-pointer"
              title="Close Eye Control"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Floating Gaze Pointer with Circular Progress Ring */}
      {!isPaused && coords.x >= 0 && (
        <div
          className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* SVG Dwell Progress Ring */}
            {isDwelling && (
              <svg className="absolute inset-0 w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  className="stroke-cyan-500/30"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  className="stroke-cyan-400 transition-all duration-75"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - dwellProgress / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}

            {/* Target Crosshair Dot */}
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                justClicked
                  ? 'bg-emerald-400 border-white scale-150'
                  : isDwelling
                  ? 'bg-cyan-400 border-white scale-125'
                  : 'bg-white/90 border-cyan-500 scale-100 shadow-md'
              }`}
            />
          </div>
        </div>
      )}
    </>
  );
};
