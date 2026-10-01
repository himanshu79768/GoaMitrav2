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
  onClick?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  bgColor,
  icon,
  illustration,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
      className="relative rounded-[24px] p-4 flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.02] min-h-[162px] transition-transform active:scale-[0.98] select-none cursor-pointer"
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
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
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

interface ModuleGridProps {
  onOpenStay?: () => void;
  onOpenDestinations?: () => void;
  onOpenCoupons?: () => void;
  onOpenEmergency?: () => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  onOpenStay,
  onOpenDestinations,
  onOpenCoupons,
  onOpenEmergency,
}) => {
  return (
    <div className="px-5 pb-4">
      <div className="grid grid-cols-2 gap-3.5">
        {/* 1. Stay Card - Home / Orange Color */}
        <ModuleCard
          title="Stay"
          description={"Hotels, homestays\nand more"}
          bgColor="#FFF2E5"
          onClick={onOpenStay}
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
          onClick={onOpenDestinations}
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
                <path d="M12 2a1 1 0 0 1 1 1v1.055A9.002 9.002 0 0 1 21 13v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a9.002 9.002 0 0 1 8-8.945V3a1 1 0 0 1 1-1zm-9 15h18v2H3v-2z" />
              </svg>
            </div>
          }
        />

        {/* 4. Culture Card - Goan Carnival Mask */}
        <ModuleCard
          title="Culture"
          description={"Music, festivals,\nand events"}
          bgColor="#EEF2FA"
          illustration={<CultureIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#4361EE]">
              {/* Goan Heritage Music / Mandovi Guitar & Feather Mask Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4a1 1 0 0 0 .7 1.6h13.9a1 1 0 0 0 .7-1.6l-.62-1.79A8.96 8.96 0 0 0 21 12c0-4.97-4.03-9-9-9zm-3 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </div>
          }
        />

        {/* 5. Coupons Card - Discount Tag / Vouchers */}
        <ModuleCard
          title="Coupons"
          description={"Exclusive \ndeals and discounts"}
          bgColor="#F5F3FF"
          onClick={onOpenCoupons}
          illustration={<CouponsIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#7C3AED]">
              {/* Discount Voucher Ticket Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7a2 2 0 0 0 0-2.83zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 8z" />
              </svg>
            </div>
          }
        />

        {/* 6. Emergency Card - Safety Shield / Emergency Contacts */}
        <ModuleCard
          title="Emergency"
          description={"Police, hospital\nand lifeguard info"}
          bgColor="#FEEFEE"
          onClick={onOpenEmergency}
          illustration={<EmergencyIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-9 h-9 flex items-center justify-start text-[#E11D48]">
              {/* Lifeguard Medical Cross Shield Icon */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm3 10h-2v3h-2v-3H8v-2h3V7h2v3h3v2z" />
              </svg>
            </div>
          }
        />
      </div>
    </div>
  );
};
