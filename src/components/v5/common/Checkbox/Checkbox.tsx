/* eslint-disable max-len */
import React, { FC, PropsWithChildren, useId } from 'react';
import clsx from 'clsx';

import { CheckboxProps } from './types';
import styles from './Checkbox.module.css';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.Checkbox';

const Checkbox: FC<PropsWithChildren<CheckboxProps>> = ({
  name = '',
  disabled,
  id,
  register,
  label = '',
  onChange,
  classNames,
  isChecked,
  children,
  mode = 'primary',
}) => {
  const generatedId = useId();

  return (
    <div
      className={clsx(classNames, {
        'pointer-events-none opacity-50': disabled,
      })}
    >
      <label
        htmlFor={id}
        className="flex relative w-full text-gray-700 text-md cursor-pointer"
      >
        <input
          type="checkbox"
          {...register?.(name)}
          name={name}
          id={id || generatedId}
          checked={isChecked}
          disabled={disabled}
          className="peer absolute top-0 left-0 overflow-hidden w-0 h-0 opacity-0"
          onChange={onChange}
        />
        <span
          className={clsx(styles.checkboxBox, {
            'border-gray-900 text-base-white bg-gray-900':
              isChecked && mode === 'primary',
            'border-gray-900 text-gray-900 bg-base-white':
              isChecked && mode === 'secondary',
            'border-gray-200 bg-base-white': !isChecked,
          })}
        >
          {isChecked && (
            <span className="absolute">
              <Icon name="check" appearance={{ size: 'extraExtraTiny' }} />
            </span>
          )}
        </span>

        <div className="flex items-center gap-2">
          {children}
          {label && formatText(label)}
        </div>
      </label>
    </div>
  );
};

Checkbox.displayName = displayName;

export default Checkbox;
