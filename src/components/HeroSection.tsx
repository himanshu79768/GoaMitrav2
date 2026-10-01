import React from 'react';
import heroImage from '../assets/images/hero.png';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative isolate pt-5 pb-5 px-5 select-none">
      {/* Background Hero Photo Container extending through GAI pill */}
      <div className="absolute inset-0 top-0 h-[490px] overflow-hidden pointer-events-none -z-10">
        <img
          src={heroImage}
          alt="Goa Coastal Landscape"
          className="w-full h-full object-cover object-center scale-[1.02]"
          loading="eager"
        />
        {/* Balanced translucent overlay: keeps hero visible behind GAI bar while ensuring high typography contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.2) 48%, rgba(247,247,245,0.45) 70%, rgba(247,247,245,0.92) 88%, #F7F7F5 100%)',
          }}
        />
      </div>

      {/* Top Bar: Location Pill & Profile Button */}
      <div className="flex items-center justify-between pt-1">
        {/* Location Pill */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform cursor-pointer"
          aria-label="Current location: North Goa, Adventure Trip"
        >
          {/* Blue SVG Map Pin */}
          <svg
            className="w-4 h-4 text-[#0B72E3] shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 2C6.686 2 4 4.686 4 8c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              clipRule="evenodd"
            />
          </svg>

          {/* Location Text */}
          <span className="text-[13px] font-semibold text-[#18232D] tracking-tight whitespace-nowrap">
            North Goa <span className="font-normal text-[#64748B]">·</span> Adventure Trip
          </span>

          {/* Chevron Down */}
          <svg
            className="w-3.5 h-3.5 text-[#5A6876] ml-0.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>

        {/* Profile Button */}
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#1E293B] active:scale-95 transition-transform cursor-pointer"
          aria-label="User profile"
        >
          {/* SVG User Silhouette Icon */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Greeting Area */}
      <div className="mt-7 mb-5">
        <h2 className="text-[23px] font-semibold text-[#111111] tracking-tight leading-snug">
          Good morning,
        </h2>

        {/* User with SVG Sun Icon */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[35px] font-extrabold text-[#111111] tracking-tight">
            User
          </span>

          {/* Clean Radiant SVG Sun Icon */}
          <svg
            className="w-8 h-8 drop-shadow-sm select-none"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Sun"
            role="img"
          >
            <circle cx="16" cy="16" r="9" fill="#F59E0B" fillOpacity="0.18" />
            <g stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round">
              <line x1="16" y1="2" x2="16" y2="5" />
              <line x1="16" y1="27" x2="16" y2="30" />
              <line x1="2" y1="16" x2="5" y2="16" />
              <line x1="27" y1="16" x2="30" y2="16" />
              <line x1="6.1" y1="6.1" x2="8.3" y2="8.3" />
              <line x1="23.7" y1="23.7" x2="25.9" y2="25.9" />
              <line x1="6.1" y1="25.9" x2="8.3" y2="23.7" />
              <line x1="23.7" y1="8.3" x2="25.9" y2="6.1" />
            </g>
            <circle cx="16" cy="16" r="6.2" fill="#FBBF24" />
            <circle cx="16" cy="16" r="5.6" fill="#F59E0B" />
            <circle cx="14.8" cy="14.8" r="4.8" fill="#FCD34D" fillOpacity="0.85" />
          </svg>
        </div>

        {/* Subtitle */}
        <p className="mt-2 text-[14.5px] font-medium text-[#4B5763] leading-[1.38]">
          Ready to explore Goa today?
          <br />
          Let’s plan something amazing.
        </p>
      </div>

      {/* AI Search / GAI Bar with Moving Glowing Gradient Border & Frosted Translucent Glass */}
      <div className="relative mt-6">
        {/* Soft Ambient Glow Halo */}
        <div
          className="absolute -inset-1 rounded-full gai-ambient-glow opacity-60 blur-md pointer-events-none"
          aria-hidden="true"
        />

        {/* Animated Moving Gradient Border Container */}
        <div className="relative p-[1.5px] rounded-full gai-glowing-border shadow-[0_8px_32px_rgba(23,127,145,0.18)]">
          {/* Inner Translucent Glassmorphism Pill (Background hero visible inside with optical blur) */}
          <div className="flex items-center justify-between p-2 pl-3 rounded-full backdrop-blur-2xl bg-white/45 border border-white/50 hover:bg-white/55 transition-all">
            {/* Left: Search Circle Button */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#222E3A] shrink-0">
                <svg
                  className="w-5 h-5 text-[#2B3540]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </div>

              {/* Prompt Texts */}
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-[15.5px] font-bold text-[#1C252E] tracking-tight leading-tight truncate">
                  Ask GAI anything...
                </span>
                <span className="text-[12px] text-[#55606A] font-normal tracking-normal truncate mt-0.5">
                  Find places, food, routes, safety info...
                </span>
              </div>
            </div>

            {/* Right: Circular Arrow Action Button */}
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#111111] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 ml-1"
              aria-label="Submit search"
            >
              <svg
                className="w-4 h-4 text-[#111111]"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
