import React from 'react';

export const StatusBar: React.FC = () => {
  return (
    <header className="relative z-30 flex items-center justify-between px-7 pt-3.5 pb-1 select-none">
      {/* iOS Time */}
      <span className="text-[15px] font-semibold tracking-tight text-[#111111]">
        9:41
      </span>

      {/* iOS Status Icons */}
      <div className="flex items-center gap-1.5 text-[#111111]">
        {/* Cellular Signal (4 bars) */}
        <svg
          className="w-4 h-3.5"
          viewBox="0 0 17 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="0.5" y="8" width="2.5" height="4" rx="0.75" fill="currentColor" />
          <rect x="4.5" y="5.5" width="2.5" height="6.5" rx="0.75" fill="currentColor" />
          <rect x="8.5" y="3" width="2.5" height="9" rx="0.75" fill="currentColor" />
          <rect x="12.5" y="0.5" width="2.5" height="11.5" rx="0.75" fill="currentColor" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg
          className="w-4 h-3.5"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 3.25C10.6 3.25 12.96 4.28 14.7 5.96L15.65 4.93C13.65 2.99 10.96 1.75 8 1.75C5.04 1.75 2.35 2.99 0.35 4.93L1.3 5.96C3.04 4.28 5.4 3.25 8 3.25ZM8 6.75C9.72 6.75 11.28 7.45 12.44 8.58L13.39 7.55C11.96 6.16 10.08 5.25 8 5.25C5.92 5.25 4.04 6.16 2.61 7.55L3.56 8.58C4.72 7.45 6.28 6.75 8 6.75ZM8 10.25C8.83 10.25 9.5 10.92 9.5 11.75C9.5 12.58 8.83 13.25 8 13.25C7.17 13.25 6.5 12.58 6.5 11.75C6.5 10.92 7.17 10.25 8 10.25Z"
            fill="currentColor"
            transform="translate(0, -1.5)"
          />
        </svg>

        {/* Battery Icon */}
        <svg
          className="w-6 h-3"
          viewBox="0 0 24 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer capsule outline */}
          <rect
            x="0.75"
            y="0.75"
            width="19.5"
            height="10.5"
            rx="3.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Battery level fill */}
          <rect
            x="2.5"
            y="2.5"
            width="14.5"
            height="7"
            rx="2"
            fill="currentColor"
          />
          {/* Battery terminal bump */}
          <path
            d="M22 4C22.6 4.4 23 5.1 23 6C23 6.9 22.6 7.6 22 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </header>
  );
};
