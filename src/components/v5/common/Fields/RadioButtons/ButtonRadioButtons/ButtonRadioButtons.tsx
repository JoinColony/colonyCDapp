import React, { FC } from 'react';
import clsx from 'clsx';
import Icon from '~shared/Icon';
import RadioButtonsBase from '../RadioButtonsBase';
import { ButtonRadioButtonsProps } from './types';
import { RadioItem } from '../RadioButtonsBase/types';

const displayName = 'v5.common.ButtonRadioButtons';

const ButtonRadioButtons: FC<ButtonRadioButtonsProps> = ({
  items,
  className,
  ...rest
}) => {
  const modifiedItems = items.map<RadioItem<string>>(
    ({ label, iconName, colorClassName, ...item }) => ({
      ...item,
      // eslint-disable-next-line react/no-unstable-nested-components
      children: ({ checked }) => (
        <span
          className={clsx(
            colorClassName,
            `
              flex
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
              'bg-current': checked,
            },
          )}
        >
          {iconName && (
            <Icon
              className={clsx('h-[1em] w-[1em] text-[1.125rem]', {
                'text-white': checked,
                'text-current': !checked,
              })}
              name={iconName}
            />
          )}
          <span
            className={clsx('text-3', {
              'text-gray-900': !checked,
              'text-white': checked,
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
    />
  );
};

ButtonRadioButtons.displayName = displayName;

export default ButtonRadioButtons;
