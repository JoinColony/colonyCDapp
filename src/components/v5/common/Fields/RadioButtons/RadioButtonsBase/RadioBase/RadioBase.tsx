import clsx from 'clsx';
import React, { type FC } from 'react';

import { type RadioProps } from './types.ts';

const displayName = 'v5.common.Fields.RadioButtons.RadioBase';

const RadioBase: FC<RadioProps> = ({
  children,
  checked,
  disabled,
  id,
  value,
  wrapperClassName,
  labelClassName,
  ...rest
}) => (
  <div className={clsx(wrapperClassName, 'relative')}>
    <input
      {...rest}
      value={value}
      type="checkbox"
      id={id}
      disabled={disabled}
      checked={checked}
      className="peer/radio absolute inset-0 h-0 w-0 overflow-hidden opacity-0"
    />
    <label
      htmlFor={id}
      className={clsx(
        labelClassName,
        'cursor-pointer peer-disabled/radio:pointer-events-none',
      )}
    >
      {typeof children === 'function'
        ? children({ checked, disabled })
        : children}
    </label>
  </div>
);

RadioBase.displayName = displayName;

export default RadioBase;
