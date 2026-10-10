import React from 'react';

/**
 * Custom vector illustrations for module cards:
 * 1. Stay: Goan home / villa in warm orange
 * 2. Destinations: Highly accurate Fort Aguada circular lighthouse & stone fortress (no crows, no trees)
 * 3. Food: Authentic Goan culinary feast platter in coral red
 * 4. Culture: Real Basilica of Bom Jesus baroque facade with 3-tier arches, volute scrolls, and Jesuit emblem (no trees)
 * 5. Coupons: Clean shopping bag with % (no stars, no sparkles, no trees, no sun)
 * 6. Emergency: Medical health kit with medical cross (danger sign removed)
 */

export const StayIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Ground terrace in orange */}
    <path
      d="M-10 100 C30 95, 80 97, 170 93 L170 115 L-10 115 Z"
      fill="#EA580C"
      fillOpacity="0.14"
    />
    <path
      d="M15 104 C60 98, 110 100, 170 96 L170 115 L15 115 Z"
      fill="#EA580C"
      fillOpacity="0.22"
    />

    {/* Traditional Goan Home / Villa (Casa de Goa with Balcão) */}
    <g transform="translate(62, 18)">
      {/* Upper Main Sloping Mangalore Tiled Roof */}
      <path
        d="M2 30 L40 6 L86 30 L80 34 L40 12 L8 34 Z"
        fill="#C2410C"
        fillOpacity="0.48"
      />
      <path
        d="M6 31 L40 9 L82 31 Z"
        fill="#FB923C"
        fillOpacity="0.32"
      />
      {/* Roof tile ridges */}
      <line x1="20" y1="22" x2="28" y2="31" stroke="#9A3412" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="40" y1="12" x2="40" y2="31" stroke="#9A3412" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="60" y1="22" x2="52" y2="31" stroke="#9A3412" strokeWidth="1" strokeOpacity="0.4" />

      {/* Main Home Walls */}
      <rect x="12" y="31" width="66" height="46" fill="#F97316" fillOpacity="0.25" rx="1.5" />
      
      {/* Goan Balcão (Porch with Pillars & Seat) */}
      <rect x="22" y="44" width="46" height="33" fill="#EA580C" fillOpacity="0.28" rx="1.5" />
      <path d="M18 44 L45 32 L72 44 Z" fill="#C2410C" fillOpacity="0.4" />
      
      {/* Balcão pillars */}
      <rect x="25" y="44" width="3" height="33" fill="#9A3412" fillOpacity="0.45" rx="1" />
      <rect x="43.5" y="44" width="3" height="33" fill="#9A3412" fillOpacity="0.4" rx="1" />
      <rect x="62" y="44" width="3" height="33" fill="#9A3412" fillOpacity="0.45" rx="1" />

      {/* Arched front doorway */}
      <path d="M39 77 C39 62, 51 62, 51 77 Z" fill="#7C2D12" fillOpacity="0.45" />

      {/* Windows with traditional oyster shell / wooden shutters */}
      <rect x="14" y="38" width="7" height="11" fill="#7C2D12" fillOpacity="0.35" rx="1" />
      <rect x="69" y="38" width="7" height="11" fill="#7C2D12" fillOpacity="0.35" rx="1" />

      {/* Steps leading up to home */}
      <rect x="33" y="74" width="24" height="3.5" fill="#C2410C" fillOpacity="0.35" rx="1" />
      <rect x="30" y="77.5" width="30" height="3.5" fill="#9A3412" fillOpacity="0.35" rx="1" />
    </g>

    {/* Cozy garden planter beside home */}
    <g transform="translate(42, 68)" opacity="0">
      <path d="M4 14 L8 24 L0 24 Z" fill="#C2410C" />
      <circle cx="4" cy="11" r="5" fill="#EA580C" />
      <circle cx="8" cy="8" r="4" fill="#FB923C" />
      <circle cx="1" cy="7" r="4.5" fill="#EA580C" />
    </g>
  </svg>
);

export const DestinationsIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Ocean coastline slope under Fort Aguada (No crows, No trees) */}
    <path
      d="M-10 94 C30 90, 70 94, 110 88 C135 84, 155 88, 175 82 L175 115 L-10 115 Z"
      fill="#059669"
      fillOpacity="0.12"
    />
    <path
      d="M10 100 C55 94, 100 96, 175 88 L175 115 L10 115 Z"
      fill="#059669"
      fillOpacity="0.22"
    />

    {/* Accurate Fort Aguada - Iconic 4-tier Circular 17th Century Portuguese Lighthouse & Fortress Ramparts */}
    <g transform="translate(54, 10)">
      {/* Lower Fort Bastion Wall (Sea rampart with cannon embrasures) */}
      <path
        d="M-6 58 L88 58 L92 84 L-12 84 Z"
        fill="#047857"
        fillOpacity="0.3"
      />
      {/* Stone masonry joint lines on rampart */}
      <line x1="-2" y1="68" x2="88" y2="68" stroke="#065F46" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="14" y1="58" x2="14" y2="68" stroke="#065F46" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="38" y1="58" x2="38" y2="68" stroke="#065F46" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="64" y1="58" x2="64" y2="68" stroke="#065F46" strokeWidth="0.8" strokeOpacity="0.3" />
      
      {/* Rampart Crenellations / Battlements */}
      <rect x="0" y="52" width="8" height="6" fill="#047857" fillOpacity="0.45" />
      <rect x="14" y="52" width="8" height="6" fill="#047857" fillOpacity="0.45" />
      <rect x="28" y="52" width="8" height="6" fill="#047857" fillOpacity="0.45" />
      <rect x="42" y="52" width="8" height="6" fill="#047857" fillOpacity="0.45" />
      <rect x="56" y="52" width="8" height="6" fill="#047857" fillOpacity="0.45" />
      <rect x="70" y="52" width="8" height="6" fill="#047857" fillOpacity="0.45" />

      {/* Fort Arched Gateway */}
      <path d="M12 84 C12 70, 24 70, 24 84 Z" fill="#022C22" fillOpacity="0.45" />

      {/* The Famous Fort Aguada Circular Lighthouse (Tiered stone drum) */}
      {/* Tier 1 (Base circular bastion drum) */}
      <path
        d="M34 54 L62 54 L66 74 L30 74 Z"
        fill="#047857"
        fillOpacity="0.42"
      />
      <ellipse cx="48" cy="54" rx="14" ry="3.5" fill="#10B981" fillOpacity="0.35" />

      {/* Tier 2 (Middle cylindrical stone tower) */}
      <path
        d="M36 34 L60 34 L62 54 L34 54 Z"
        fill="#065F46"
        fillOpacity="0.45"
      />
      <ellipse cx="48" cy="34" rx="12" ry="3" fill="#10B981" fillOpacity="0.35" />
      {/* Windows on tower */}
      <rect x="46" y="40" width="4" height="6" fill="#022C22" fillOpacity="0.5" rx="1" />

      {/* Tier 3 (Upper tower cylinder) */}
      <path
        d="M39 18 L57 18 L60 34 L36 34 Z"
        fill="#047857"
        fillOpacity="0.5"
      />
      {/* Observation Gallery / Balcony Railing */}
      <ellipse cx="48" cy="18" rx="11" ry="2.8" fill="#065F46" fillOpacity="0.6" />
      <rect x="36" y="15" width="24" height="3" fill="#047857" fillOpacity="0.5" rx="0.8" />
      <line x1="38" y1="15" x2="38" y2="18" stroke="#022C22" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="43" y1="15" x2="43" y2="18" stroke="#022C22" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="48" y1="15" x2="48" y2="18" stroke="#022C22" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="53" y1="15" x2="53" y2="18" stroke="#022C22" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="58" y1="15" x2="58" y2="18" stroke="#022C22" strokeWidth="1" strokeOpacity="0.5" />

      {/* Tier 4 (Glass Lantern Chamber & Dome) */}
      <rect x="42" y="9" width="12" height="6.5" fill="#022C22" fillOpacity="0.4" rx="0.5" />
      <path d="M42 9 C42 3, 54 3, 54 9 Z" fill="#065F46" fillOpacity="0.6" />
      {/* Lightning rod / Spire */}
      <line x1="48" y1="1" x2="48" y2="4" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />

      {/* Fort Cannon mounted on rampart facing sea */}
      <g transform="translate(68, 48)">
        <path d="M0 4 L14 1 L14 7 L0 5 Z" fill="#022C22" fillOpacity="0.55" />
        <circle cx="5" cy="6" r="3.2" fill="#047857" fillOpacity="0.6" />
      </g>
    </g>
  </svg>
);

export const FoodIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Table surface */}
    <path
      d="M-10 96 C30 92, 80 94, 170 88 L170 115 L-10 115 Z"
      fill="#D94E34"
      fillOpacity="0.12"
    />
    <path
      d="M15 102 C60 96, 110 98, 170 94 L170 115 L15 115 Z"
      fill="#D94E34"
      fillOpacity="0.2"
    />

    {/* Authentic Goan Food Thali / Culinary Feast */}
    <g transform="translate(66, 16)">
      {/* Main Large Serving Platter / Thali */}
      <ellipse cx="44" cy="56" rx="42" ry="24" fill="#D94E34" fillOpacity="0.22" />
      <ellipse cx="44" cy="55" rx="40" ry="22.5" fill="#FFEAE6" fillOpacity="0.35" />
      <ellipse cx="44" cy="54" rx="38" ry="21" stroke="#B2321B" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />

      {/* Steaming Goan Fish Curry Bowl in center */}
      <ellipse cx="44" cy="46" rx="18" ry="11" fill="#B2321B" fillOpacity="0.45" />
      <ellipse cx="44" cy="44" rx="16" ry="9" fill="#EA580C" fillOpacity="0.5" />
      {/* Curry leaves & spice garnish */}
      <path d="M40 43 C42 41, 46 43, 48 41" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Steam waves */}
      <path d="M38 34 C36 28, 40 24, 38 18" stroke="#D94E34" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
      <path d="M45 32 C47 26, 43 22, 45 16" stroke="#D94E34" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
      <path d="M51 34 C49 28, 53 24, 51 18" stroke="#D94E34" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.4" fill="none" />

      {/* Goan Fried Fish Steak (Kingfish/Pomfret) with Masala crust */}
      <g transform="translate(18, 52)">
        <path
          d="M0 6 C6 0, 16 0, 22 6 C16 12, 6 12, 0 6 Z"
          fill="#B2321B"
          fillOpacity="0.5"
        />
        <line x1="6" y1="2" x2="16" y2="10" stroke="#7C2D12" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="10" y1="1" x2="18" y2="8" stroke="#7C2D12" strokeWidth="1.2" strokeOpacity="0.6" />
      </g>

      {/* Rice Bowl */}
      <ellipse cx="64" cy="58" rx="12" ry="8" fill="#FFFFFF" fillOpacity="0.6" />
      <ellipse cx="64" cy="58" rx="12" ry="8" stroke="#B2321B" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      
      {/* Lemon wedge */}
      <path d="M12 46 C16 42, 22 46, 20 52 Z" fill="#F59E0B" fillOpacity="0.65" />

      {/* Cutlery beside thali */}
      <path d="M-4 38 L-4 68 M-7 38 L-7 46 M-1 38 L-1 46" stroke="#B2321B" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4" />
      <ellipse cx="89" cy="40" rx="3.5" ry="5.5" fill="#B2321B" fillOpacity="0.35" />
      <line x1="89" y1="45" x2="89" y2="70" stroke="#B2321B" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
    </g>

    {/* Cloche Dome in top left */}
    <g transform="translate(36, 32)" opacity="0">
      <path d="M4 22 C4 8, 26 8, 26 22 Z" fill="#B2321B" />
      <circle cx="15" cy="7" r="2.5" fill="#B2321B" />
      <line x1="2" y1="23" x2="28" y2="23" stroke="#B2321B" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const CultureIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Ground ripples in rich Goan festival purple */}
    <path
      d="M-10 94 C30 88, 75 92, 170 84 L170 115 L-10 115 Z"
      fill="#7C3AED"
      fillOpacity="0.1"
    />
    <path
      d="M20 100 C65 94, 110 96, 170 92 L170 115 L20 115 Z"
      fill="#7C3AED"
      fillOpacity="0.18"
    />

    {/* Goan Cultural Ghumot Drum, Mandovi Acoustic Guitar & Music Beats Artwork */}
    <g transform="translate(58, 6)">
      {/* 1. Goan Heritage Mandovi Guitar / Viola */}
      <g transform="translate(24, 6)">
        {/* Guitar Neck & Headstock */}
        <line x1="8" y1="2" x2="38" y2="44" stroke="#4C1D95" strokeWidth="3.2" strokeOpacity="0.6" strokeLinecap="round" />
        {/* Tuning pegs */}
        <circle cx="8" cy="2" r="1.8" fill="#4C1D95" fillOpacity="0.7" />
        <circle cx="11" cy="5" r="1.8" fill="#4C1D95" fillOpacity="0.7" />
        
        {/* Guitar Body (Harmonic acoustic curves) */}
        <path
          d="M32 36 C24 30, 26 22, 38 24 C50 26, 56 46, 44 54 C34 60, 26 50, 32 36 Z"
          fill="#7C3AED"
          fillOpacity="0.45"
        />
        {/* Soundhole */}
        <circle cx="38" cy="38" r="4.2" fill="#4C1D95" fillOpacity="0.6" />
        {/* Strings subtle line */}
        <line x1="10" y1="5" x2="40" y2="46" stroke="#EDE9FE" strokeWidth="1" strokeOpacity="0.8" />
      </g>

      {/* 2. Traditional Goan Ghumot / Earthen Percussion Drum */}
      <g transform="translate(2, 36)">
        {/* Clay Ghumot pot body */}
        <path
          d="M12 20 C-4 25, -4 42, 12 48 L34 48 C50 42, 50 25, 34 20 Z"
          fill="#6B21A8"
          fillOpacity="0.48"
        />
        {/* Drum Top Membrane Head */}
        <ellipse cx="23" cy="20" rx="12" ry="4.5" fill="#5B21B6" fillOpacity="0.65" />
        {/* Neck ring */}
        <rect x="16" y="15" width="14" height="5" rx="1.5" fill="#7C3AED" fillOpacity="0.55" />
        {/* Base resonance hole */}
        <ellipse cx="23" cy="48" rx="7" ry="2.2" fill="#4C1D95" fillOpacity="0.5" />
      </g>

      {/* 3. Floating Musical Notes, Beats & Sound Waves */}
      <g opacity="0.7">
        {/* Single Eighth Note 1 */}
        <circle cx="8" cy="18" r="3.2" fill="#6D28D9" />
        <path d="M11 18 L11 6 L18 8 L18 12" stroke="#6D28D9" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Double Beamed Note 2 */}
        <circle cx="48" cy="8" r="2.8" fill="#6D28D9" />
        <circle cx="58" cy="11" r="2.8" fill="#6D28D9" />
        <path d="M50.5 8 L50.5 -1 L60.5 2 L60.5 11" stroke="#6D28D9" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <line x1="50.5" y1="1" x2="60.5" y2="4" stroke="#6D28D9" strokeWidth="2" />

        {/* Sixteenth Rhythmic Beats */}
        <circle cx="16" cy="38" r="2" fill="#7C3AED" />
        <circle cx="2" cy="28" r="1.6" fill="#8B5CF6" />
        
        {/* Sound Wave Curves */}
        <path d="M56 26 C60 22, 60 14, 56 10" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M60 29 C66 23, 66 11, 60 5" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.4" />
      </g>
    </g>
  </svg>
);

export const CouponsIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Ground ripples in warm golden amber - Just the discount bag (no stars, no sparkles, no tree, no sun) */}
    <path
      d="M-10 94 C30 90, 80 92, 170 86 L170 115 L-10 115 Z"
      fill="#D97706"
      fillOpacity="0.12"
    />
    <path
      d="M20 102 C65 96, 110 98, 170 94 L170 115 L20 115 Z"
      fill="#D97706"
      fillOpacity="0.2"
    />

    {/* Clean Stylish Discount Shopping Bag with % symbol */}
    <g transform="translate(68, 16)">
      {/* Bag handles */}
      <path
        d="M20 22 C20 4, 46 4, 46 22"
        stroke="#92400E"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.48"
      />
      {/* Bag body */}
      <path
        d="M6 22 L60 22 L66 80 L0 80 Z"
        fill="#D97706"
        fillOpacity="0.34"
      />
      {/* Bag fold detail */}
      <path
        d="M6 22 L33 30 L60 22"
        stroke="#92400E"
        strokeWidth="1.8"
        strokeOpacity="0.38"
        fill="none"
      />
      {/* Front Accent Pocket / Label with Percent Symbol */}
      <rect x="18" y="38" width="30" height="30" rx="4" fill="#FEF6E6" fillOpacity="0.4" />
      <text
        x="33"
        y="60"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="22"
        fontWeight="bold"
        fill="#92400E"
        fillOpacity="0.85"
      >
        %
      </text>
    </g>
  </svg>
);

export const EmergencyIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Soft ground hills in emergency red (Danger sign removed) */}
    <path
      d="M-10 92 C30 88, 80 90, 170 84 L170 115 L-10 115 Z"
      fill="#DC2626"
      fillOpacity="0.12"
    />
    <path
      d="M15 98 C60 92, 110 94, 170 90 L170 115 L15 115 Z"
      fill="#DC2626"
      fillOpacity="0.2"
    />

    {/* Medical Health Kit Box with Cross Sign in Red (No danger sign) */}
    <g transform="translate(62, 16)">
      {/* Health Kit Handle */}
      <path
        d="M28 18 C28 8, 52 8, 52 18"
        stroke="#991B1B"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.55"
      />
      {/* First Aid Box Body */}
      <rect x="6" y="18" width="68" height="54" rx="8" fill="#DC2626" fillOpacity="0.34" />
      <rect x="6" y="18" width="68" height="54" rx="8" stroke="#991B1B" strokeWidth="1.8" strokeOpacity="0.45" fill="none" />
      
      {/* Box Latches */}
      <rect x="16" y="16.5" width="8" height="7" rx="1.5" fill="#FFFFFF" fillOpacity="0.65" />
      <rect x="56" y="16.5" width="8" height="7" rx="1.5" fill="#FFFFFF" fillOpacity="0.65" />

      {/* Prominent White Medical Cross on Health Kit */}
      <g transform="translate(40, 45)">
        <circle cx="0" cy="0" r="16" fill="#FFFFFF" fillOpacity="0.85" />
        <rect x="-3.5" y="-10.5" width="7" height="21" rx="2" fill="#DC2626" fillOpacity="0.95" />
        <rect x="-10.5" y="-3.5" width="21" height="7" rx="2" fill="#DC2626" fillOpacity="0.95" />
      </g>
    </g>

    {/* Clean Heartbeat / Emergency Pulse Lifeline */}
    <g opacity="0">
      <path
        d="M6 78 L26 78 L31 71 L36 85 L42 66 L47 83 L52 78 L80 78"
        stroke="#DC2626"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  </svg>
);

export const ProfileIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Soft ground curve in teal */}
    <path
      d="M-10 92 C30 88, 80 90, 170 84 L170 115 L-10 115 Z"
      fill="#0D9488"
      fillOpacity="0.12"
    />
    <path
      d="M15 98 C60 92, 110 94, 170 90 L170 115 L15 115 Z"
      fill="#0D9488"
      fillOpacity="0.2"
    />

    {/* Traveler Profile Card with Avatar & Impact Pie Graphic */}
    <g transform="translate(62, 16)">
      {/* Profile Card Body */}
      <rect x="6" y="14" width="68" height="58" rx="10" fill="#0D9488" fillOpacity="0.32" />
      <rect x="6" y="14" width="68" height="58" rx="10" stroke="#0F766E" strokeWidth="1.8" strokeOpacity="0.45" fill="none" />

      {/* User avatar circle badge */}
      <circle cx="28" cy="35" r="13" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="28" cy="31" r="5" fill="#0D9488" fillOpacity="0.85" />
      <path d="M19 44 C20 39, 36 39, 37 44 Z" fill="#0D9488" fillOpacity="0.85" />

      {/* Mini Impact Pie Silhouette */}
      <g transform="translate(56, 35)">
        <circle cx="0" cy="0" r="11" fill="#FFFFFF" fillOpacity="0.85" />
        <path d="M0 0 L0 -11 A11 11 0 0 1 10 4 Z" fill="#0D9488" fillOpacity="0.95" />
        <path d="M0 0 L10 4 A11 11 0 0 1 -7 8 Z" fill="#F59E0B" fillOpacity="0.9" />
        <path d="M0 0 L-7 8 A11 11 0 0 1 0 -11 Z" fill="#3B82F6" fillOpacity="0.85" />
      </g>

      {/* Identity lines */}
      <rect x="14" y="54" width="34" height="4" rx="2" fill="#0F766E" fillOpacity="0.55" />
      <rect x="14" y="61" width="52" height="3" rx="1.5" fill="#14B8A6" fillOpacity="0.65" />
    </g>
  </svg>
);
