import React from 'react';
import clsx from 'clsx';

import RadioButtonsBase from '../RadioButtonsBase';
import { RadioItem } from '../RadioButtonsBase/types';
import { TileRadioButtonsProps } from './types';

const displayName = 'v5.common.TileRadioButtons';

function TileRadioButtons<TValue = string>({
  items,
  className,
  disabled,
  ...rest
}: TileRadioButtonsProps<TValue>): JSX.Element {
  const modifiedItems = items.map<RadioItem<TValue>>(
    ({ label, icon, ...item }) => ({
      ...item,
      // eslint-disable-next-line react/no-unstable-nested-components
      children: ({ checked }) => (
        <span
          className={clsx(
            `
              flex
              gap-2
              p-[.5625rem]
              border
              transition-all
              rounded-lg
              items-center
              justify-center
              duration-75
            `,
            {
              'text-white bg-gray-900 border-gray-900': checked && !disabled,
              'text-gray-300 border-gray-900': disabled,
              'text-gray-900 border-gray-300 md:hover:border-gray-900':
                !checked && !disabled,
            },
          )}
        >
          {icon && (
            <>
              {typeof icon === 'function' ? icon({ checked, disabled }) : icon}
            </>
          )}
          <span className="text-1">{label}</span>
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
}

TileRadioButtons.displayName = displayName;

export default TileRadioButtons;
