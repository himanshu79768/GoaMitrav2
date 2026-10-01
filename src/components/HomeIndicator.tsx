import React from 'react';

export const HomeIndicator: React.FC = () => {
  return (
    <footer className="pt-2 pb-2.5 flex items-center justify-center select-none" aria-hidden="true">
      <div className="w-36 h-[4.5px] bg-[#111111] rounded-full opacity-90" />
    </footer>
  );
};
