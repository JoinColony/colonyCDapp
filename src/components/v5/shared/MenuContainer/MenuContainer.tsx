import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type MenuContainerProps } from './types.ts';

const displayName = 'v5.shared.MenuContainer';

const MenuContainer = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<MenuContainerProps>
>(
  (
    {
      hasShadow,
      rounded = 's',
      children,
      className,
      withPadding = true,
      checked = false,
      testId,
    },
    ref,
  ) => (
    <div
      data-testid={testId}
      className={clsx(
        className,
        'flex flex-col border bg-base-white',
        checked ? 'border-blue-400' : 'border-gray-200',
        {
          'rounded-lg': rounded === 's',
          'rounded-xl': rounded === 'm',
          'shadow-default': hasShadow,
          'p-6': withPadding,
        },
      )}
      ref={ref}
    >
      {children}
    </div>
  ),
);

(MenuContainer as FC).displayName = displayName;

export default MenuContainer;
