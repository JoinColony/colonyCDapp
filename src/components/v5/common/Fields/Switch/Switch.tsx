import React, { FC } from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';
import { SwitchProps } from './types';

const displayName = 'v5.common.Fields.Switch';

const Switch: FC<SwitchProps> = ({
  id = 'switch-id',
  isDisabled,
  isChecked,
  onChange,
  register,
}) => (
  <label
    htmlFor={id}
    className={clsx('relative', {
      'pointer-events-none': isDisabled,
      'cursor-pointer': !isDisabled,
    })}
  >
    <input
      type="checkbox"
      {...register?.(id)}
      id={id}
      className="sr-only"
      disabled={isDisabled}
      checked={isChecked}
      onChange={onChange}
    />
    <div
      className={clsx(
        styles.toggle,
        'bg-gray-200 border-2 border-gray-200 h-5 w-9 rounded-full',
      )}
    />
  </label>
);

Switch.displayName = displayName;

export default Switch;
