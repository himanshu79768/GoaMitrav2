/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HeroSection } from './components/HeroSection';
import { ModuleGrid } from './components/ModuleGrid';
import { HomeIndicator } from './components/HomeIndicator';

export default function App() {
  return (
    <main className="w-full min-h-screen bg-[#E5E5DF] sm:py-0 flex items-center justify-center">
      {/* Mobile Screen Container: fills mobile viewport directly, centered cleanly on desktop without fake phone hardware/bezels */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#F7F7F5] flex flex-col justify-between relative shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-x-hidden">
        <div>
          {/* Hero Section: Goa Photography, Location Pill, Greeting, and GAI Bar */}
          <HeroSection />

          {/* 2-Column Module Grid: Stay, Destinations, Food, Culture, Coupons, Emergency */}
          <ModuleGrid />
        </div>

        {/* iOS Home Indicator */}
        <HomeIndicator />
      </div>
    </main>
  );
}
