import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Inbox, Users } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import { ConfirmModal } from '../ui/ConfirmModal';

export const Sidebar: React.FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useDashboard();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-[100vh] w-64 bg-[#111111] text-[#FDFDFD] flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center pointer-events-auto">
            <AnimatedLogo theme="dark" className="h-6 md:h-8 w-auto object-contain" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 no-scrollbar">
          <NavLink
            to="/inquiries"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-outfit font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Inbox size={20} />
            Inquiries
          </NavLink>
          <NavLink
            to="/newsletter"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-outfit font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Users size={20} />
            Newsletter
          </NavLink>
        </nav>

        {/* Footer Area */}
        <div className="p-6 border-t border-white/10 shrink-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 w-full text-white/60 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span className="font-outfit text-[15px]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Sign Out"
        message="Are you sure you want to sign out of the Admin Portal? You will need to re-authenticate to access this dashboard."
        confirmText="Sign Out"
        isDestructive={true}
      />
    </>
  );
};
