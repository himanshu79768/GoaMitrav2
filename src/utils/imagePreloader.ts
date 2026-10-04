/**
 * Image Preloader & Cache Manager
 * Pre-warms all primary app assets, hero photography, transit vehicle cutouts,
 * and card media in browser cache using live data sources from Stay, Destination,
 * Travel, Food, and Culture modules to ensure instant, zero-flicker transitions.
 */

import heroImg from '../assets/images/hero.png';
import heroWinterImg from '../assets/images/divar_paddy_winter_1790959654093.jpg';
import heroRainyImg from '../assets/images/dudhsagar_rainy_1790959667095.jpg';
import heritageImg from '../assets/images/goa_heritage_tourism_1790841197716.jpg';
import culturalImg from '../assets/images/goa_cultural_tourism_1790841178468.jpg';
import beachImg from '../assets/images/goa_beach_tourism_1790841233130.jpg';
import coastalImg from '../assets/images/goa_coastal_hero_1790837252672.jpg';
import monsoonHeroImg from '../assets/images/goa_monsoon_hero_1790946492098.jpg';
import winterHeroImg from '../assets/images/goa_winter_foggy_hero_1790946476359.jpg';

// Import actual live datasets
import { ACCURATE_VERIFIED_STAYS } from '../components/StayPage';
import { ALL_DESTINATIONS } from '../components/DestinationsPage';
import { REAL_RESTAURANTS, ALL_DISHES } from '../components/FoodPage';
import { CULTURAL_EVENTS } from '../components/CulturePage';
import { TRAVEL_VEHICLE_IMAGES } from '../components/TravelPage';

// High-Priority Transit Vehicle Cutout URLs
const TRAVEL_IMAGES: string[] = Object.values(TRAVEL_VEHICLE_IMAGES);

// Section Hero Banners
const SECTION_HERO_IMAGES: string[] = [
  // Stay Hero
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&auto=format&fit=crop&q=80',
  // Destinations Hero (Fort Aguada)
  'https://media.assettype.com/deccanherald%2F2024-05%2F43de3cf9-97d2-4a57-9d99-16b75841ee2d%2Ffile7v4ykn10tol18133slbx.jpg?rect=0%2C0%2C3884%2C2185&w=900&auto=format%2Ccompress&fit=max',
  // Food Hero Banner
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8X6-PLjsuLI00nZHv5On_00OmI7qvzUNx5KOvQdStZg&s=10',
  // Emergency Hero
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
];

const LOCAL_ASSETS: string[] = [
  heroImg,
  heroWinterImg,
  heroRainyImg,
  heritageImg,
  culturalImg,
  beachImg,
  coastalImg,
  monsoonHeroImg,
  winterHeroImg,
];

/** Gathers all active image URLs across all modules without duplicates */
export function getAllAppImageUrls(): string[] {
  const urls = new Set<string>();

  // 1. High priority travel vehicle images
  TRAVEL_IMAGES.forEach((src) => {
    if (src) urls.add(src);
  });

  // 2. Section Hero Images
  SECTION_HERO_IMAGES.forEach((src) => {
    if (src) urls.add(src);
  });

  // 3. Local core assets
  LOCAL_ASSETS.forEach((src) => {
    if (src) urls.add(src);
  });

  // 4. Actual Stay images
  ACCURATE_VERIFIED_STAYS.forEach((stay) => {
    if (stay.image) urls.add(stay.image);
  });

  // 5. Actual Destination images
  ALL_DESTINATIONS.forEach((dest) => {
    if (dest.image) urls.add(dest.image);
  });

  // 6. Actual Food (Restaurants & Dishes) images
  REAL_RESTAURANTS.forEach((rest) => {
    if (rest.image) urls.add(rest.image);
  });
  ALL_DISHES.forEach((dish) => {
    if (dish.image) urls.add(dish.image);
  });

  // 7. Actual Culture events images
  CULTURAL_EVENTS.forEach((evt) => {
    if (evt.image) urls.add(evt.image);
  });

  return Array.from(urls);
}

const preloadedCache = new Set<string>();

/** Inject high-priority preload link into document head */
function injectPreloadLink(src: string): void {
  try {
    if (typeof document === 'undefined') return;
    const existing = document.querySelector(`link[rel="preload"][href="${src}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      // Set high priority for instant vehicle & hero rendering
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }
  } catch {}
}

/** Preload single image with decoding in memory + browser HTTP disk cache warm-up */
function preloadSingleImage(src: string, isPriority = false): void {
  if (preloadedCache.has(src)) return;
  preloadedCache.add(src);

  if (isPriority) {
    injectPreloadLink(src);
  }

  // Pre-decode using Image object for instant paint
  try {
    const img = new Image();
    img.decoding = 'async';
    // Use high fetch priority on supporting browsers
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = isPriority ? 'high' : 'auto';
    img.src = src;
    if (img.decode) {
      img.decode().catch(() => {});
    }
  } catch {}

  // Also prefetch HTTP response into browser network cache
  if (typeof fetch === 'function') {
    try {
      fetch(src, { mode: 'no-cors', priority: isPriority ? 'high' : 'low', cache: 'force-cache' }).catch(() => {});
    } catch {}
  }
}

/**
 * Preloads all actual app images with a tiered, aggressive strategy:
 * Tier 1: Travel cutouts & hero banners are preloaded immediately with high priority.
 * Tier 2: All module cards (stays, destinations, food, culture) are loaded in parallel.
 */
export function preloadAllAppImages(): void {
  if (typeof window === 'undefined') return;

  // Tier 1: Immediate critical priority (Travel vehicles, Hero banners, Local assets)
  const priorityAssets = [...TRAVEL_IMAGES, ...SECTION_HERO_IMAGES, ...LOCAL_ASSETS];
  priorityAssets.forEach((src) => {
    preloadSingleImage(src, true);
  });

  // Tier 2: Load all remaining catalog images immediately in parallel
  const allImages = getAllAppImageUrls();
  const remainingImages = allImages.filter((src) => !priorityAssets.includes(src));

  // Run in concurrent micro-batches to maximize throughput
  const batchLoad = () => {
    remainingImages.forEach((src) => {
      preloadSingleImage(src, false);
    });
  };

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(batchLoad);
  } else {
    setTimeout(batchLoad, 10);
  }
}
