import React, { FC } from 'react';

import clsx from 'clsx';
import styles from './Switch.module.css';
import { SwitchProps } from './types';

const displayName = 'v5.common.Fields.Switch';

const Switch: FC<SwitchProps> = ({ id = 'switch-id', isDisabled }) => (
  <label
    htmlFor={id}
    className={clsx('relative', {
      'cursor-not-allowed': isDisabled,
      'cursor-pointer': !isDisabled,
    })}
  >
    <input type="checkbox" id={id} className="sr-only" disabled={isDisabled} />
    <div
      className={`${styles.toggle} bg-gray-200 border-2 border-gray-200 h-5 w-9 rounded-full`}
    />
  </label>
);

Switch.displayName = displayName;

export default Switch;
