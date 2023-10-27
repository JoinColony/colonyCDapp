import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { usePageThemeContext } from '~context/PageThemeContext';
import { AppContextProvider } from '~context';
import { applyTheme } from '~frame/Extensions/themes/utils';
import { Theme } from '~frame/Extensions/themes/enum';

const RootRoute = () => {
  const { isDarkMode } = usePageThemeContext();
  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
  }, [isDarkMode]);
  return (
    <AppContextProvider>
      <Outlet />
    </AppContextProvider>
  );
};

export default RootRoute;
