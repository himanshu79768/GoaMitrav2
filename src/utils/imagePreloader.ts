/**
 * Image Preloader & Cache Manager
 * Pre-warms all primary app assets, hero photography, and card media in browser cache
 * to ensure instant, zero-flicker transitions and sub-millisecond rendering.
 */

import heroImg from '../assets/images/hero.png';
import heritageImg from '../assets/images/goa_heritage_tourism_1790841197716.jpg';
import culturalImg from '../assets/images/goa_cultural_tourism_1790841178468.jpg';
import beachImg from '../assets/images/goa_beach_tourism_1790841233130.jpg';
import coastalImg from '../assets/images/goa_coastal_hero_1790837252672.jpg';

const CORE_IMAGES: string[] = [
  heroImg,
  heritageImg,
  culturalImg,
  beachImg,
  coastalImg,
  // Stay Photography
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&auto=format&fit=crop&q=80',
  // Destination Photography
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428033-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  // Food Photography
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80',
];

const preloadedCache = new Set<string>();

export function preloadAllAppImages(): void {
  if (typeof window === 'undefined') return;

  CORE_IMAGES.forEach((src) => {
    if (!preloadedCache.has(src)) {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      preloadedCache.add(src);
    }
  });
}
