import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { type UserHubTab } from '~common/Extensions/UserHub/types.ts';

import { PageLayoutContext } from './PageLayoutContext.ts';

const PageLayoutContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showTabletSidebar, setShowTabletSidebar] = useState(false);
  const [showTabletColonyPicker, setShowTabletColonyPicker] = useState(false);
  const [userHubTab, setUserHubTab] = useState<UserHubTab | undefined>();

  const toggleTabletSidebar = useCallback(() => {
    setShowTabletSidebar((state) => !state);
  }, []);

  const toggleMobileColonyPicker = useCallback(() => {
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
      toggleMobileColonyPicker,
      setUserHubTab,
      userHubTab,
      clearUserHubTab,
    }),
    [
      showTabletSidebar,
      toggleTabletSidebar,
      showTabletColonyPicker,
      toggleMobileColonyPicker,
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
