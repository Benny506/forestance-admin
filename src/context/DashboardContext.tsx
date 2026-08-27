import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface DashboardContextProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerTitle: string;
  setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
  headerDescription: string;
  setHeaderDescription: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('Dashboard');
  const [headerDescription, setHeaderDescription] = useState('');

  return (
    <DashboardContext.Provider
      value={{
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        headerTitle,
        setHeaderTitle,
        headerDescription,
        setHeaderDescription,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Hook to easily set the header title and description per screen
// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardHeader = (title: string, description: string = '') => {
  const { setHeaderTitle, setHeaderDescription } = useDashboard();

  useEffect(() => {
    setHeaderTitle(title);
    setHeaderDescription(description);
  }, [title, description, setHeaderTitle, setHeaderDescription]);
};
