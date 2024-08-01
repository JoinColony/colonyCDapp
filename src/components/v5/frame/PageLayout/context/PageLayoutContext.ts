import { createContext, useContext } from 'react';

import type React from 'react';

interface PageLayoutContextValue {
  showTabletSidebar: boolean;
  setShowTabletSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  showTabletColonyPicker: boolean;
  setShowTabletColonyPicker: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileColonyPicker: () => void;
}

export const PageLayoutContext = createContext<PageLayoutContextValue>({
  showTabletSidebar: false,
  setShowTabletSidebar: () => {},
  toggleSidebar: () => {},
  showTabletColonyPicker: false,
  setShowTabletColonyPicker: () => {},
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
