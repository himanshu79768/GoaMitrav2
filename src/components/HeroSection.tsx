import React from 'react';
import heroImage from '/src/assets/images/hero.png';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative pt-2 pb-5 px-5 select-none">
      {/* Background Hero Photo Container */}
      <div className="absolute inset-0 top-[-60px] h-[480px] overflow-hidden pointer-events-none -z-10">
        <img
          src={heroImage}
          alt="Goa Coastal View"
          className="w-full h-full object-cover object-center scale-[1.03]"
          loading="eager"
        />
        {/* Soft white-to-transparent overlay ensuring text readability and seamless fade into background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.12) 22%, rgba(255,255,255,0.65) 60%, rgba(247,247,245,0.92) 85%, #F7F7F5 100%)',
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
      <div className="mt-6 mb-5">
        <h2 className="text-[23px] font-semibold text-[#111111] tracking-tight leading-snug">
          Good morning,
        </h2>

        {/* User with SVG Sun Icon */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[35px] font-extrabold text-[#111111] tracking-tight">
            User
          </span>

          {/* SVG Sun Icon (clean, no emoji) */}
          <svg
            className="w-8 h-8 drop-shadow-sm select-none"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Sun"
            role="img"
          >
            {/* Glowing outer corona ring */}
            <circle cx="16" cy="16" r="9" fill="#F59E0B" fillOpacity="0.16" />
            {/* Sun Rays */}
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
            {/* Central Sun Disc with warm radial gradient */}
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

      {/* AI Search / GAI Bar */}
      <div className="relative mt-5">
        <div className="flex items-center justify-between p-2.5 pl-3 rounded-full bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.06)] hover:bg-white/85 transition-all">
          {/* Left: Search Circle Button */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#222E3A] shrink-0">
              {/* Clean SVG Magnifying Search Icon */}
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
              <span className="text-[12px] text-[#697582] font-normal tracking-normal truncate mt-0.5">
                Find places, food, routes, safety info...
              </span>
            </div>
          </div>

          {/* Right: Circular Arrow Action Button */}
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex items-center justify-center text-[#111111] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 ml-1"
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
  );
};
