import clsx from 'clsx';
import React, { type FC } from 'react';

import { type RadioButtonProps } from './types.ts';

const RadioButton: FC<RadioButtonProps> = ({
  id,
  value,
  disabled,
  children,
  hasError,
  ...rest
}) => (
  <div className="relative block">
    <input
      {...rest}
      value={value}
      type="radio"
      id={id}
      disabled={disabled}
      className="peer/radio absolute inset-0 h-0 w-0 overflow-hidden opacity-0"
    />
    <div className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-gray-300 after:absolute after:left-1/2 after:top-1/2 after:hidden after:h-[0.4375rem] after:w-[0.4375rem] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-blue-400 peer-checked/radio:border-blue-400 peer-checked/radio:after:block" />
    <label
      htmlFor={id}
      className={clsx(
        'block cursor-pointer rounded-md border border-gray-300 py-3 pl-12 pr-6 text-md peer-checked/radio:border-blue-400 peer-disabled/radio:pointer-events-none',
        {
          'border-negative-400': hasError,
        },
      )}
    >
      {children}
    </label>
  </div>
);

export default RadioButton;
