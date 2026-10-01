import React from 'react';
import { UserPreferences } from '../types/onboarding';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onEditPreferences: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onEditPreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-[400px] bg-[#F7F7F5] rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Modal Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#177F91] to-[#2DD4BF] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {preferences.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {preferences.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Goa Explorer · Verified Traveler
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Saved Trip Details */}
        <div className="mt-5 space-y-3">
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              INTERESTS
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {preferences.tourismTypes.map((type) => (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-lg bg-[#FFEAE5] text-[#FF6B4A] text-xs font-semibold"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                VISITING MONTH
              </span>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {preferences.travelMonth}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                PARTY SIZE
              </span>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {preferences.memberCount} {preferences.memberCount === 1 ? 'Person' : 'People'}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditPreferences();
            }}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF6B4A] to-[#FF5436] text-white shadow-sm hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Retake Questionnaire</span>
            <span>↺</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
