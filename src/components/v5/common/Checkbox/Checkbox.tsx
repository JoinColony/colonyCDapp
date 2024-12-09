import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren, useId } from 'react';

import { formatText } from '~utils/intl.ts';

import { type CheckboxProps } from './types.ts';

const displayName = 'v5.common.Checkbox';

const Checkbox: FC<PropsWithChildren<CheckboxProps>> = ({
  name = '',
  disabled,
  id,
  register,
  label = '',
  onChange,
  className,
  isChecked,
  children,
}) => {
  const generatedId = useId();

  return (
    <div
      className={clsx(className, {
        'pointer-events-none opacity-50': disabled,
      })}
    >
      <label
        htmlFor={id}
        className="relative flex w-full cursor-pointer text-md text-gray-700"
      >
        <input
          type="checkbox"
          {...register?.(name)}
          name={name}
          id={id || generatedId}
          checked={isChecked}
          disabled={disabled}
          className="peer absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
          onChange={onChange}
        />
        <span
          className={clsx(
            'relative mr-2 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-normal',
            {
              'border-blue-400 bg-base-white text-blue-400': isChecked,
              'border-gray-200 bg-base-white': !isChecked,
            },
          )}
        >
          {isChecked && (
            <span className="absolute">
              <Check className="text-blue-400" size={10} />
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
