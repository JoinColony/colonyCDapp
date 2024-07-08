import { createContext, useContext } from 'react';

import { noop } from '~utils/noop.ts';

export const PageThemeContext = createContext<{
  isDarkMode: boolean;
  setIsDarkMode: () => void;
}>({ isDarkMode: false, setIsDarkMode: noop });

export const usePageThemeContext = () => useContext(PageThemeContext);
