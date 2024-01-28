import React, {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import useLocalStorage from 'use-local-storage';

import noop from '~utils/noop.ts';

export const PageThemeContext = createContext<{
  isDarkMode: boolean;
  setIsDarkMode: () => void;
}>({ isDarkMode: false, setIsDarkMode: noop });

export const PageThemeContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
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

export const usePageThemeContext = () => useContext(PageThemeContext);
