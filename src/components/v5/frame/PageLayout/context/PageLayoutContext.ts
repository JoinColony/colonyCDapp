import { createContext, useContext } from 'react';

import type React from 'react';

interface PageLayoutContextValue {
  showMobileSidebar: boolean;
  setShowMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  showMobileColonyPicker: boolean;
  setShowMobileColonyPicker: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileColonyPicker: () => void;
}

export const PageLayoutContext = createContext<PageLayoutContextValue>({
  showMobileSidebar: false,
  setShowMobileSidebar: () => {},
  toggleSidebar: () => {},
  showMobileColonyPicker: false,
  setShowMobileColonyPicker: () => {},
  toggleMobileColonyPicker: () => {},
});

export const usePageLayoutContext = () => {
  const context = useContext(PageLayoutContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "PageLayoutContext" provider',
    );
  }

  return context;
};
