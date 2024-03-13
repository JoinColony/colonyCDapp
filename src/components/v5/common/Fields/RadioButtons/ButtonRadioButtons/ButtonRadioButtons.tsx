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
                group/wrapper
                flex
                min-h-[2.5rem]
                w-full
                items-center
                justify-center
                gap-1.5
                rounded-lg
                border
                border-current
                px-3
                py-2
                transition
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
