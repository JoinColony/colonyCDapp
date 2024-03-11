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
      <div className="w-full relative" ref={wrapperRef}>
        {buttonProps && (
          <button
            {...restButtonProps}
            ref={buttonRef}
            className={clsx(
              `
              absolute
              top-0
              bottom-0
              right-0
              h-full
              z-[1]
              text-right
              px-3.5
              py-3
              text-1
              transition-all
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
            className="absolute top-0 left-0 px-3.5 py-3 h-full flex items-center justify-center"
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
            'w-full text-md outline-0 placeholder:text-gray-400 pr-[var(--button-width)]',
            {
              'text-gray-400 pointer-events-none': disabled,
              'bg-base-white rounded border py-3 pl-3.5 border-gray-300 focus:border-blue-200 focus:shadow-light-blue':
                mode === 'primary',
              'border-none': mode === 'secondary',
              'pl-[var(--custom-prefix-width)]': customPrefix,
            },
          )}
        />
      </div>
      <div className={clsx(messageClassName, 'text-negative-400 text-sm mt-1')}>
        {message}
      </div>
    </div>
  );
};

FormattedInput.displayName = displayName;

export default FormattedInput;
