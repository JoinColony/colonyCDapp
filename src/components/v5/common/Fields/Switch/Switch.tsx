import clsx from 'clsx';
import React, { useId } from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';

import { type SwitchProps } from './types.ts';

const displayName = 'v5.common.Fields.Switch';

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      disabled: disabledProp,
      readOnly,
      className,
      greyOutWhenDisabled,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const { isDarkMode } = usePageThemeContext();
    const disabled = disabledProp || readOnly;

    return (
      <label
        htmlFor={id || generatedId}
        className={clsx('relative', {
          'pointer-events-none': disabled,
          'cursor-pointer': !disabled,
        })}
      >
        <input
          ref={ref}
          {...rest}
          type="checkbox"
          id={id || generatedId}
          className={clsx('peer sr-only', className)}
          disabled={disabled}
        />
        <div
          className={clsx(
            'h-5 w-9 rounded-full border-2',
            "after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-base-white after:shadow-sm after:transition after:content-['']",
            'peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:after:translate-x-full',
            {
              'border-gray-200 bg-gray-200': !isDarkMode,
              'border-gray-300 bg-gray-300': isDarkMode,
              'peer-checked:border-gray-900 peer-checked:bg-gray-900':
                !disabled,
              'peer-checked:border-gray-100 peer-checked:bg-gray-100':
                greyOutWhenDisabled && disabled,
            },
          )}
        />
      </label>
    );
  },
);

Switch.displayName = displayName;

export default Switch;
