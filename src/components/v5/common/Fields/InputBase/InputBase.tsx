import clsx from 'clsx';
import React, { useId, useLayoutEffect } from 'react';

import { notMaybe } from '~utils/arrays/index.ts';

import { FieldState } from '../consts.ts';
import { useStateClassNames } from '../hooks.ts';

import { useAdjustInputWidth } from './hooks.ts';
import { type InputBaseProps } from './types.ts';

const displayName = 'v5.common.Fields.InputBase';

const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
  (
    {
      className,
      wrapperClassName,
      inputWrapperClassName,
      state,
      message,
      prefix,
      value,
      suffix,
      mode = 'primary',
      disabled,
      stateClassNames: stateClassNamesProp,
      autoWidth = false,
      label,
      id: idProp,
      maxLength,
      onBlur,
      shouldFocus,
      maxWidth,
      ...rest
    },
    ref,
  ) => {
    const defaultId = useId();
    const stateClassNames = useStateClassNames(
      {
        [FieldState.Error]:
          'border-negative-400 text-negative-400 focus:border-negative-400 placeholder:!text-negative-400',
      },
      stateClassNamesProp,
    );

    const inputRef = useAdjustInputWidth(autoWidth, ref, maxWidth);
    const id = idProp || defaultId;

    useLayoutEffect(() => {
      if (inputRef.current) {
        if (shouldFocus) {
          inputRef.current.focus();
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldFocus]);

    const input = (
      <input
        ref={inputRef}
        className={clsx(
          className,
          state ? stateClassNames[state] : undefined,
          'w-full text-md text-gray-900 outline-0 placeholder:text-gray-400 focus:outline-none',
          {
            'pointer-events-none text-gray-400': disabled,
            'rounded border border-gray-300 bg-base-white px-3.5 py-2 focus:border-blue-200 focus:shadow-light-blue':
              mode === 'primary',
            'border-none': mode === 'secondary',
          },
        )}
        id={id}
        value={value}
        onBlur={onBlur}
        maxLength={maxLength}
        {...rest}
      />
    );

    return (
      <div className={clsx(wrapperClassName, 'w-full')}>
        <label
          className="mb-1.5 text-md font-medium text-gray-700"
          htmlFor={id}
        >
          {label}
        </label>
        {prefix || suffix ? (
          <div className={clsx(inputWrapperClassName, 'w-full')}>
            {prefix}
            {input}
            {suffix}
          </div>
        ) : (
          input
        )}
        {state === FieldState.Error &&
          notMaybe(maxLength) &&
          typeof value === 'string' &&
          value.length > maxLength && (
            <div
              className={clsx('absolute right-0 flex justify-end text-4', {
                'text-negative-400': state === FieldState.Error,
                'text-gray-500': state !== FieldState.Error,
              })}
            >
              {typeof value === 'string' && value.length}/{maxLength}
            </div>
          )}
        <span
          className={clsx(
            'border-0 text-md',
            state ? stateClassNames[state] : undefined,
          )}
        >
          {message}
        </span>
      </div>
    );
  },
);

InputBase.displayName = displayName;

export default InputBase;
