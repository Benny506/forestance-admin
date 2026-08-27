import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, adminProfile, isLoading, logout } = useAuth();

  // Show a full-screen loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#111111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-outfit text-[#111111]/60 font-medium">Authenticating...</span>
        </div>
      </div>
    );
  }

  // Not logged into Supabase at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but no admin profile found in the `admins` table
  if (!adminProfile) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#111111]/10 rounded-2xl p-10 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
          <h2 className="font-heading text-3xl text-[#111111] mb-3 uppercase">Access Denied</h2>
          <p className="font-outfit text-[#111111]/60 mb-8 leading-relaxed">
            Your account is authenticated, but you do not have administrative privileges to access this dashboard.
          </p>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white font-outfit font-medium text-[16px] px-6 py-4 rounded-lg hover:bg-black/80 transition-colors"
          >
            <LogOut size={18} />
            Sign Out & Return
          </button>
        </div>
      </div>
    );
  }

  // Fully authorized admin
  return <Outlet />;
};
