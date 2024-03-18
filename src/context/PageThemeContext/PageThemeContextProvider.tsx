import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import useLocalStorage from 'use-local-storage';

import { PageThemeContext } from './PageThemeContext.ts';

const PageThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    'isDarkMode',
    defaultDark,
  );

  const changeIsDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, [setIsDarkMode]);

  const value = useMemo(
    () => ({ isDarkMode, setIsDarkMode: changeIsDarkMode }),
    [isDarkMode, changeIsDarkMode],
  );

  return (
    <PageThemeContext.Provider {...{ value }}>
      {children}
    </PageThemeContext.Provider>
  );
};

export default PageThemeContextProvider;
