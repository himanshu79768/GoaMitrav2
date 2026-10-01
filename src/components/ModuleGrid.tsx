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
      {/* Background Subtle Thematic Illustration */}
      <div className="absolute right-0 bottom-0 w-[85%] h-[82%] pointer-events-none overflow-hidden">
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
        {/* 1. Stay Card - Home / Orange Color */}
        <ModuleCard
          title="Stay"
          description={"Hotels, homestays\nand more"}
          bgColor="#FFF2E5"
          illustration={<StayIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#EA580C]">
              {/* Home / Goan Villa Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.5L2 11h3v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9h3L12 2.5z" />
              </svg>
            </div>
          }
        />

        {/* 2. Destinations Card - Aguada Fort / Green Color */}
        <ModuleCard
          title="Destinations"
          description={"Beaches, forts,\nwaterfalls & more"}
          bgColor="#EAF4ED"
          illustration={<DestinationsIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#059669]">
              {/* Fort / Fortress Bastion & Map Pin Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Fort Citadel */}
                <path d="M3 4h3v3h4V4h4v3h4V4h3v6h-1v10H4V10H3V4zm5 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
            </div>
          }
        />

        {/* 3. Food Card - Food Dish / Culinary Platter */}
        <ModuleCard
          title="Food"
          description={"Local cuisine,\ncafes and more"}
          bgColor="#FDEEE9"
          illustration={<FoodIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#D94E34]">
              {/* Culinary Food / Serving Cloche & Fork-Knife Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Food Platter Cloche */}
                <path d="M12 4a1.5 1.5 0 0 0-1.42 1.01C6.23 5.48 3 9.38 3 14h18c0-4.62-3.23-8.52-7.58-8.99A1.5 1.5 0 0 0 12 4zm-10 12h20v2H2v-2zm4 4h12v1.5H6V20z" />
              </svg>
            </div>
          }
        />

        {/* 4. Culture Card - Old Goa Purple */}
        <ModuleCard
          title="Culture"
          description={"Festivals, heritage\nand local experiences"}
          bgColor="#F3E8FF"
          illustration={<CultureIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#6B21A8]">
              {/* Old Goa Heritage Cathedral & Basilica Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Cross on roof */}
                <path d="M12 2v2M11 3h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                {/* Facade */}
                <path d="M12 4L3 8v3h18V8L12 4z" />
                <rect x="5" y="11" width="3" height="8" rx="0.5" />
                <rect x="10.5" y="11" width="3" height="8" rx="0.5" />
                <rect x="16" y="11" width="3" height="8" rx="0.5" />
                <path d="M2 19h20v3H2v-3z" />
              </svg>
            </div>
          }
        />

        {/* 5. Coupons Card - Shopping Bag % (No tree, No sun) */}
        <ModuleCard
          title="Coupons"
          description={"Deals, offers\nand special discounts"}
          bgColor="#FEF6E6"
          illustration={<CouponsIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#D97706]">
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

        {/* 6. Emergency Card - Danger & Health Kit Sign Red Color */}
        <ModuleCard
          title="Emergency"
          description={"Help, safety info\nand important contacts"}
          bgColor="#FEE2E2"
          illustration={<EmergencyIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#DC2626]">
              {/* Health Kit Box & Medical Cross Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Kit handle */}
                <path d="M9 3h6a1 1 0 0 1 1 1v2h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3V4a1 1 0 0 1 1-1zm2 3h2V5h-2v1zm2 5h-2v2H9v2h2v2h2v-2h2v-2h-2v-2z" />
              </svg>
            </div>
          }
        />
      </div>
    </div>
  );
};
