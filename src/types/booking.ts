export interface StayBooking {
  id: string;
  stayId: string;
  stayName: string;
  stayLocality: string;
  stayImage: string;
  starRating: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkInDate: string;
  durationNights: number;
  guestsCount: number;
  roomsCount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'pay_at_homestay';
  paymentMethodTitle: string;
  basePricePerRoom: number;
  staySubtotal: number;
  gstAmount: number;
  totalAmount: number;
  bookedAt: string;
  // Division of Money:
  localShare: number; // 78%
  govtShare: number;  // 14%
  appShare: number;   // 8%
}

export const STAY_BOOKINGS_STORAGE_KEY = 'goamitra_stay_bookings';

export function getStoredStayBookings(): StayBooking[] {
  try {
    const raw = localStorage.getItem(STAY_BOOKINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read stay bookings', e);
  }
  return [];
}

export function saveStayBooking(booking: StayBooking): void {
  try {
    const current = getStoredStayBookings();
    const updated = [booking, ...current];
    localStorage.setItem(STAY_BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save stay booking', e);
  }
}
