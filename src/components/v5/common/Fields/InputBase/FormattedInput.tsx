import clsx from 'clsx';
import React, { type FC } from 'react';

import { FieldState } from '../consts.ts';
import { useStateClassNames } from '../hooks.ts';

import { useFormattedInput } from './hooks.ts';
import { type FormattedInputProps } from './types.ts';

const displayName = 'v5.common.Fields.FormattedInput';

const FormattedInput: FC<FormattedInputProps> = ({
  onChange,
  disabled,
  placeholder,
  className,
  state,
  mode = 'primary',
  stateClassNames: stateClassNamesProp,
  buttonProps,
  customPrefix,
  wrapperClassName,
  messageClassName,
  message,
  ...rest
}) => {
  const { buttonRef, wrapperRef, customPrefixRef } = useFormattedInput();

  const stateClassNames = useStateClassNames(
    {
      [FieldState.Error]:
        'border-negative-400 text-negative-400 focus:border-negative-400',
    },
    stateClassNamesProp,
  );

  const { label: buttonLabel, ...restButtonProps } = buttonProps || {};

  return (
    <div className={clsx(wrapperClassName, 'w-full')}>
      <div className="relative w-full" ref={wrapperRef}>
        {buttonProps && (
          <button
            {...restButtonProps}
            ref={buttonRef}
            className={clsx(
              `
              absolute
              bottom-0
              right-0
              top-0
              z-base
              h-full
              px-3.5
              py-3
              text-right
              transition-all
              text-1
              md:hover:opacity-80
            `,
              {
                'text-negative-400': state === FieldState.Error,
                'text-blue-400': state !== FieldState.Error,
              },
            )}
            type="button"
            disabled={disabled}
          >
            {buttonLabel}
          </button>
        )}
        {customPrefix && (
          <div
            className="absolute left-0 top-0 flex h-full items-center justify-center px-3.5 py-3"
            ref={customPrefixRef}
          >
            {customPrefix}
          </div>
        )}
        <input
          {...rest}
          disabled={disabled}
          placeholder={placeholder || ''}
          onChange={onChange}
          className={clsx(
            className,
            state ? stateClassNames[state] : undefined,
            'w-full pr-[var(--button-width)] text-md outline-0 placeholder:text-gray-400 focus:outline-none',
            {
              'pointer-events-none text-gray-400': disabled,
              'rounded border border-gray-300 bg-base-white py-3 pl-3.5 focus:border-blue-200':
                mode === 'primary',
              'border-none': mode === 'secondary',
              'pl-[var(--custom-prefix-width)]': customPrefix,
            },
          )}
        />
      </div>
      <div className={clsx(messageClassName, 'mt-1 text-sm text-negative-400')}>
        {message}
      </div>
    </div>
  );
};

FormattedInput.displayName = displayName;

export default FormattedInput;
