import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { AppContextProvider } from '~context/AppContext.tsx';
import { CurrencyContextProvider } from '~context/CurrencyContext.tsx';
import { PageHeadingContextProvider } from '~context/PageHeadingContext/index.ts';
import {
  PageThemeContextProvider,
  usePageThemeContext,
} from '~context/PageThemeContext.tsx';
import { Theme } from '~frame/Extensions/themes/enum.ts';
import { applyTheme } from '~frame/Extensions/themes/utils.ts';

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
