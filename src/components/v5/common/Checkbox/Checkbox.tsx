/* eslint-disable max-len */
import React, { FC, useCallback, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { CheckboxProps } from './types';
import styles from './Checkbox.module.css';
import Icon from '~shared/Icon';

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
  const { formatMessage } = useIntl();
  const labelText = typeof label === 'string' ? label : formatMessage(label);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    },
    [onChange],
  );

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
          id={id}
          checked={isChecked}
          disabled={disabled}
          className="peer absolute top-0 left-0 overflow-hidden w-0 h-0 opacity-0"
          onChange={(event) => handleChange(event)}
        />
        <span
          className={clsx(styles.checkboxBox, {
            'border-blue-400 text-base-white bg-blue-400':
              isChecked && mode === 'primary',
            'border-blue-400 text-blue-400 bg-base-white':
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
          {labelText}
        </div>
      </label>
    </div>
  );
};

Checkbox.displayName = displayName;

export default Checkbox;
