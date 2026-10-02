import React from 'react';
import { useOnlineStatus } from '../utils/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xl border border-amber-400/30 backdrop-blur-md animate-bounce select-none">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse shrink-0" />
      <span>Offline Mode — Using Cached Offline Guides</span>
    </div>
  );
};
