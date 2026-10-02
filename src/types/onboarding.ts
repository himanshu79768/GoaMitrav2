export interface UserPreferences {
  name: string;
  tourismTypes: string[];
  travelMonth: string;
  memberCount: number;
  travelType: string;
}

export interface SavedPlaceItem {
  id: string;
  title: string;
  category: 'destination' | 'stay' | 'food' | 'culture' | 'coupon';
  subtitle?: string;
  location?: string;
  image?: string;
  ratingOrPrice?: string;
  savedAt?: string;
  tags?: string[];
}

export interface SavedItineraryItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  season?: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  name: '',
  tourismTypes: [],
  travelMonth: '',
  memberCount: 2,
  travelType: 'Couple / Duo',
};
