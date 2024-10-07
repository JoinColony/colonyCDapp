import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { type UserHubTab } from '~common/Extensions/UserHub/types.ts';
import { useTablet } from '~hooks';
import { useResize } from '~hooks/useResize.ts';

import { PageLayoutContext } from './PageLayoutContext.ts';

const PageLayoutContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showTabletSidebar, setShowTabletSidebar] = useState(false);
  const [showTabletColonyPicker, setShowTabletColonyPicker] = useState(false);
  const [userHubTab, setUserHubTab] = useState<UserHubTab | undefined>();
  const isTablet = useTablet();

  const resetSidebars = useCallback(() => {
    if (!isTablet) {
      setShowTabletSidebar(false);
      setShowTabletColonyPicker(false);
    }
  }, [isTablet, setShowTabletSidebar, setShowTabletColonyPicker]);

  useResize(resetSidebars);

  const toggleTabletSidebar = useCallback(() => {
    setShowTabletSidebar((state) => !state);
  }, []);

  const toggleTabletColonyPicker = useCallback(() => {
    setShowTabletColonyPicker((state) => !state);
  }, []);

  const clearUserHubTab = useCallback(() => {
    setUserHubTab(undefined);
  }, [setUserHubTab]);

  const value = useMemo(
    () => ({
      showTabletSidebar,
      setShowTabletSidebar,
      toggleTabletSidebar,
      showTabletColonyPicker,
      setShowTabletColonyPicker,
      toggleTabletColonyPicker,
      setUserHubTab,
      userHubTab,
      clearUserHubTab,
    }),
    [
      showTabletSidebar,
      toggleTabletSidebar,
      showTabletColonyPicker,
      toggleTabletColonyPicker,
      userHubTab,
      clearUserHubTab,
    ],
  );

  return (
    <PageLayoutContext.Provider value={value}>
      {children}
    </PageLayoutContext.Provider>
  );
};

export default PageLayoutContextProvider;
