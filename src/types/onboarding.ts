export interface UserPreferences {
  name: string;
  tourismTypes: string[];
  travelMonth: string;
  memberCount: number;
  travelType: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  name: 'User',
  tourismTypes: ['Cultural Tourism', 'Heritage Tourism'],
  travelMonth: 'November',
  memberCount: 2,
  travelType: 'Couple / Duo',
};
