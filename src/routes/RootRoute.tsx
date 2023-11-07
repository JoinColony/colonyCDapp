import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  AppContextProvider,
  PageHeadingContextProvider,
  PageThemeContextProvider,
  usePageThemeContext,
} from '~context';
import { useAppContext } from '~hooks';
import { applyTheme } from '~frame/Extensions/themes/utils';
import { Theme } from '~frame/Extensions/themes/enum';
import { DialogProvider } from '~shared/Dialog';
import { isBasicWallet } from '~types';
import { getLastWallet } from '~utils/autoLogin';

const RootRouteInner = () => {
  const { isDarkMode } = usePageThemeContext();
  const { wallet, connectWallet } = useAppContext();

  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
  }, [isDarkMode]);

  useEffect(() => {
    if (
      (!wallet || isBasicWallet(wallet)) &&
      connectWallet &&
      getLastWallet()
    ) {
      connectWallet();
    }
  }, [connectWallet, wallet]);

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
