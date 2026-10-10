import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StayItem } from './StayPage';
import { StayBooking, saveStayBooking } from '../types/booking';

interface StayBookingModalProps {
  stay: StayItem;
  defaultGuestName: string;
  defaultGuestCount: number;
  travelMonth?: string;
  onClose: () => void;
  onBookingSuccess: (booking: StayBooking) => void;
  onViewImpactReceipt?: (booking: StayBooking) => void;
}

export const StayBookingModal: React.FC<StayBookingModalProps> = ({
  stay,
  defaultGuestName,
  defaultGuestCount,
  travelMonth,
  onClose,
  onBookingSuccess,
  onViewImpactReceipt,
}) => {
  // Step in full screen flow: 'details' -> 'payment' -> 'success'
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Booking Form State - watermarks by default (empty initial values)
  const [fullName, setFullName] = useState(defaultGuestName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nights, setNights] = useState<number>(3);
  const [guests, setGuests] = useState<number>(defaultGuestCount > 0 ? defaultGuestCount : 2);
  const [checkInDate, setCheckInDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  });
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'pay_at_homestay'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<StayBooking | null>(null);

  // Error validation
  const [errorMessage, setErrorMessage] = useState('');

  // Cost calculations
  const roomsCount = Math.max(1, Math.ceil(guests / 2));
  const subtotal = stay.basePricePerRoom * roomsCount * nights;
  const gstAmount = Math.round(subtotal * 0.12);
  const totalAmount = subtotal + gstAmount;

  // Impact Division (78% Local, 14% Govt, 8% App)
  const localShare = Math.round(totalAmount * 0.78);
  const govtShare = Math.round(totalAmount * 0.14);
  const appShare = totalAmount - localShare - govtShare;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    setErrorMessage('');
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const paymentMethodTitles: Record<string, string> = {
        upi: `UPI Instant (${selectedUpiApp.toUpperCase()})`,
        card: 'Credit / Debit Card',
        netbanking: 'Net Banking',
        pay_at_homestay: 'Pay Directly at Homestay',
      };

      const bookingData: StayBooking = {
        id: `BK-${Date.now().toString().slice(-6)}`,
        stayId: stay.id,
        stayName: stay.name,
        stayLocality: stay.locality,
        stayImage: stay.image,
        starRating: stay.starRating,
        guestName: fullName.trim() || 'Goa Traveler',
        guestPhone: phone.trim() || '+91 98765 43210',
        guestEmail: email.trim() || 'Traveler@goamitra.in',
        checkInDate,
        durationNights: nights,
        guestsCount: guests,
        roomsCount,
        paymentMethod,
        paymentMethodTitle: paymentMethodTitles[paymentMethod] || 'UPI Instant',
        basePricePerRoom: stay.basePricePerRoom,
        staySubtotal: subtotal,
        gstAmount,
        totalAmount,
        bookedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        localShare,
        govtShare,
        appShare,
      };

      // Save to local storage for persistence across Profile Impact Receipt
      saveStayBooking(bookingData);
      setCompletedBooking(bookingData);
      setStep('success');
      onBookingSuccess(bookingData);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-60 bg-[#FDFBF7] flex flex-col overflow-y-auto overscroll-contain text-gray-900 select-none"
    >
      {/* Sticky Full-Screen Top Header Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (step === 'payment') {
                  setStep('details');
                } else {
                  onClose();
                }
              }}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[16px] font-black text-gray-900 tracking-tight leading-none">
                  {step === 'details' && 'Homestay Booking Details'}
                  {step === 'payment' && 'Select Payment Option'}
                  {step === 'success' && 'Booking Confirmed! 🎉'}
                </h1>
              </div>
              <p className="text-[11px] font-bold text-gray-500 truncate max-w-[230px] mt-0.5">
                {stay.name} · {stay.locality}
              </p>
            </div>
          </div>

          {/* Stepper Badge or Close Button */}
          <div className="flex items-center gap-2">
            {step !== 'success' ? (
              <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                {step === 'details' ? 'Step 1 of 2' : 'Step 2 of 2'}
              </span>
            ) : (
              <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Confirmed
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Body Content */}
      <div className="max-w-xl mx-auto w-full px-4 py-5 flex-1 flex flex-col justify-start">
        {/* STEP 1: GUEST DETAILS & NIGHTS (FULL SCREEN) */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            {/* Stay Summary Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
              <img
                src={stay.image}
                alt={stay.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#065F46] text-white">
                    Verified Homestay
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">
                    {stay.starsDisplay}
                  </span>
                </div>
                <h3 className="text-[15px] font-black text-gray-900 truncate mt-1">
                  {stay.name}
                </h3>
                <p className="text-[11.5px] text-gray-600 truncate">
                  {stay.distanceToBeach} · {stay.locality}
                </p>
                <div className="text-[13px] font-black text-teal-800 mt-0.5">
                  ₹{stay.basePricePerRoom.toLocaleString('en-IN')}{' '}
                  <span className="text-[11px] font-normal text-gray-500">/ room / night</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Guest Form Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-2xs space-y-4">
              <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-wider">
                Guest Contact Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Primary Guest Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                  <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                    Watermark removed on click
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Traveler@goamitra.in"
                    className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                  <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                    Watermark removed on click
                  </span>
                </div>
              </div>
            </div>

            {/* Dates & Guests Count Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-2xs space-y-4">
              <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-wider">
                Stay Dates & Capacity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 mb-1.5">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 mb-1.5">
                    Duration (Nights)
                  </label>
                  <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 p-1">
                    <button
                      type="button"
                      onClick={() => setNights(Math.max(1, nights - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-2xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-black text-xs text-gray-900">
                      {nights} {nights === 1 ? 'Night' : 'Nights'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNights(nights + 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-2xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 mb-1.5">
                    Guests ({roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'})
                  </label>
                  <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 p-1">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-2xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-black text-xs text-gray-900">
                      {guests} Guests
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-2xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Special Host Request (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Traditional Goan breakfast and quiet ground floor room please."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:outline-hidden focus:border-teal-600 focus:bg-white resize-none"
                />
                <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">
                  Watermark removed on click
                </span>
              </div>
            </div>

            {/* Price Preview Card */}
            <div className="p-4 bg-white rounded-3xl border border-gray-200 shadow-2xs text-xs space-y-2">
              <h4 className="text-[12px] font-black text-gray-800 uppercase tracking-wider mb-1">
                Fare Breakdown
              </h4>
              <div className="flex justify-between text-gray-600">
                <span>Room Charges ({roomsCount} room × {nights} {nights === 1 ? 'night' : 'nights'}):</span>
                <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Govt Hospitality Tax / GST (12%):</span>
                <span className="font-semibold text-gray-700">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total Payable:</span>
                <span className="text-teal-800 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#047857] via-[#059669] to-[#0D9488] text-white font-extrabold text-[15px] shadow-lg hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue to Payment Options</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT OPTIONS (FULL SCREEN) */}
        {step === 'payment' && (
          <div className="space-y-4">
            {/* Amount Banner */}
            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  Total Amount Payable
                </span>
                <p className="text-[12px] text-gray-600 font-semibold mt-0.5">
                  {nights} {nights === 1 ? 'Night' : 'Nights'} · {guests} Guests · {roomsCount} Room
                </p>
              </div>
              <div className="text-right">
                <span className="text-[24px] font-black text-emerald-950 leading-none">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
                <div className="text-[10px] text-emerald-700 font-extrabold mt-0.5">
                  100% Verified Secure
                </div>
              </div>
            </div>

            {/* Payment Options Selection */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                Select Payment Method
              </label>

              {/* Option 1: UPI */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-teal-50/80 border-[#0D9488] ring-2 ring-[#0D9488]/20'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
                      UPI
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">
                        UPI Instant (Google Pay, PhonePe, Paytm, BHIM)
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Instant zero-fee booking authorization
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-4 h-4 accent-teal-700"
                  />
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-3.5 pt-3 border-t border-teal-100 flex items-center gap-2">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUpiApp(app.id as any);
                        }}
                        className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          selectedUpiApp === app.id
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Option 2: Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-teal-50/80 border-[#0D9488] ring-2 ring-[#0D9488]/20'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                      💳
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">
                        Credit or Debit Card
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Visa, Mastercard, RuPay & American Express
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-4 h-4 accent-teal-700"
                  />
                </div>
              </div>

              {/* Option 3: Net Banking */}
              <div
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-teal-50/80 border-[#0D9488] ring-2 ring-[#0D9488]/20'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                      🏦
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">
                        Net Banking
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        All major Indian scheduled banks
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="w-4 h-4 accent-teal-700"
                  />
                </div>
              </div>

              {/* Option 4: Pay at Homestay */}
              <div
                onClick={() => setPaymentMethod('pay_at_homestay')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'pay_at_homestay'
                    ? 'bg-teal-50/80 border-[#0D9488] ring-2 ring-[#0D9488]/20'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                      🤝
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">
                        Pay at Homestay upon Check-in
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Zero advance charge · UPI or Cash directly on arrival
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'pay_at_homestay'}
                    onChange={() => setPaymentMethod('pay_at_homestay')}
                    className="w-4 h-4 accent-teal-700"
                  />
                </div>
              </div>
            </div>

            {/* Back to details & Confirm Button */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="py-4 px-5 rounded-2xl bg-gray-100 text-gray-800 font-extrabold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
              >
                ← Edit Details
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="flex-1 py-4 px-5 rounded-2xl bg-gradient-to-r from-[#047857] via-[#059669] to-[#0D9488] text-white font-extrabold text-sm shadow-lg hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                    </svg>
                    <span>Securing Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking (₹{totalAmount.toLocaleString('en-IN')})</span>
                    <span>✓</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BOOKING SUCCESS & IMPACT RECEIPT (FULL SCREEN) */}
        {step === 'success' && completedBooking && (
          <div className="space-y-5 text-center py-2">
            {/* Animated Checkmark Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-4xl shadow-md border-4 border-white"
            >
              ✓
            </motion.div>

            <div>
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Booking ID: {completedBooking.id}
              </span>
              <h2 className="text-[24px] font-black text-gray-900 mt-3">
                Stay Booked Successfully!
              </h2>
              <p className="text-xs text-gray-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Host has verified and confirmed your reservation at <strong>{completedBooking.stayName}</strong> for{' '}
                <strong>{completedBooking.durationNights} nights</strong> ({completedBooking.guestsCount} guests).
              </p>
            </div>

            {/* Direct Impact Division Pie Chart & Breakdown */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 text-left shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    Transparent Division of Your Money
                  </span>
                  <h4 className="text-[16px] font-black text-gray-900">
                    Total Paid: ₹{completedBooking.totalAmount.toLocaleString('en-IN')}
                  </h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black shadow-2xs">
                  🌱 Impact Receipt
                </span>
              </div>

              {/* Visual Pie Donut Chart */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2">
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#F3F4F6"
                      strokeWidth="14"
                    />

                    {/* Slice 1: Local Community (78%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#059669"
                      strokeWidth="14"
                      strokeDasharray={`${251.3 * 0.78} 251.3`}
                      strokeDashoffset="0"
                    />

                    {/* Slice 2: Govt / Heritage (14%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#D97706"
                      strokeWidth="14"
                      strokeDasharray={`${251.3 * 0.14} 251.3`}
                      strokeDashoffset={`${-251.3 * 0.78}`}
                    />

                    {/* Slice 3: App Ops (8%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0F766E"
                      strokeWidth="14"
                      strokeDasharray={`${251.3 * 0.08} 251.3`}
                      strokeDashoffset={`${-251.3 * (0.78 + 0.14)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[15px] font-black text-emerald-800 leading-none">
                      78%
                    </span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase">
                      Local
                    </span>
                  </div>
                </div>

                {/* Legend Values */}
                <div className="flex-1 w-full space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#059669] shrink-0" />
                        <span className="font-extrabold text-gray-800">Local Host Family</span>
                      </div>
                      <span className="font-black text-emerald-800">
                        ₹{completedBooking.localShare.toLocaleString('en-IN')} (78%)
                      </span>
                    </div>
                    {/* Host Family whole + 10% in host amount for development fund */}
                    <div className="mt-2 pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-white/90 p-1.5 rounded-lg border border-emerald-100">
                        <span className="font-medium text-gray-500 block">🏡 Host Family (90%)</span>
                        <span className="font-bold text-gray-900 text-[11px]">
                          ₹{Math.round(completedBooking.localShare * 0.9).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-white/90 p-1.5 rounded-lg border border-emerald-100">
                        <span className="font-medium text-emerald-700 block">🏛️ Development Fund (10%)</span>
                        <span className="font-bold text-emerald-800 text-[11px]">
                          ₹{Math.round(completedBooking.localShare * 0.1).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#D97706] shrink-0" />
                      <span className="font-extrabold text-gray-800">Govt Heritage Cess</span>
                    </div>
                    <span className="font-black text-amber-800">
                      ₹{completedBooking.govtShare.toLocaleString('en-IN')} (14%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-teal-50/70 border border-teal-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#0F766E] shrink-0" />
                      <span className="font-extrabold text-gray-800">GoaMitra Ops</span>
                    </div>
                    <span className="font-black text-teal-800">
                      ₹{completedBooking.appShare.toLocaleString('en-IN')} (8%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {onViewImpactReceipt && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewImpactReceipt(completedBooking);
                  }}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-sm hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Open in Impact Receipt</span>
                  <span>🧾</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className={`w-full py-4 px-4 rounded-2xl font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  onViewImpactReceipt
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                }`}
              >
                <span>Done & Back to Stays</span>
                <span>✓</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
