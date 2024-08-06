import { createContext, useContext } from 'react';

import { UserHubTab } from '~common/Extensions/UserHub/types.ts';

import type React from 'react';

interface PageLayoutContextValue {
  showTabletSidebar: boolean;
  setShowTabletSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTabletSidebar: () => void;
  showTabletColonyPicker: boolean;
  setShowTabletColonyPicker: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileColonyPicker: () => void;
  setUserHubTab: React.Dispatch<React.SetStateAction<UserHubTab | undefined>>;
  userHubTab: UserHubTab | undefined;
  clearUserHubTab: () => void;
}

export const PageLayoutContext = createContext<PageLayoutContextValue>({
  showTabletSidebar: false,
  setShowTabletSidebar: () => {},
  toggleTabletSidebar: () => {},
  showTabletColonyPicker: false,
  setShowTabletColonyPicker: () => {},
  toggleMobileColonyPicker: () => {},
  setUserHubTab: () => {},
  userHubTab: UserHubTab.Balance,
  clearUserHubTab: () => {},
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
