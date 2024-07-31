import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { PageLayoutContext } from './PageLayoutContext.ts';

const PageLayoutContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileColonyPicker, setShowMobileColonyPicker] = useState(false);

  const toggleSidebar = useCallback(() => {
    setShowMobileSidebar((state) => !state);
  }, []);

  const toggleMobileColonyPicker = useCallback(() => {
    setShowMobileColonyPicker((state) => !state);
  }, []);

  const value = useMemo(
    () => ({
      showMobileSidebar,
      setShowMobileSidebar,
      toggleSidebar,
      showMobileColonyPicker,
      setShowMobileColonyPicker,
      toggleMobileColonyPicker,
    }),
    [
      showMobileColonyPicker,
      showMobileSidebar,
      toggleMobileColonyPicker,
      toggleSidebar,
    ],
  );

  return (
    <PageLayoutContext.Provider value={value}>
      {children}
    </PageLayoutContext.Provider>
  );
};

export default PageLayoutContextProvider;
