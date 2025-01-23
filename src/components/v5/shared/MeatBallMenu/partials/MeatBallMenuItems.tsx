import clsx from 'clsx';
import React, { type FC } from 'react';

import HoverWidthWrapper from '~v5/shared/HoverWidthWrapper/HoverWidthWrapper.tsx';

import { type MeatBallMenuItemsProps } from '../types.ts';

export const MeatBallMenuItems: FC<MeatBallMenuItemsProps> = ({
  items,
  renderItemWrapper,
  onClose,
}) => {
  return (
    <ul>
      {items.map(
        ({
          key,
          label,
          onClick,
          icon: Icon,
          renderItemWrapper: itemRenderItemWrapper,
          className: itemClassName,
        }) => (
          <li key={key} className={clsx(itemClassName, 'flex-shrink-0')}>
            <HoverWidthWrapper hoverClassName="w-full md:font-medium">
              {(itemRenderItemWrapper || renderItemWrapper)(
                {
                  className: `
                            flex
                            items-center
                            text-md
                            transition-colors
                            duration-normal
                            text-gray-900
                            md:hover:bg-gray-50
                            md:hover:font-medium
                            rounded
                            py-2
                            px-4
                            gap-2
                            flex-grow
                            -mx-4
                          `,
                  onClick: () => {
                    if (onClick?.() === false) {
                      return;
                    }

                    onClose();
                  },
                },
                <>
                  {Icon ? <Icon size={16} /> : null}
                  <span className="whitespace-nowrap">{label}</span>
                </>,
              )}
            </HoverWidthWrapper>
          </li>
        ),
      )}
    </ul>
  );
};
