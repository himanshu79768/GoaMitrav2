export interface UserPreferences {
  name: string;
  tourismTypes: string[];
  travelMonth: string;
  memberCount: number;
  travelType: string;
}

export type DisabilityType = 'none' | 'deaf' | 'unsound' | 'visual' | 'motor' | 'everything';

export type GAIResponseTone = 'local' | 'concise' | 'sensory' | 'calm' | 'plain';

export interface AccessibilitySettings {
  hasDisability: boolean;
  disabilityType: DisabilityType;
  highContrast: boolean;
  contrastTheme: 'standard' | 'high_contrast' | 'soft_calm';
  narration: boolean;
  narrationSpeed: number;
  visualAlerts: boolean;
  captions: boolean;
  speechInput: boolean;
  eyeControl: boolean;
  dwellTime: number;
  gaiResponseTone: GAIResponseTone;
  reducedMotion: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  hasDisability: false,
  disabilityType: 'none',
  highContrast: false,
  contrastTheme: 'standard',
  narration: false,
  narrationSpeed: 1.0,
  visualAlerts: false,
  captions: false,
  speechInput: false,
  eyeControl: false,
  dwellTime: 1.5,
  gaiResponseTone: 'local',
  reducedMotion: false,
};

export function getDisabilityDefaults(type: DisabilityType): Partial<AccessibilitySettings> {
  switch (type) {
    case 'deaf':
      return {
        hasDisability: true,
        disabilityType: 'deaf',
        visualAlerts: true,
        captions: true,
        narration: false,
        highContrast: false,
        contrastTheme: 'standard',
        eyeControl: false,
        gaiResponseTone: 'concise',
        reducedMotion: false,
      };
    case 'unsound':
      return {
        hasDisability: true,
        disabilityType: 'unsound',
        contrastTheme: 'soft_calm',
        highContrast: false,
        reducedMotion: true,
        visualAlerts: false,
        captions: true,
        narration: false,
        eyeControl: false,
        gaiResponseTone: 'calm',
      };
    case 'visual':
      return {
        hasDisability: true,
        disabilityType: 'visual',
        highContrast: true,
        contrastTheme: 'high_contrast',
        narration: true,
        visualAlerts: false,
        captions: true,
        eyeControl: false,
        gaiResponseTone: 'sensory',
        reducedMotion: false,
      };
    case 'motor':
      return {
        hasDisability: true,
        disabilityType: 'motor',
        eyeControl: true,
        speechInput: true,
        dwellTime: 1.5,
        visualAlerts: false,
        highContrast: false,
        contrastTheme: 'standard',
        gaiResponseTone: 'concise',
        reducedMotion: false,
      };
    case 'everything':
      return {
        hasDisability: true,
        disabilityType: 'everything',
        highContrast: true,
        contrastTheme: 'high_contrast',
        narration: true,
        visualAlerts: true,
        captions: true,
        speechInput: true,
        eyeControl: true,
        dwellTime: 1.5,
        gaiResponseTone: 'plain',
        reducedMotion: true,
      };
    case 'none':
    default:
      return {
        hasDisability: false,
        disabilityType: 'none',
        highContrast: false,
        contrastTheme: 'standard',
        narration: false,
        visualAlerts: false,
        captions: false,
        speechInput: false,
        eyeControl: false,
        gaiResponseTone: 'local',
        reducedMotion: false,
      };
  }
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
