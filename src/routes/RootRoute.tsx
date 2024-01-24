import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  AppContextProvider,
  PageHeadingContextProvider,
  PageThemeContextProvider,
  usePageThemeContext,
} from '~context';
import { CurrencyContextProvider } from '~context/CurrencyContext';
import { Theme } from '~frame/Extensions/themes/enum';
import { applyTheme } from '~frame/Extensions/themes/utils';

const RootRouteInner = () => {
  const { isDarkMode } = usePageThemeContext();

  useEffect(() => {
    // applyTheme(isDarkMode ? Theme.dark : Theme.light);
    applyTheme(Theme.light);
  }, [isDarkMode]);

  return (
    <PageHeadingContextProvider>
      <Outlet />
    </PageHeadingContextProvider>
  );
};

const RootRoute = () => (
  <PageThemeContextProvider>
    <AppContextProvider>
      <CurrencyContextProvider>
        <RootRouteInner />
      </CurrencyContextProvider>
    </AppContextProvider>
  </PageThemeContextProvider>
);

export default RootRoute;
