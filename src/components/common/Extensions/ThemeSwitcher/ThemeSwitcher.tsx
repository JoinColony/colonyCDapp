import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import Icon from '~shared/Icon';
import styles from './ThemeSwitcher.module.css';
import { usePageThemeContext } from '~context/PageThemeContext';

const displayName = 'common.Extensions.ThemeSwitcher';

const ThemeSwitcher: FC = () => {
  const { isDarkMode, changeIsDarkMode } = usePageThemeContext();
  const { formatMessage } = useIntl();

  return (
    <button
      type="button"
      aria-label="Theme switcher"
      className="bg-gray-50 rounded flex items-center justify-between h-10 border border-gray-100 relative px-3 w-full"
      onClick={changeIsDarkMode}
    >
      <span
        className={clsx(styles.themeSwitcherSpan, {
          'bg-gray-800 text-base-white translate-x-full': isDarkMode,
          'bg-base-white translate-x-0': !isDarkMode,
        })}
      />
      <span className="w-1/2 flex items-center justify-center z-10">
        <Icon name="sun" appearance={{ size: 'tiny' }} />
        <p className="text-md font-medium font-inter ml-2">{formatMessage({ id: 'lightMode' })}</p>
      </span>
      <span className="w-1/2 flex items-center justify-center z-10 transition-colors transition-normal">
        <Icon name="moon-stars" appearance={{ size: 'tiny' }} />
        <p className="text-md font-medium font-inter ml-2">{formatMessage({ id: 'darkMode' })}</p>
      </span>
    </button>
  );
};

ThemeSwitcher.displayName = displayName;

export default ThemeSwitcher;
