import React, { createContext, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This provider is now a no-op that just renders children,
// ensuring the app remains in dark mode permanently.
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Set the dark class on initial load, then do nothing.
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return <>{children}</>;
};

// The useTheme hook now returns a static 'dark' theme.
export const useTheme = (): ThemeContextType => {
  return {
    theme: 'dark',
    toggleTheme: () => {}, // The toggle function does nothing.
  };
};