import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { PageLayoutContext } from './PageLayoutContext.ts';

const PageLayoutContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showTabletSidebar, setShowTabletSidebar] = useState(false);
  const [showTabletColonyPicker, setShowTabletColonyPicker] = useState(false);

  const toggleTabletSidebar = useCallback(() => {
    setShowTabletSidebar((state) => !state);
  }, []);

  const toggleMobileColonyPicker = useCallback(() => {
    setShowTabletColonyPicker((state) => !state);
  }, []);

  const value = useMemo(
    () => ({
      showTabletSidebar,
      setShowTabletSidebar,
      toggleTabletSidebar,
      showTabletColonyPicker,
      setShowTabletColonyPicker,
      toggleMobileColonyPicker,
    }),
    [
      showTabletSidebar,
      toggleTabletSidebar,
      showTabletColonyPicker,
      toggleMobileColonyPicker,
    ],
  );

  return (
    <PageLayoutContext.Provider value={value}>
      {children}
    </PageLayoutContext.Provider>
  );
};

export default PageLayoutContextProvider;
