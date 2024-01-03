import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { usePageThemeContext } from '~context/PageThemeContext';
import Icon from '~shared/Icon';

import styles from './ThemeSwitcher.module.css';

const displayName = 'common.Extensions.ThemeSwitcher';

const ThemeSwitcher: FC = () => {
  const { isDarkMode, setIsDarkMode } = usePageThemeContext();
  const { formatMessage } = useIntl();

  return (
    <button
      type="button"
      aria-label={formatMessage({ id: 'ariaLabel.themeSwitcher' })}
      className="bg-gray-50 rounded flex items-center justify-between h-10 border border-gray-100 relative w-full"
      onClick={setIsDarkMode}
    >
      <span
        className={clsx(styles.themeSwitcherSpan, {
          'bg-gray-800 text-base-white translate-x-full': isDarkMode,
          'bg-base-white translate-x-0': !isDarkMode,
        })}
      />
      <span className="w-1/2 flex items-center justify-center z-[1]">
        <Icon name="sun" appearance={{ size: 'tiny' }} />
        <p className="text-1 ml-2">{formatMessage({ id: 'lightMode' })}</p>
      </span>
      <span className="w-1/2 flex items-center justify-center transition-colors transition-normal z-[1]">
        <Icon name="moon-stars" appearance={{ size: 'tiny' }} />
        <p className="text-1 ml-2">{formatMessage({ id: 'darkMode' })}</p>
      </span>
    </button>
  );
};

ThemeSwitcher.displayName = displayName;

export default ThemeSwitcher;
