'use client';

import React, { useEffect, useState } from 'react';

type Theme =
  | 'dark'
  | 'secondaryDark'
  | 'success'
  | 'danger'
  | 'warning'
  | 'navyBlue';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeColor');
    if (
      savedTheme &&
      (savedTheme === 'dark' ||
        savedTheme === 'secondaryDark' ||
        savedTheme === 'success' ||
        savedTheme === 'danger' ||
        savedTheme === 'warning' ||
        savedTheme === 'navyBlue')
    ) {
      setTheme(savedTheme);
      document.body.classList.add(`${savedTheme}`);
      document.body.classList.add(`bg-background`);
    }
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;
