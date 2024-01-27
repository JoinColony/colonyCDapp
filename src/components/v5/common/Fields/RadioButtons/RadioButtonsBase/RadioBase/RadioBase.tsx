import clsx from 'clsx';
import React, { FC } from 'react';

import { RadioProps } from './types.ts';

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
      className="peer/radio opacity-0 absolute h-0 w-0 inset-0 overflow-hidden"
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
