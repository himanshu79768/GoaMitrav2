import React from 'react';
import { motion } from 'motion/react';
import {
  StayIllustration,
  DestinationsIllustration,
  FoodIllustration,
  CultureIllustration,
  EmergencyIllustration,
  ProfileIllustration,
} from './CardIllustrations';

interface ModuleCardProps {
  title: string;
  description: string;
  bgColor: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  bgColor,
  icon,
  illustration,
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      style={{ backgroundColor: bgColor }}
      className={`relative rounded-[24px] p-4 flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.02] min-h-[140px] sm:min-h-[148px] select-none cursor-pointer group ${className}`}
    >
      {/* Background Subtle Thematic Illustration */}
      <div className="absolute right-0 bottom-0 w-[78%] h-[78%] pointer-events-none overflow-hidden opacity-95 group-hover:scale-105 transition-transform duration-300">
        {illustration}
      </div>

      {/* Top Icon */}
      <div className="relative z-10">{icon}</div>

      {/* Card Content & Action Button */}
      <div className="relative z-10 flex items-end justify-between mt-1 pt-0.5">
        <div className="pr-1 min-w-0">
          <h3 className="text-[16.5px] font-extrabold text-[#111111] tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-[12px] leading-[1.3] text-[#55606A] font-medium mt-0.5 whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Circular Action Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          aria-label={`Open ${title}`}
          className="w-8.5 h-8.5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#111111] shrink-0 transition-shadow cursor-pointer"
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
  onOpenProfile?: () => void;
  onOpenHelp?: () => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  onOpenStay,
  onOpenDestinations,
  onOpenFood,
  onOpenCulture,
  onOpenProfile,
  onOpenHelp,
}) => {
  return (
    <div className="px-5 pb-6 w-full">
      {/* 2 columns on Mobile (3 rows of 2), 3 columns on Laptop & Big Screen (2 rows of 3) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4.5 w-full">
        {/* 1. Stay Card - Homestays / Orange Color */}
        <ModuleCard
          title="Stay"
          description={"Verified homestays\nwith local hosts"}
          bgColor="#FFF1E5"
          onClick={onOpenStay}
          illustration={<StayIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#C2410C]">
              {/* Verified Homestay House / Bed Icon */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
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
              {/* Solid Location Map Pin */}
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
          description={"Authentic dishes\n& local food guide"}
          bgColor="#FDECE8"
          onClick={onOpenFood}
          illustration={<FoodIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#DC2626]">
              {/* Fork & Spoon */}
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
              {/* Heritage Monument / Classical Temple */}
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

        {/* 5. Profile Card - MY GOA, Impact Receipt & Settings / Teal Mint Color */}
        <ModuleCard
          title="Profile"
          description={"MY GOA, settings &\nImpact Receipt"}
          bgColor="#E6F4F1"
          onClick={onOpenProfile}
          illustration={<ProfileIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#0D9488]">
              {/* User traveler profile icon */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          }
        />

        {/* 6. Help Card - Emergency SOS, Tourist Helplines & Safety / Red Rose Color */}
        <ModuleCard
          title="Help"
          description={"Emergency SOS,\nhelplines & safety"}
          bgColor="#FEECEC"
          onClick={onOpenHelp}
          illustration={<EmergencyIllustration className="w-full h-full object-cover object-bottom-right" />}
          icon={
            <div className="w-8 h-8 flex items-center justify-start text-[#E11D48]">
              {/* Shield with Medical Cross */}
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
          }
        />
      </div>
    </div>
  );
};

