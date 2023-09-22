import React, { FC } from 'react';
import clsx from 'clsx';

import { InputBaseProps } from './types';
import { FIELD_STATE } from '../consts';

const InputBase: FC<InputBaseProps> = ({
  className,
  wrapperClassName,
  state,
  message,
  prefix,
  suffix,
  mode,
  disabled,
  ...rest
}) => {
  return (
    <div className={wrapperClassName}>
      {prefix && prefix}
      <input
        className={clsx(
          className,
          'w-full text-md outline-0 placeholder:text-gray-500',
          {
            'border-negative-400 text-negative-400 focus:border-negative-400':
              state === FIELD_STATE.Error || message,
            'text-gray-400 pointer-events-none': disabled,
            'bg-base-white rounded border py-3 px-3.5 border-gray-300 focus:border-blue-200 focus:shadow-light-blue':
              mode === 'primary',
          },
        )}
        {...rest}
      />
      {suffix && suffix}
      {message && (
        <span className="text-sm text-negative-400 block mt-1">{message}</span>
      )}
    </div>
  );
};

export default InputBase;
