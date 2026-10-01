import React from 'react';
import {
  StayIllustration,
  DestinationsIllustration,
  FoodIllustration,
  CultureIllustration,
  CouponsIllustration,
  EmergencyIllustration,
} from './CardIllustrations';

interface ModuleCardProps {
  title: string;
  description: string;
  bgColor: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  bgColor,
  icon,
  illustration,
}) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="relative rounded-[24px] p-4 flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.02] min-h-[162px] transition-transform active:scale-[0.98] select-none"
    >
      {/* Background Subtle Goan Illustration */}
      <div className="absolute right-0 bottom-0 w-[85%] h-[80%] pointer-events-none overflow-hidden">
        {illustration}
      </div>

      {/* Top Icon */}
      <div className="relative z-10">{icon}</div>

      {/* Card Content & Action Button */}
      <div className="relative z-10 flex items-end justify-between mt-2 pt-1">
        <div className="pr-1">
          <h3 className="text-[17px] font-bold text-[#111111] tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-[12.5px] leading-[1.3] text-[#55606A] font-medium mt-1 whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Circular Action Button */}
        <button
          type="button"
          aria-label={`Open ${title}`}
          className="w-9 h-9 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#111111] shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
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
  );
};

export const ModuleGrid: React.FC = () => {
  return (
    <div className="px-5 pb-4">
      <div className="grid grid-cols-2 gap-3.5">
        {/* 1. Stay Card */}
        <ModuleCard
          title="Stay"
          description={"Hotels, homestays\nand more"}
          bgColor="#FAF0E4"
          illustration={<StayIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#984626]">
              {/* Hotel / Bed SVG Icon */}
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Pillows & Headboard */}
                <path d="M4 8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2H4V8z" />
                <circle cx="8" cy="8" r="1.5" fill="#FAF0E4" />
                <circle cx="16" cy="8" r="1.5" fill="#FAF0E4" />
                {/* Mattress & Frame */}
                <path d="M3 11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" />
                {/* Legs */}
                <rect x="3" y="16" width="2.5" height="4" rx="1" />
                <rect x="18.5" y="16" width="2.5" height="4" rx="1" />
              </svg>
            </div>
          }
        />

        {/* 2. Destinations Card */}
        <ModuleCard
          title="Destinations"
          description={"Beaches, forts,\nwaterfalls & more"}
          bgColor="#EAF4ED"
          illustration={<DestinationsIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#128260]">
              {/* Teardrop Map Pin Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          }
        />

        {/* 3. Food Card */}
        <ModuleCard
          title="Food"
          description={"Local cuisine,\ncafes and more"}
          bgColor="#FDEEE9"
          illustration={<FoodIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#D94E34]">
              {/* Fork and Spoon SVG Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Fork */}
                <path d="M4 3v6a2 2 0 0 0 2 2h0.5v10h2V11H9a2 2 0 0 0 2-2V3H9.5v5H8V3H6.5v5H5V3H4z" />
                {/* Spoon */}
                <path d="M17 3c-2.2 0-4 1.8-4 4 0 1.9 1.3 3.5 3 3.9V21h2v-10.1c1.7-.4 3-2 3-3.9 0-2.2-1.8-4-4-4z" />
              </svg>
            </div>
          }
        />

        {/* 4. Culture Card */}
        <ModuleCard
          title="Culture"
          description={"Festivals, heritage\nand local experiences"}
          bgColor="#F0EDF9"
          illustration={<CultureIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#56449C]">
              {/* Classical Heritage / Temple / Church Portico Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Pediment Roof */}
                <path d="M12 2L2 7v2h20V7L12 2z" />
                {/* Pillars */}
                <rect x="4" y="10" width="2.5" height="8" rx="0.5" />
                <rect x="9" y="10" width="2.5" height="8" rx="0.5" />
                <rect x="13.5" y="10" width="2.5" height="8" rx="0.5" />
                <rect x="18" y="10" width="2.5" height="8" rx="0.5" />
                {/* Base plinth */}
                <path d="M2 19h20v3H2v-3z" />
              </svg>
            </div>
          }
        />

        {/* 5. Coupons Card */}
        <ModuleCard
          title="Coupons"
          description={"Deals, offers\nand special discounts"}
          bgColor="#FEF6E6"
          illustration={<CouponsIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#DE8500]">
              {/* Discount Ticket with % sign Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 7.5A2.5 2.5 0 0 1 5 5h14a2.5 2.5 0 0 1 2.5 2.5v1.2a2 2 0 0 0 0 3.6v1.2a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5v-1.2a2 2 0 0 0 0-3.6V7.5zm11.2 1.3a1 1 0 1 0-1.4 1.4l4 4a1 1 0 0 0 1.4-1.4l-4-4zm-4.4.9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm5.4 4.8a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          }
        />

        {/* 6. Emergency Card */}
        <ModuleCard
          title="Emergency"
          description={"Help, safety info\nand important contacts"}
          bgColor="#FDEFEF"
          illustration={<EmergencyIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#DE3B3B]">
              {/* Shield with Medical Cross */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2L4 5v6.5c0 5.1 3.4 9.9 8 11.5 4.6-1.6 8-6.4 8-11.5V5l-8-3zm1 6h-2v3H8v2h3v3h2v-3h3v-2h-3V8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          }
        />
      </div>
    </div>
  );
};
