import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import AppContextProvider from '~context/AppContext/AppContextProvider.tsx';
import CurrencyContextProvider from '~context/CurrencyContext/CurrencyContextProvider.tsx';
import FeatureFlagsContextProvider from '~context/FeatureFlagsContext/FeatureFlagsContextProvider.tsx';
import NotificationsContextProvider from '~context/NotificationsContext/NotificationsContextProvider.tsx';
import PageHeadingContextProvider from '~context/PageHeadingContext/PageHeadingContextProvider.tsx';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import PageThemeContextProvider from '~context/PageThemeContext/PageThemeContextProvider.tsx';
import { Theme } from '~frame/Extensions/themes/enum.ts';
import { applyTheme } from '~frame/Extensions/themes/utils.ts';

const RootRouteInner = () => {
  const { isDarkMode } = usePageThemeContext();

  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
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
      <FeatureFlagsContextProvider>
        <CurrencyContextProvider>
          <NotificationsContextProvider>
            <RootRouteInner />
          </NotificationsContextProvider>
        </CurrencyContextProvider>
      </FeatureFlagsContextProvider>
    </AppContextProvider>
  </PageThemeContextProvider>
);

export default RootRoute;
