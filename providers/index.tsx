'use client';

import React from 'react';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}