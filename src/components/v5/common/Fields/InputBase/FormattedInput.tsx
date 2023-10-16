import React, { FC, useEffect, useRef, useState } from 'react';
import Cleave from 'cleave.js/react';
import { ReactInstanceWithCleave } from 'cleave.js/react/props';
import clsx from 'clsx';
import { FormattedInputProps } from './types';
import { useStateClassNames } from '../hooks';
import { FIELD_STATE } from '../consts';

const displayName = 'FormattedInput';

const FormattedInput: FC<FormattedInputProps> = ({
  options,
  onChange,
  disabled,
  value,
  className,
  state,
  mode = 'primary',
  stateClassNames: stateClassNamesProp,
  buttonProps,
  wrapperClassName,
  message,
  ...rest
}) => {
  const [cleave, setCleave] = useState<ReactInstanceWithCleave | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Sync the cleave raw value with hook-form value
   * This is necessary for correctly setting the initial value
   */
  useEffect(() => {
    if (typeof value !== 'string') {
      return;
    }

    cleave?.setRawValue(`${options.prefix || ''}${value}`);
  }, [cleave, options.prefix, value]);

  useEffect(() => {
    if (buttonRef.current && wrapperRef.current) {
      const { width } = buttonRef.current.getBoundingClientRect();

      wrapperRef.current.style.setProperty('--button-width', `${width}px`);
    }
  }, []);

  const stateClassNames = useStateClassNames(
    {
      [FIELD_STATE.Error]:
        'border-negative-400 text-negative-400 focus:border-negative-400',
    },
    stateClassNamesProp,
  );

  // /*
  //  * @NOTE Coerce cleave into handling dynamically changing options
  //  * See here for why this isn't yet supported "officially":
  //  * https://github.com/nosir/cleave.js/issues/352#issuecomment-447640572
  //  */

  const dynamicCleaveOptionKey = JSON.stringify(options);
  const { label: buttonLabel, ...restButtonProps } = buttonProps || {};

  return (
    <div className={clsx(wrapperClassName, 'relative w-full')} ref={wrapperRef}>
      {buttonProps && (
        <button
          {...restButtonProps}
          ref={buttonRef}
          className={`
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
            text-blue-400
            transition-all
            md:hover:opacity-80
          `}
          type="button"
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      )}
      <Cleave
        {...rest}
        disabled={disabled}
        key={dynamicCleaveOptionKey}
        /*
         * @NOTE: If formattingOptions is not either memoized or defined outside of the ancestor Input component,
         * it will cause Cleave to be re-mounted and thus lose its state and focus.
         */
        options={options}
        onInit={(cleaveInstance) => setCleave(cleaveInstance)}
        onChange={onChange}
        className={clsx(
          className,
          state ? stateClassNames[state] : undefined,
          'w-full text-md outline-0 placeholder:text-gray-500 pr-[var(--button-width)]',
          {
            'text-gray-400 pointer-events-none': disabled,
            'bg-base-white rounded border py-3 pl-3.5 border-gray-300 focus:border-blue-200 focus:shadow-light-blue':
              mode === 'primary',
            'border-none': mode === 'secondary',
          },
        )}
      />
      {message}
    </div>
  );
};

FormattedInput.displayName = displayName;

export default FormattedInput;
