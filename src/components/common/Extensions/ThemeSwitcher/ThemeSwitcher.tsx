import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import Icon from '~shared/Icon';
import styles from './ThemeSwitcher.module.css';

const displayName = 'common.Extensions.ThemeSwitcher';

const ThemeSwitcher: FC = () => {
  const [isLightMode, setIsLightkMode] = useState(true);
  const { formatMessage } = useIntl();

  return (
    <button
      type="button"
      aria-label="Theme switcher"
      className="bg-gray-50 rounded flex items-center justify-between h-10 border border-gray-100 relative px-3"
      onClick={() => setIsLightkMode((prevState) => !prevState)}
    >
      <span
        className={clsx(styles.themeSwitcherSpan, {
          'bg-gray-800 text-base-white translate-x-full': !isLightMode,
          'bg-base-white translate-x-0': isLightMode,
        })}
      />
      <span className="w-1/2 flex items-center justify-center z-10">
        <Icon name="sun" appearance={{ size: 'tiny' }} />
        <p className="text-md font-medium font-inter text-gray-900 ml-1">{formatMessage({ id: 'lightMode' })}</p>
      </span>
      <span
        className={clsx('w-1/2 flex items-center justify-center z-10 transition-colors duration-300', {
          'text-base-white': !isLightMode,
          'text-gray-900': isLightMode,
        })}
      >
        <Icon name="moon-stars" appearance={{ size: 'tiny' }} />
        <p className="text-md font-medium font-inter ml-1">{formatMessage({ id: 'darkMode' })}</p>
      </span>
    </button>
  );
};

ThemeSwitcher.displayName = displayName;

export default ThemeSwitcher;
