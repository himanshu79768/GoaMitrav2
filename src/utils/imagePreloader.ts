/**
 * Image Preloader & Cache Manager
 * Pre-warms all primary app assets, hero photography, and card media in browser cache
 * using the actual data sources from Stay, Destination, Food, and Culture modules
 * to ensure instant, zero-flicker transitions and sub-millisecond rendering.
 */

import heroImg from '../assets/images/hero.png';
import heroWinterImg from '../assets/images/divar_paddy_winter_1790959654093.jpg';
import heroRainyImg from '../assets/images/dudhsagar_rainy_1790959667095.jpg';
import heritageImg from '../assets/images/goa_heritage_tourism_1790841197716.jpg';
import culturalImg from '../assets/images/goa_cultural_tourism_1790841178468.jpg';
import beachImg from '../assets/images/goa_beach_tourism_1790841233130.jpg';
import coastalImg from '../assets/images/goa_coastal_hero_1790837252672.jpg';
import autoImg from '../assets/images/auto_rickshaw_left_transparent.png';
import scooterImg from '../assets/images/scooter_left_transparent.png';
import taxiImg from '../assets/images/taxi_left_transparent.png';
import busImg from '../assets/images/bus_left_transparent.png';

// Import actual live datasets
import { ACCURATE_VERIFIED_STAYS } from '../components/StayPage';
import { ALL_DESTINATIONS } from '../components/DestinationsPage';
import { REAL_RESTAURANTS, ALL_DISHES } from '../components/FoodPage';
import { CULTURAL_EVENTS } from '../components/CulturePage';

// Hero banners & section photography
const SECTION_HERO_IMAGES: string[] = [
  // Stay Hero
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&auto=format&fit=crop&q=80',
  // Destinations Hero
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
  autoImg,
  scooterImg,
  taxiImg,
  busImg,
];

/** Gathers all active image URLs across Stay, Destinations, Food, Culture and Hero sections */
export function getAllAppImageUrls(): string[] {
  const urls = new Set<string>();

  // 1. Local core assets
  LOCAL_ASSETS.forEach((src) => {
    if (src) urls.add(src);
  });

  // 2. Section Hero Images
  SECTION_HERO_IMAGES.forEach((src) => {
    if (src) urls.add(src);
  });

  // 3. Actual Stay images
  ACCURATE_VERIFIED_STAYS.forEach((stay) => {
    if (stay.image) urls.add(stay.image);
  });

  // 4. Actual Destination images
  ALL_DESTINATIONS.forEach((dest) => {
    if (dest.image) urls.add(dest.image);
  });

  // 5. Actual Food (Restaurants & Dishes) images
  REAL_RESTAURANTS.forEach((rest) => {
    if (rest.image) urls.add(rest.image);
  });
  ALL_DISHES.forEach((dish) => {
    if (dish.image) urls.add(dish.image);
  });

  // 6. Actual Culture events images
  CULTURAL_EVENTS.forEach((evt) => {
    if (evt.image) urls.add(evt.image);
  });

  return Array.from(urls);
}

const preloadedCache = new Set<string>();

/** Preloads all actual app images into browser cache with non-blocking priority */
export function preloadAllAppImages(): void {
  if (typeof window === 'undefined') return;

  const allImages = getAllAppImageUrls();

  allImages.forEach((src) => {
    if (!preloadedCache.has(src)) {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      preloadedCache.add(src);
    }
  });
}
