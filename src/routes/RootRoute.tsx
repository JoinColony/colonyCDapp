import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { AppContextProvider } from '~context/AppContext';
import { CurrencyContextProvider } from '~context/CurrencyContext';
import { PageHeadingContextProvider } from '~context/PageHeadingContext';
import {
  PageThemeContextProvider,
  usePageThemeContext,
} from '~context/PageThemeContext';
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
