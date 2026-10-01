import React from 'react';

/**
 * Beautiful, delicate Goan vector illustrations designed specifically
 * for the background of each module card at low opacity (~20-30%).
 */

export const StayIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Ground dune */}
    <path
      d="M-10 102 C30 96, 80 100, 170 94 L170 115 L-10 115 Z"
      fill="#C0653B"
      fillOpacity="0.18"
    />
    <path
      d="M20 105 C60 98, 110 102, 170 98 L170 115 L20 115 Z"
      fill="#C0653B"
      fillOpacity="0.25"
    />
    
    {/* Goan beach hut / shack */}
    <g transform="translate(68, 22)">
      {/* Thatched roof */}
      <path
        d="M-8 32 L36 4 L80 32 L74 36 L36 12 L-2 36 Z"
        fill="#A84C25"
        fillOpacity="0.45"
      />
      <path
        d="M-4 34 L36 8 L76 34 Z"
        fill="#C0653B"
        fillOpacity="0.3"
      />
      {/* Thatch roof ridges */}
      <path
        d="M6 28 L36 10 L66 28"
        stroke="#8F3C18"
        strokeWidth="1.2"
        strokeOpacity="0.4"
      />
      {/* Shack posts */}
      <rect x="2" y="34" width="3" height="42" fill="#8F3C18" fillOpacity="0.45" rx="1" />
      <rect x="22" y="34" width="2.5" height="42" fill="#8F3C18" fillOpacity="0.35" rx="1" />
      <rect x="46" y="34" width="2.5" height="42" fill="#8F3C18" fillOpacity="0.35" rx="1" />
      <rect x="68" y="34" width="3" height="42" fill="#8F3C18" fillOpacity="0.45" rx="1" />
      {/* Shack platform deck */}
      <rect x="-4" y="68" width="78" height="4" fill="#8F3C18" fillOpacity="0.4" rx="1.5" />
      <rect x="0" y="72" width="70" height="2" fill="#8F3C18" fillOpacity="0.25" />
      {/* Interior louvers / furniture silhouette */}
      <rect x="26" y="48" width="18" height="20" fill="#A84C25" fillOpacity="0.22" rx="1" />
      <path d="M8 58 L18 58 M52 58 L62 58" stroke="#8F3C18" strokeWidth="1.5" strokeOpacity="0.3" />
    </g>

    {/* Coconut palm leaning left of shack */}
    <g transform="translate(38, 16)">
      {/* Curved trunk */}
      <path
        d="M18 84 C14 62, 10 40, 2 24 C-1 18, -4 14, -8 12"
        stroke="#8F3C18"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      {/* Palm fronds */}
      <path
        d="M-8 12 C-18 6, -26 12, -28 20 M-8 12 C-16 2, -22 -4, -18 -12 M-8 12 C-4 2, 4 -2, 8 -6 M-8 12 C-6 18, -2 24, 6 28 M-8 12 C-12 16, -18 24, -16 32"
        stroke="#A84C25"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      {/* Coconuts */}
      <circle cx="-6" cy="14" r="2.2" fill="#8F3C18" fillOpacity="0.5" />
      <circle cx="-9" cy="15" r="1.8" fill="#8F3C18" fillOpacity="0.5" />
    </g>

    {/* Distant walking silhouettes on sand */}
    <g transform="translate(18, 76)" opacity="0.35">
      <circle cx="0" cy="0" r="1.8" fill="#8F3C18" />
      <path d="M-1 2 L1 2 L1.5 9 L-1.5 9 Z" fill="#8F3C18" />
      <circle cx="6" cy="1" r="1.5" fill="#8F3C18" />
      <path d="M5 3 L7 3 L7.5 9 L4.5 9 Z" fill="#8F3C18" />
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
    {/* Distant coastal mountain backdrop */}
    <path
      d="M-10 78 C30 58, 65 64, 110 52 C135 45, 155 52, 175 48 L175 115 L-10 115 Z"
      fill="#148261"
      fillOpacity="0.12"
    />
    <path
      d="M20 86 C65 72, 105 76, 175 66 L175 115 L20 115 Z"
      fill="#148261"
      fillOpacity="0.18"
    />

    {/* Fort Aguada / Goan Bastion Ramparts */}
    <g transform="translate(68, 26)">
      {/* Fort watchtower */}
      <rect x="36" y="16" width="22" height="42" fill="#148261" fillOpacity="0.32" rx="2" />
      {/* Tower top machicolation / lantern */}
      <rect x="33" y="12" width="28" height="5" fill="#148261" fillOpacity="0.4" rx="1.5" />
      <path d="M37 12 C37 6, 57 6, 57 12 Z" fill="#148261" fillOpacity="0.45" />
      {/* Window slits */}
      <rect x="45" y="24" width="4" height="9" fill="#0C5E45" fillOpacity="0.4" rx="2" />
      
      {/* Lower ramparts & battlements */}
      <path
        d="M6 34 L36 34 L36 68 L-6 68 L-6 40 C-6 36, 0 34, 6 34 Z"
        fill="#148261"
        fillOpacity="0.25"
      />
      {/* Crenellations */}
      <rect x="8" y="30" width="6" height="5" fill="#148261" fillOpacity="0.4" />
      <rect x="18" y="30" width="6" height="5" fill="#148261" fillOpacity="0.4" />
      <rect x="28" y="30" width="6" height="5" fill="#148261" fillOpacity="0.4" />
      <rect x="58" y="34" width="24" height="34" fill="#148261" fillOpacity="0.25" />
      <rect x="62" y="30" width="6" height="5" fill="#148261" fillOpacity="0.4" />
      <rect x="72" y="30" width="6" height="5" fill="#148261" fillOpacity="0.4" />

      {/* Fort archway */}
      <path d="M16 68 C16 52, 28 52, 28 68 Z" fill="#0C5E45" fillOpacity="0.35" />
    </g>

    {/* Coconut palm framing right */}
    <g transform="translate(132, 22)">
      <path
        d="M12 70 C10 46, 6 26, 0 14"
        stroke="#10684E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <path
        d="M0 14 C-10 6, -18 10, -22 18 M0 14 C-8 2, -14 -4, -10 -10 M0 14 C4 4, 12 2, 16 -2 M0 14 C-2 20, 2 26, 10 30"
        stroke="#148261"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </g>

    {/* Flying seabirds */}
    <g opacity="0.35">
      <path d="M36 28 Q40 24 44 28 Q48 24 52 28" stroke="#10684E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M52 22 Q55 19 58 22 Q61 19 64 22" stroke="#10684E" strokeWidth="1" strokeLinecap="round" fill="none" />
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
    {/* Soft sand terrace */}
    <path
      d="M-10 98 C35 94, 85 96, 170 92 L170 115 L-10 115 Z"
      fill="#D94E34"
      fillOpacity="0.14"
    />
    <path
      d="M15 104 C65 99, 115 101, 170 98 L170 115 L15 115 Z"
      fill="#D94E34"
      fillOpacity="0.22"
    />

    {/* Goan beach dining shack */}
    <g transform="translate(68, 24)">
      {/* Thatched roof */}
      <path
        d="M-6 28 L36 6 L78 28 L72 32 L36 12 L0 32 Z"
        fill="#C93D24"
        fillOpacity="0.42"
      />
      <path
        d="M-2 30 L36 10 L74 30 Z"
        fill="#E85E46"
        fillOpacity="0.28"
      />
      {/* Support pillars */}
      <rect x="4" y="30" width="3" height="42" fill="#B2321B" fillOpacity="0.45" rx="1" />
      <rect x="24" y="30" width="2.5" height="42" fill="#B2321B" fillOpacity="0.35" rx="1" />
      <rect x="46" y="30" width="2.5" height="42" fill="#B2321B" fillOpacity="0.35" rx="1" />
      <rect x="66" y="30" width="3" height="42" fill="#B2321B" fillOpacity="0.45" rx="1" />

      {/* Dining tables & chairs under the shack */}
      <rect x="10" y="52" width="18" height="3" fill="#B2321B" fillOpacity="0.45" rx="1" />
      <rect x="18" y="55" width="2" height="15" fill="#B2321B" fillOpacity="0.4" />
      <rect x="8" y="54" width="2" height="16" fill="#B2321B" fillOpacity="0.35" />
      <rect x="28" y="54" width="2" height="16" fill="#B2321B" fillOpacity="0.35" />

      {/* Second dining table */}
      <rect x="36" y="50" width="22" height="3" fill="#B2321B" fillOpacity="0.45" rx="1" />
      <rect x="46" y="53" width="2" height="17" fill="#B2321B" fillOpacity="0.4" />
      
      {/* Hanging coastal lanterns */}
      <circle cx="16" cy="36" r="2" fill="#E85E46" fillOpacity="0.5" />
      <circle cx="36" cy="36" r="2.5" fill="#E85E46" fillOpacity="0.5" />
      <circle cx="56" cy="36" r="2" fill="#E85E46" fillOpacity="0.5" />
    </g>

    {/* Coconut palm leaning behind the cafe */}
    <g transform="translate(42, 18)">
      <path
        d="M18 80 C12 56, 8 36, 0 20 C-3 14, -6 10, -10 8"
        stroke="#B2321B"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeOpacity="0.38"
      />
      <path
        d="M-10 8 C-20 4, -26 10, -28 16 M-10 8 C-18 -2, -22 -8, -16 -14 M-10 8 C-4 -2, 4 -4, 8 -8 M-10 8 C-6 14, -2 20, 6 24"
        stroke="#D94E34"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.42"
      />
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
    {/* Soft ground hills */}
    <path
      d="M-10 92 C30 86, 75 90, 170 82 L170 115 L-10 115 Z"
      fill="#56449C"
      fillOpacity="0.1"
    />
    <path
      d="M20 98 C65 92, 110 94, 170 90 L170 115 L20 115 Z"
      fill="#56449C"
      fillOpacity="0.18"
    />

    {/* Goan Baroque Church (Panaji style) */}
    <g transform="translate(68, 16)">
      {/* Central nave facade */}
      <rect x="22" y="24" width="34" height="52" fill="#56449C" fillOpacity="0.25" rx="1.5" />
      {/* Pediment & Baroque gable */}
      <path
        d="M18 24 C18 12, 39 8, 39 8 C39 8, 60 12, 60 24 Z"
        fill="#56449C"
        fillOpacity="0.38"
      />
      {/* Cross on central gable */}
      <rect x="38" y="1" width="2" height="8" fill="#433380" fillOpacity="0.5" />
      <rect x="35" y="3" width="8" height="2" fill="#433380" fillOpacity="0.5" />

      {/* Bell tower Left */}
      <rect x="6" y="18" width="14" height="58" fill="#56449C" fillOpacity="0.32" rx="1.5" />
      <path d="M6 18 L13 8 L20 18 Z" fill="#56449C" fillOpacity="0.45" />
      <rect x="11" y="24" width="4" height="10" fill="#433380" fillOpacity="0.35" rx="2" />
      
      {/* Bell tower Right */}
      <rect x="58" y="18" width="14" height="58" fill="#56449C" fillOpacity="0.32" rx="1.5" />
      <path d="M58 18 L65 8 L72 18 Z" fill="#56449C" fillOpacity="0.45" />
      <rect x="63" y="24" width="4" height="10" fill="#433380" fillOpacity="0.35" rx="2" />

      {/* Grand baroque portal / arch door */}
      <path d="M33 76 C33 60, 45 60, 45 76 Z" fill="#433380" fillOpacity="0.4" />
      {/* Rose window circle */}
      <circle cx="39" cy="34" r="5" fill="#433380" fillOpacity="0.35" />

      {/* Iconic zigzag / tiered front stair flights */}
      <path
        d="M-2 76 L80 76 L84 82 L-6 82 Z"
        fill="#56449C"
        fillOpacity="0.28"
      />
      <path
        d="M-8 82 L86 82 L90 88 L-12 88 Z"
        fill="#56449C"
        fillOpacity="0.22"
      />
    </g>

    {/* Coconut palm flanking the church */}
    <g transform="translate(136, 18)">
      <path
        d="M10 74 C8 50, 4 30, 0 16"
        stroke="#433380"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <path
        d="M0 16 C-10 8, -18 12, -20 20 M0 16 C-8 4, -14 -2, -10 -8 M0 16 C4 6, 12 4, 16 0 M0 16 C-2 22, 2 28, 8 32"
        stroke="#56449C"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </g>

    {/* Seabirds */}
    <g opacity="0.3">
      <path d="M32 20 Q35 17 38 20 Q41 17 44 20" stroke="#433380" strokeWidth="1" strokeLinecap="round" fill="none" />
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
    {/* Warm golden sand ripples */}
    <path
      d="M-10 94 C30 90, 80 92, 170 86 L170 115 L-10 115 Z"
      fill="#E68A00"
      fillOpacity="0.14"
    />
    <path
      d="M20 102 C65 96, 110 98, 170 94 L170 115 L20 115 Z"
      fill="#E68A00"
      fillOpacity="0.22"
    />

    {/* Shopping Bag with % symbol */}
    <g transform="translate(86, 22)">
      {/* Bag handles */}
      <path
        d="M14 18 C14 4, 34 4, 34 18"
        stroke="#B36B00"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.45"
      />
      {/* Bag body */}
      <path
        d="M4 18 L44 18 L48 68 L0 68 Z"
        fill="#E68A00"
        fillOpacity="0.32"
      />
      {/* Bag fold detail */}
      <path
        d="M4 18 L24 24 L44 18"
        stroke="#B36B00"
        strokeWidth="1.5"
        strokeOpacity="0.35"
        fill="none"
      />
      {/* Percent Symbol on Bag */}
      <text
        x="24"
        y="50"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="17"
        fontWeight="bold"
        fill="#FFFFFF"
        fillOpacity="0.8"
      >
        %
      </text>
    </g>

    {/* Leaning Coconut palm tree */}
    <g transform="translate(42, 18)">
      <path
        d="M18 80 C12 56, 8 36, 0 20 C-3 14, -6 10, -10 8"
        stroke="#B36B00"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <path
        d="M-10 8 C-20 4, -26 10, -28 16 M-10 8 C-18 -2, -22 -8, -16 -14 M-10 8 C-4 -2, 4 -4, 8 -8 M-10 8 C-6 14, -2 20, 6 24"
        stroke="#E68A00"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </g>

    {/* Sunburst rays */}
    <g transform="translate(138, 28)" opacity="0.35">
      <circle cx="0" cy="0" r="8" fill="#E68A00" fillOpacity="0.3" />
      <path d="M0 -12 L0 -16 M8 -8 L11 -11 M12 0 L16 0 M8 8 L11 11 M0 12 L0 16" stroke="#B36B00" strokeWidth="1.5" strokeLinecap="round" />
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
    {/* Rocky coastal cliff backdrop */}
    <path
      d="M-10 82 C25 68, 60 74, 95 62 C125 52, 145 60, 175 54 L175 115 L-10 115 Z"
      fill="#DE3B3B"
      fillOpacity="0.12"
    />
    <path
      d="M15 90 C55 78, 100 82, 175 70 L175 115 L15 115 Z"
      fill="#DE3B3B"
      fillOpacity="0.2"
    />

    {/* Coastal Lighthouse (Fort Aguada style) */}
    <g transform="translate(98, 12)">
      {/* Lighthouse tower tapering up */}
      <path
        d="M12 28 L24 28 L28 74 L8 74 Z"
        fill="#DE3B3B"
        fillOpacity="0.3"
      />
      {/* White bands */}
      <rect x="10.5" y="40" width="15" height="7" fill="#FFFFFF" fillOpacity="0.5" />
      <rect x="9.5" y="56" width="17" height="7" fill="#FFFFFF" fillOpacity="0.5" />
      {/* Tower windows */}
      <rect x="16.5" y="32" width="3" height="5" fill="#A82424" fillOpacity="0.4" rx="1" />
      <rect x="16.5" y="48" width="3" height="5" fill="#A82424" fillOpacity="0.4" rx="1" />

      {/* Observation Gallery / railing */}
      <rect x="8" y="24" width="20" height="4" fill="#DE3B3B" fillOpacity="0.45" rx="1" />
      {/* Lantern Room (glass chamber) */}
      <rect x="11" y="16" width="14" height="8" fill="#A82424" fillOpacity="0.35" rx="1" />
      {/* Dome roof */}
      <path d="M11 16 C11 8, 25 8, 25 16 Z" fill="#DE3B3B" fillOpacity="0.45" />
      {/* Spire / lightning rod */}
      <rect x="17.5" y="4" width="1.5" height="6" fill="#A82424" fillOpacity="0.5" />

      {/* Light beam radiance (subtle) */}
      <path
        d="M11 20 L-35 8 L-35 32 Z"
        fill="#FFE8E8"
        fillOpacity="0.35"
      />
    </g>

    {/* Ocean waves breaking against rocks */}
    <g opacity="0.3">
      <path d="M18 94 C26 90, 34 94, 42 90 C50 86, 58 90, 66 86" stroke="#DE3B3B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M34 100 C42 96, 50 100, 58 96 C66 92, 74 96, 82 92" stroke="#DE3B3B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);
