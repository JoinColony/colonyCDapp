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

  const toggleSidebar = useCallback(() => {
    setShowTabletSidebar((state) => !state);
  }, []);

  const toggleMobileColonyPicker = useCallback(() => {
    setShowTabletColonyPicker((state) => !state);
  }, []);

  const value = useMemo(
    () => ({
      showTabletSidebar,
      setShowTabletSidebar,
      toggleSidebar,
      showTabletColonyPicker,
      setShowTabletColonyPicker,
      toggleMobileColonyPicker,
    }),
    [
      showTabletSidebar,
      toggleSidebar,
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
