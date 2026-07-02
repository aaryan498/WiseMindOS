import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(location.pathname);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);

  const toggleNav = () => {
    setIsNavOpen(prev => !prev);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, isNavOpen, toggleNav, setIsNavOpen }}>
      {children}
    </NavigationContext.Provider>
  );
};
