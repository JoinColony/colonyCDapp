import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  PageThemeContextProvider,
  usePageThemeContext,
} from '~context/PageThemeContext';
import { AppContextProvider } from '~context';
import { applyTheme } from '~frame/Extensions/themes/utils';
import { Theme } from '~frame/Extensions/themes/enum';
import { DialogProvider } from '~shared/Dialog';

const RootRouteInner = () => {
  const { isDarkMode } = usePageThemeContext();
  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
  }, [isDarkMode]);
  return (
    <AppContextProvider>
      <DialogProvider>
        <Outlet />
      </DialogProvider>
    </AppContextProvider>
  );
};

const RootRoute = () => (
  <PageThemeContextProvider>
    <RootRouteInner />
  </PageThemeContextProvider>
);

export default RootRoute;
