import clsx from 'clsx';
import React from 'react';

import RadioButtonsBase from '../RadioButtonsBase/index.ts';
import { type RadioItem } from '../RadioButtonsBase/types.ts';

import { type ButtonRadioButtonsProps } from './types.ts';

const displayName = 'v5.common.ButtonRadioButtons';

function ButtonRadioButtons<TValue = string>({
  items,
  className: baseClassName,
  disabled,
  ...rest
}: ButtonRadioButtonsProps<TValue>): JSX.Element {
  const modifiedItems = items.map<RadioItem<TValue>>(
    ({ label, icon: Icon, className, disabled: disabledButton, ...item }) => {
      return {
        ...item,
        disabled: disabledButton,
        // eslint-disable-next-line react/no-unstable-nested-components
        children: ({ checked }) => (
          <span
            className={clsx(
              typeof className === 'string'
                ? className
                : className(checked, disabledButton),
              `
                flex
                group/wrapper
                items-center
                justify-center
                gap-1.5
                border
                border-current
                transition
                py-2
                px-3
                w-full
                min-h-[2.5rem]
                rounded-lg
              `,
            )}
          >
            {Icon && <Icon size={18} className="icon" />}
            <span className="text-3">{label}</span>
          </span>
        ),
      };
    },
  );

  return (
    <RadioButtonsBase
      {...rest}
      className={clsx(baseClassName, 'flex w-full gap-2 [&>li]:flex-1')}
      items={modifiedItems}
      disabled={disabled}
    />
  );
}

ButtonRadioButtons.displayName = displayName;

export default ButtonRadioButtons;
