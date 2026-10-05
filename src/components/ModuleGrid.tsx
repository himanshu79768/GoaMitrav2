import React from 'react';
import { motion } from 'motion/react';
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
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ backgroundColor: bgColor }}
      className="relative rounded-[24px] p-4 flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-black/[0.03] min-h-[142px] select-none cursor-pointer transition-shadow group"
    >
      {/* Subtle Apple-style top glass reflection */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      {/* Background Subtle Thematic Illustration */}
      <div className="absolute right-0 bottom-0 w-[80%] h-[78%] pointer-events-none overflow-hidden opacity-95 group-hover:scale-105 transition-transform duration-300">
        {illustration}
      </div>

      {/* Top Icon */}
      <div className="relative z-10 group-hover:scale-105 transition-transform duration-200">{icon}</div>

      {/* Card Content & Action Button */}
      <div className="relative z-10 flex items-end justify-between mt-1 pt-0.5">
        <div className="pr-1 min-w-0">
          <h3 className="text-[16px] font-extrabold text-[#111111] tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-[11.5px] leading-[1.28] text-[#55606A] font-medium mt-0.5 whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Circular Action Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          aria-label={`Open ${title}`}
          className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#111111] shrink-0 transition-shadow cursor-pointer"
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
        </motion.button>
      </div>
    </motion.div>
  );
};



interface ModuleGridProps {
  onOpenStay?: () => void;
  onOpenDestinations?: () => void;
  onOpenFood?: () => void;
  onOpenCulture?: () => void;
  onOpenCoupons?: () => void;
  onOpenEmergency?: () => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  onOpenStay,
  onOpenDestinations,
  onOpenFood,
  onOpenCulture,
  onOpenCoupons,
  onOpenEmergency,
}) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 pb-8 pt-3 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 xl:gap-5 w-full">
        {/* 1. Stay Card - Hotel Bed / Orange Color */}
        <ModuleCard
          title="Stay"
          description={"Hotels, homestays\nand more"}
          bgColor="#FFF1E5"
          onClick={onOpenStay}
          illustration={<StayIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#C2410C]">
              {/* Hotel Bed Icon from reference */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9a4 4 0 0 0-4-4z" />
              </svg>
            </div>
          }
        />

        {/* 2. Destinations Card - Map Pin Location / Green Color */}
        <ModuleCard
          title="Destinations"
          description={"Beaches, forts,\nwaterfalls & more"}
          bgColor="#EAF5EE"
          onClick={onOpenDestinations}
          illustration={<DestinationsIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#059669]">
              {/* Solid Location Map Pin from reference */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
          }
        />

        {/* 3. Food Card - Fork & Spoon / Culinary Coral Color */}
        <ModuleCard
          title="Food"
          description={"Local cuisine,\ncafes and \nmore"}
          bgColor="#FDECE8"
          onClick={onOpenFood}
          illustration={<FoodIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#DC2626]">
              {/* Fork & Spoon from reference */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
              </svg>
            </div>
          }
        />

        {/* 4. Culture Card - Classical Temple / Monument / Violet Color */}
        <ModuleCard
          title="Culture"
          description={"Festivals, heritage\nand local experiences"}
          bgColor="#F1EEFE"
          onClick={onOpenCulture}
          illustration={<CultureIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#6366F1]">
              {/* Heritage Monument / Classical Temple from reference */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 1L2 6v2h20V6L12 1zm-7 9v8h3v-8H5zm5 0v8h4v-8h-4zm6 0v8h3v-8h-3zM2 20v2h20v-2H2z" />
              </svg>
            </div>
          }
        />

        {/* 5. Coupons Card - Discount Price Tag / Warm Amber Color */}
        <ModuleCard
          title="Coupons"
          description={"Deals, offers\nand special discounts"}
          bgColor="#FEF7E6"
          onClick={onOpenCoupons}
          illustration={<CouponsIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#D97706]">
              {/* Price Tag with % from reference */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7a2 2 0 0 0 0-2.83zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 7.33 8z" />
              </svg>
            </div>
          }
        />

        {/* 6. Emergency Card - Shield / Cross / Red Color */}
        <ModuleCard
          title="Emergency"
          description={"Help, safety info\nand important contacts"}
          bgColor="#FEECEC"
          onClick={onOpenEmergency}
          illustration={<EmergencyIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#E11D48]">
              {/* Safety Cross Shield from reference */}
              <svg
                className="w-6 h-6"
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

      {/* Desktop-Exclusive Live Goa Hub: Edge-to-Edge Desktop Dashboard Section */}
      <div className="hidden lg:block mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#177F91] animate-pulse" />
            <h3 className="text-[17px] font-black text-gray-900 tracking-tight">
              Curated Goa Intelligence Hub
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#177F91]/10 text-[#177F91]">
              Live Real-Time
            </span>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            Updated for your travel preferences
          </span>
        </div>

        <div className="grid grid-cols-3 gap-5 w-full">
          {/* Card 1: Marine & Beach Safety Live */}
          <div
            onClick={onOpenEmergency}
            className="rounded-[24px] p-5 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Beach Safety
                </span>
                <span className="text-xs font-bold text-gray-400">Drishti 24×7</span>
              </div>
              <h4 className="text-[16px] font-black text-gray-900 leading-snug group-hover:text-[#177F91] transition-colors">
                Baga, Calangute & Morjim Safe Zones
              </h4>
              <p className="text-[12.5px] text-gray-600 font-medium mt-1.5 leading-relaxed">
                Calm coastal tides, full lifeguard watch deployed across all 40+ North & South Goa beaches. Tap for instant SOS & medical helpline.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#177F91]">
              <span>View Safety Protocols & Contacts</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Card 2: Must-Visit Coastal Curations */}
          <div
            onClick={onOpenDestinations}
            className="rounded-[24px] p-5 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Featured Spots
                </span>
                <span className="text-xs font-bold text-gray-400">High Ratings</span>
              </div>
              <h4 className="text-[16px] font-black text-gray-900 leading-snug group-hover:text-[#059669] transition-colors">
                Aguada Fort, Palolem & Dudhsagar Falls
              </h4>
              <p className="text-[12.5px] text-gray-600 font-medium mt-1.5 leading-relaxed">
                Discover sunset vantage points, historical Portuguese ramparts, and seasonal waterfall treks with verified distance & taxi estimates.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#059669]">
              <span>Explore All Verified Spots</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Card 3: Authentic Food & Culture Highlights */}
          <div
            onClick={onOpenFood}
            className="rounded-[24px] p-5 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C2410C] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                  Local Flavors
                </span>
                <span className="text-xs font-bold text-gray-400">Authentic Taste</span>
              </div>
              <h4 className="text-[16px] font-black text-gray-900 leading-snug group-hover:text-[#C2410C] transition-colors">
                Kingfish Thali, Bebinca & Fontainhas Cafes
              </h4>
              <p className="text-[12.5px] text-gray-600 font-medium mt-1.5 leading-relaxed">
                Hand-curated local bakeries, seaside shacks, and traditional spice-infused Goan curries with exact Google Maps directions.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#C2410C]">
              <span>Find Dishes & Restaurants</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
