import React from 'react';

/**
 * Custom vector illustrations for module cards matching exact user specifications:
 * 1. Stay: Goan home / villa in warm orange
 * 2. Destinations: Fort Aguada in coastal green
 * 3. Food: Goan culinary food dishes & platter in coral red
 * 4. Culture: Old Goa heritage monuments (Basilica of Bom Jesus) in royal purple
 * 5. Coupons: Shopping bag with % (with tree and sun removed) in warm gold
 * 6. Emergency: Danger warning alert and medical health kit in vibrant red
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
      {/* Balcão sloping front canopy */}
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

    {/* Cozy garden planter & lantern beside home */}
    <g transform="translate(42, 68)" opacity="0.4">
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
    {/* Ocean waves around Fort Aguada base */}
    <path
      d="M-10 92 C25 88, 60 92, 100 86 C130 82, 155 86, 175 80 L175 115 L-10 115 Z"
      fill="#059669"
      fillOpacity="0.12"
    />
    <path
      d="M15 98 C55 92, 95 94, 175 86 L175 115 L15 115 Z"
      fill="#059669"
      fillOpacity="0.2"
    />

    {/* Fort Aguada - Famous Circular Bastion & Ramparts */}
    <g transform="translate(60, 20)">
      {/* Massive Circular Stone Fortress Bastion of Aguada */}
      <path
        d="M28 28 C28 20, 68 20, 68 28 L72 68 L24 68 Z"
        fill="#047857"
        fillOpacity="0.35"
      />
      {/* Top parapet / gun platform */}
      <ellipse cx="48" cy="28" rx="22" ry="5.5" fill="#10B981" fillOpacity="0.3" />
      <ellipse cx="48" cy="27" rx="20" ry="4.5" fill="#065F46" fillOpacity="0.35" />

      {/* Fort Aguada Watchtower / Lantern Citadel */}
      <rect x="42" y="10" width="12" height="18" fill="#047857" fillOpacity="0.45" rx="1.5" />
      <rect x="40" y="8" width="16" height="3" fill="#065F46" fillOpacity="0.5" rx="1" />
      <path d="M43 8 C43 3, 53 3, 53 8 Z" fill="#065F46" fillOpacity="0.55" />
      <rect x="46" y="14" width="4" height="6" fill="#022C22" fillOpacity="0.4" rx="1.5" />

      {/* Sea-facing stone battlements & cannon embrasures */}
      <rect x="25" y="24" width="5" height="5" fill="#047857" fillOpacity="0.45" />
      <rect x="35" y="23" width="5" height="5" fill="#047857" fillOpacity="0.45" />
      <rect x="56" y="23" width="5" height="5" fill="#047857" fillOpacity="0.45" />
      <rect x="66" y="24" width="5" height="5" fill="#047857" fillOpacity="0.45" />

      {/* Lower curtain rampart wall extending to the sea */}
      <path
        d="M-2 46 L28 46 L24 76 L-6 76 Z"
        fill="#047857"
        fillOpacity="0.28"
      />
      {/* Wall crenellations */}
      <rect x="2" y="42" width="6" height="5" fill="#047857" fillOpacity="0.4" />
      <rect x="12" y="42" width="6" height="5" fill="#047857" fillOpacity="0.4" />
      <rect x="22" y="42" width="6" height="5" fill="#047857" fillOpacity="0.4" />

      {/* Fort gate arch */}
      <path d="M10 76 C10 62, 20 62, 20 76 Z" fill="#022C22" fillOpacity="0.4" />
    </g>

    {/* Swaying coconut palms around Fort Aguada */}
    <g transform="translate(132, 20)">
      <path
        d="M10 72 C8 48, 4 28, 0 14"
        stroke="#065F46"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeOpacity="0.38"
      />
      <path
        d="M0 14 C-10 6, -18 10, -22 18 M0 14 C-8 2, -14 -4, -10 -10 M0 14 C4 4, 12 2, 16 -2 M0 14 C-2 20, 2 26, 10 30"
        stroke="#059669"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
    </g>

    {/* Flying seagulls over Aguada coast */}
    <g opacity="0.35">
      <path d="M30 24 Q34 20 38 24 Q42 20 46 24" stroke="#065F46" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M48 18 Q51 15 54 18 Q57 15 60 18" stroke="#065F46" strokeWidth="1" strokeLinecap="round" fill="none" />
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
        {/* Grill marks */}
        <line x1="6" y1="2" x2="16" y2="10" stroke="#7C2D12" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="10" y1="1" x2="18" y2="8" stroke="#7C2D12" strokeWidth="1.2" strokeOpacity="0.6" />
      </g>

      {/* Rice Bowl */}
      <ellipse cx="64" cy="58" rx="12" ry="8" fill="#FFFFFF" fillOpacity="0.6" />
      <ellipse cx="64" cy="58" rx="12" ry="8" stroke="#B2321B" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      
      {/* Lemon wedge */}
      <path d="M12 46 C16 42, 22 46, 20 52 Z" fill="#F59E0B" fillOpacity="0.65" />

      {/* Cutlery beside thali */}
      {/* Fork */}
      <path d="M-4 38 L-4 68 M-7 38 L-7 46 M-1 38 L-1 46" stroke="#B2321B" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4" />
      {/* Spoon */}
      <ellipse cx="89" cy="40" rx="3.5" ry="5.5" fill="#B2321B" fillOpacity="0.35" />
      <line x1="89" y1="45" x2="89" y2="70" stroke="#B2321B" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
    </g>

    {/* Cloche Dome in top left */}
    <g transform="translate(36, 32)" opacity="0.3">
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
    {/* Soft ground hills in Old Goa purple */}
    <path
      d="M-10 94 C30 88, 75 92, 170 84 L170 115 L-10 115 Z"
      fill="#6B21A8"
      fillOpacity="0.1"
    />
    <path
      d="M20 100 C65 94, 110 96, 170 92 L170 115 L20 115 Z"
      fill="#6B21A8"
      fillOpacity="0.18"
    />

    {/* Famous Basilica of Bom Jesus, Old Goa (UNESCO World Heritage) */}
    <g transform="translate(62, 12)">
      {/* Three-Tier Baroque Red Laterite Facade */}
      
      {/* Tier 1 (Base Level with 3 Arched Entrances) */}
      <rect x="8" y="44" width="70" height="34" fill="#6B21A8" fillOpacity="0.3" rx="1" />
      {/* Grand Central Portal / Arch */}
      <path d="M37 78 C37 60, 49 60, 49 78 Z" fill="#3B0764" fillOpacity="0.45" />
      {/* Side Arches */}
      <path d="M16 78 C16 66, 24 66, 24 78 Z" fill="#3B0764" fillOpacity="0.4" />
      <path d="M62 78 C62 66, 70 66, 70 78 Z" fill="#3B0764" fillOpacity="0.4" />

      {/* Tier 2 (Middle Level with Corinthian Pillars & Windows) */}
      <rect x="14" y="24" width="58" height="20" fill="#6B21A8" fillOpacity="0.35" rx="1" />
      {/* Pilasters */}
      <rect x="18" y="24" width="3" height="20" fill="#4A044E" fillOpacity="0.45" />
      <rect x="33" y="24" width="3" height="20" fill="#4A044E" fillOpacity="0.45" />
      <rect x="50" y="24" width="3" height="20" fill="#4A044E" fillOpacity="0.45" />
      <rect x="65" y="24" width="3" height="20" fill="#4A044E" fillOpacity="0.45" />
      {/* Circular Rose Windows */}
      <circle cx="26" cy="34" r="3.5" fill="#3B0764" fillOpacity="0.4" />
      <circle cx="43" cy="34" r="4.5" fill="#3B0764" fillOpacity="0.45" />
      <circle cx="58" cy="34" r="3.5" fill="#3B0764" fillOpacity="0.4" />

      {/* Tier 3 (Top Baroque Gable with Jesuits IHS Emblems & Scrolls) */}
      <path
        d="M26 24 C26 12, 43 8, 43 8 C43 8, 60 12, 60 24 Z"
        fill="#6B21A8"
        fillOpacity="0.42"
      />
      {/* Baroque scroll flanks */}
      <path d="M26 24 C22 20, 22 14, 26 14" stroke="#4A044E" strokeWidth="2" strokeOpacity="0.45" fill="none" />
      <path d="M60 24 C64 20, 64 14, 60 14" stroke="#4A044E" strokeWidth="2" strokeOpacity="0.45" fill="none" />
      
      {/* Historic Cross on Apex */}
      <rect x="42" y="1" width="2" height="9" fill="#3B0764" fillOpacity="0.55" />
      <rect x="39" y="3.5" width="8" height="2" fill="#3B0764" fillOpacity="0.55" />

      {/* Adjacent Se Cathedral Bell Tower in Old Goa */}
      <rect x="-4" y="28" width="12" height="50" fill="#6B21A8" fillOpacity="0.25" rx="1" />
      <path d="M-4 28 L2 18 L8 28 Z" fill="#4A044E" fillOpacity="0.4" />
      <rect x="0" y="34" width="4" height="8" fill="#3B0764" fillOpacity="0.35" rx="1.5" />

      {/* Grand baroque stepped plaza */}
      <path d="M-8 78 L86 78 L90 84 L-12 84 Z" fill="#6B21A8" fillOpacity="0.25" />
    </g>

    {/* Old Goa coconut palm */}
    <g transform="translate(136, 16)">
      <path
        d="M10 74 C8 50, 4 30, 0 16"
        stroke="#4A044E"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <path
        d="M0 16 C-10 8, -18 12, -20 20 M0 16 C-8 4, -14 -2, -10 -8 M0 16 C4 6, 12 4, 16 0 M0 16 C-2 22, 2 28, 8 32"
        stroke="#6B21A8"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
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
    {/* Ground ripples in warm golden amber - NO tree, NO sun */}
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

    {/* Shopping Bag with % symbol (same as requested, without tree and without sun) */}
    <g transform="translate(76, 20)">
      {/* Bag handles */}
      <path
        d="M16 20 C16 4, 38 4, 38 20"
        stroke="#92400E"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.45"
      />
      {/* Bag body */}
      <path
        d="M4 20 L50 20 L55 74 L0 74 Z"
        fill="#D97706"
        fillOpacity="0.32"
      />
      {/* Bag fold detail */}
      <path
        d="M4 20 L27 27 L50 20"
        stroke="#92400E"
        strokeWidth="1.6"
        strokeOpacity="0.35"
        fill="none"
      />
      {/* Percent Symbol on Bag */}
      <text
        x="27"
        y="54"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="19"
        fontWeight="bold"
        fill="#FFFFFF"
        fillOpacity="0.85"
      >
        %
      </text>
    </g>

    {/* Additional Gift Box & Coupon Vouchers with % - replacing tree and sun */}
    <g transform="translate(24, 46)">
      {/* Discount Voucher Ticket */}
      <rect x="0" y="8" width="42" height="24" rx="3" fill="#D97706" fillOpacity="0.25" stroke="#92400E" strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity="0.4" />
      <circle cx="0" cy="20" r="4" fill="#FEF6E6" />
      <circle cx="42" cy="20" r="4" fill="#FEF6E6" />
      <text x="21" y="25" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#92400E" fillOpacity="0.6">
        50% OFF
      </text>
    </g>

    {/* Sparkle discount accents */}
    <g opacity="0.35">
      <path d="M136 28 L138 34 L144 36 L138 38 L136 44 L134 38 L128 36 L134 34 Z" fill="#D97706" />
      <path d="M42 28 L43.5 32 L48 33.5 L43.5 35 L42 39 L40.5 35 L36 33.5 L40.5 32 Z" fill="#D97706" />
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
    {/* Soft ground hills in emergency red */}
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

    {/* Medical Health Kit Box with Cross Sign in Red */}
    <g transform="translate(68, 22)">
      {/* Health Kit Handle */}
      <path
        d="M24 16 C24 8, 44 8, 44 16"
        stroke="#991B1B"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.5"
      />
      {/* First Aid Box Body */}
      <rect x="6" y="16" width="56" height="48" rx="6" fill="#DC2626" fillOpacity="0.32" />
      <rect x="6" y="16" width="56" height="48" rx="6" stroke="#991B1B" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
      
      {/* Box Latches */}
      <rect x="14" y="15" width="6" height="6" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
      <rect x="48" y="15" width="6" height="6" rx="1" fill="#FFFFFF" fillOpacity="0.6" />

      {/* Prominent White Medical Cross on Health Kit */}
      <g transform="translate(34, 40)">
        <circle cx="0" cy="0" r="14" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="-3" y="-9" width="6" height="18" rx="1.5" fill="#DC2626" fillOpacity="0.9" />
        <rect x="-9" y="-3" width="18" height="6" rx="1.5" fill="#DC2626" fillOpacity="0.9" />
      </g>
    </g>

    {/* Danger Warning Triangle with Exclamation Sign in Red */}
    <g transform="translate(24, 30)">
      {/* Rounded Danger Alert Triangle */}
      <path
        d="M18 4 L34 32 C35.5 35, 33.5 37, 30 37 L6 37 C2.5 37, 0.5 35, 2 32 L18 4 Z"
        fill="#EF4444"
        fillOpacity="0.3"
        stroke="#B91C1C"
        strokeWidth="1.5"
        strokeOpacity="0.45"
      />
      {/* Exclamation point */}
      <rect x="16.5" y="14" width="3" height="10" rx="1.5" fill="#991B1B" fillOpacity="0.75" />
      <circle cx="18" cy="28" r="1.8" fill="#991B1B" fillOpacity="0.75" />
    </g>

    {/* ECG / Emergency Pulse Lifeline */}
    <g opacity="0.35">
      <path
        d="M2 78 L20 78 L24 72 L28 84 L32 68 L36 82 L40 78 L70 78"
        stroke="#DC2626"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  </svg>
);
