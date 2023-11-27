import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  AppContextProvider,
  PageHeadingContextProvider,
  PageThemeContextProvider,
  usePageThemeContext,
} from '~context';
import { applyTheme } from '~frame/Extensions/themes/utils';
import { Theme } from '~frame/Extensions/themes/enum';
import { DialogProvider } from '~shared/Dialog';

const RootRouteInner = () => {
  const { isDarkMode } = usePageThemeContext();

  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
  }, [isDarkMode]);

  return (
    <DialogProvider>
      <PageHeadingContextProvider>
        <Outlet />
      </PageHeadingContextProvider>
    </DialogProvider>
  );
};

const RootRoute = () => (
  <PageThemeContextProvider>
    <AppContextProvider>
      <RootRouteInner />
    </AppContextProvider>
  </PageThemeContextProvider>
);

export default RootRoute;
