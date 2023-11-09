import React from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';

import RadioButtonsBase from '../RadioButtonsBase';
import { RadioItem } from '../RadioButtonsBase/types';
import { ButtonRadioButtonsProps } from './types';

const displayName = 'v5.common.ButtonRadioButtons';

function ButtonRadioButtons<TValue = string>({
  items,
  className,
  disabled,
  ...rest
}: ButtonRadioButtonsProps<TValue>): JSX.Element {
  const modifiedItems = items.map<RadioItem<TValue>>(
    ({
      label,
      iconName,
      colorClassName,
      checkedColorClassName,
      hoverColorClassName,
      iconClassName,
      ...item
    }) => ({
      ...item,
      // eslint-disable-next-line react/no-unstable-nested-components
      children: ({ checked }) => (
        <span
          className={clsx(
            colorClassName,
            hoverColorClassName,
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
            {
              [checkedColorClassName]: checked && !disabled,
              [colorClassName]: !disabled,
              'text-gray-300': disabled,
            },
          )}
        >
          {iconName && (
            <Icon
              className={clsx(
                iconClassName,
                'h-[1em] w-[1em] text-[1.125rem]',
                {
                  'text-white': checked,
                  'text-current': !checked,
                },
              )}
              name={iconName}
            />
          )}
          <span
            className={clsx('text-3', {
              'text-gray-900 md:group-hover/wrapper:text-current':
                !checked && !disabled,
              'text-gray-300': disabled,
              'text-white': checked && !disabled,
            })}
          >
            {label}
          </span>
        </span>
      ),
    }),
  );

  return (
    <RadioButtonsBase
      {...rest}
      className={clsx(className, 'flex w-full gap-2 [&>li]:flex-1')}
      items={modifiedItems}
      disabled={disabled}
    />
  );
}

ButtonRadioButtons.displayName = displayName;

export default ButtonRadioButtons;
