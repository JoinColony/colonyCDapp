import React, { FC } from 'react';
import clsx from 'clsx';

import { InputBaseProps } from './types';

const InputBase: FC<InputBaseProps> = ({
  className,
  hasError,
  errorMessage,
  prefix,
  suffix,
  mode,
  disabled,
  ...rest
}) => {
  return (
    <div
      className={clsx({
        'flex items-center gap-2': suffix || prefix,
      })}
    >
      {prefix && prefix}
      <input
        className={clsx(
          className,
          'w-full text-md outline-0 placeholder:text-gray-500',
          {
            'border-negative-400 text-negative-400 focus:border-negative-400':
              hasError || errorMessage,
            'text-gray-400 pointer-events-none': disabled,
            'bg-base-white rounded border py-3 px-3.5 border-gray-300 focus:border-blue-200 focus:shadow-light-blue':
              mode === 'primary',
          },
        )}
        {...rest}
      />
      {suffix && suffix}
      {errorMessage && (
        <span className="text-sm text-negative-400 block mt-1">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default InputBase;
