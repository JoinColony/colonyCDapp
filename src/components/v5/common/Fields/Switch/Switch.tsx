import React from 'react';
import clsx from 'clsx';
import { FieldPath, FieldValues } from 'react-hook-form';
import styles from './Switch.module.css';
import { SwitchProps } from './types';

const displayName = 'v5.common.Fields.Switch';

const Switch = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>({
  id,
  isDisabled,
  isChecked,
  onChange,
  register,
}: SwitchProps<TFieldValues, TFieldName>) => (
  <label
    htmlFor={id}
    className={clsx('relative', {
      'pointer-events-none': isDisabled,
      'cursor-pointer': !isDisabled,
    })}
  >
    <input
      type="checkbox"
      {...(id && register?.(id))}
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
