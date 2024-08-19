import { MoonStars } from '@phosphor-icons/react';
import { Sun } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'common.Extensions.ThemeSwitcher';

const MSG = defineMessages({
  lightMode: {
    id: 'lightMode',
    defaultMessage: 'Light',
  },
  darkMode: {
    id: 'darkMode',
    defaultMessage: 'Dark',
  },
});

const ThemeSwitcher: FC = () => {
  const { isDarkMode, setIsDarkMode } = usePageThemeContext();

  return (
    <button
      type="button"
      className="relative flex h-10 w-full items-center justify-between rounded border border-gray-100 bg-gray-50"
      onClick={setIsDarkMode}
    >
      <span
        className={clsx(
          'absolute left-[0.375rem] right-auto z-0 flex h-[1.75rem] w-[calc(50%-0.5rem)] items-center justify-center rounded shadow-content transition-all duration-normal',
          {
            '!right-[0.375rem] left-auto bg-base-white text-gray-900':
              isDarkMode,
            'translate-x-0 bg-base-white': !isDarkMode,
          },
        )}
      />
      <span
        className={clsx('z-[1] flex w-1/2 items-center justify-center', {
          'text-gray-700': isDarkMode,
        })}
      >
        <Sun size={16} />
        <p className="ml-2 text-1">{formatText(MSG.lightMode)}</p>
      </span>
      <span className="transition-normal z-[1] flex w-1/2 items-center justify-center transition-colors">
        <MoonStars size={16} />
        <p className="ml-2 text-1">{formatText(MSG.darkMode)}</p>
      </span>
    </button>
  );
};

ThemeSwitcher.displayName = displayName;

export default ThemeSwitcher;
