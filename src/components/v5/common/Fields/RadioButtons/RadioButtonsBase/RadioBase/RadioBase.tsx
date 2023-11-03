import React, { FC } from 'react';
import clsx from 'clsx';
import { RadioProps } from './types';

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
      type="radio"
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
