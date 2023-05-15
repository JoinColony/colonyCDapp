import React, { useState } from 'react';
import clsx from 'clsx';
import Icon from '~shared/Icon';
import styles from './ThemeSwitcher.module.css';
import { formatMessage } from '~utils/yup/tests/helpers';

const ThemeSwitcher = () => {
  const [isLightMode, setIsLightkMode] = useState<boolean>(true);

  return (
    <button
      type="button"
      className="bg-gray-50 rounded flex items-center justify-between gap-2 h-10 border border-gray-100 relative"
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
        <p className="text-md font-medium font-inter text-gray-900 ml-1">{formatMessage({ id: 'Light' })}</p>
      </span>
      <span
        className={clsx('w-1/2 flex items-center justify-center z-10 transition-colors duration-300', {
          'text-base-white': !isLightMode,
          'text-gray-900': isLightMode,
        })}
      >
        <Icon name="moon-stars" appearance={{ size: 'tiny' }} />
        <p className="text-md font-medium font-inter ml-1">{formatMessage({ id: 'Dark' })}</p>
      </span>
    </button>
  );
};

export default ThemeSwitcher;
