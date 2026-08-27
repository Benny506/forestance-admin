import React from 'react';
import { Menu } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const TopBar: React.FC = () => {
  const { setIsMobileMenuOpen, headerTitle, headerDescription } = useDashboard();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FDFDFD]/90 backdrop-blur-md border-b border-[#111111]/10 px-6 lg:px-10 py-5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-2 text-[#111111]/70 hover:text-[#111111] transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="font-heading text-2xl md:text-3xl text-[#111111] uppercase">
            {headerTitle}
          </h1>
          {headerDescription && (
            <p className="hidden md:block font-outfit text-sm text-[#111111]/60 mt-0.5">
              {headerDescription}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};
