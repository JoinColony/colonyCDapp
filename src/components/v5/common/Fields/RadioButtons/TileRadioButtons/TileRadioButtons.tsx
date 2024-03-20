import clsx from 'clsx';
import React from 'react';

import RadioButtonsBase from '../RadioButtonsBase/index.ts';
import { type RadioItem } from '../RadioButtonsBase/types.ts';

import { type TileRadioButtonsProps } from './types.ts';

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
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              p-[.5625rem]
              transition-all
              duration-75
            `,
            {
              'border-gray-900 bg-gray-900 text-base-white':
                checked && !disabled,
              'border-gray-900 text-gray-300': disabled,
              'border-gray-300 text-gray-900 md:hover:border-gray-900':
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
