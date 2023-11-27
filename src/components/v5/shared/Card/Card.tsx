import React from 'react';
import clsx from 'clsx';

import { CardProps } from './types';

const displayName = 'v5.Card';

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hasShadow,
      rounded = 's',
      children,
      className,
      withPadding = true,
      checked = false,
    },
    ref,
  ) => (
    <div
      className={clsx(
        className,
        'bg-base-white border flex flex-col',
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

export default Object.assign(Card, { displayName });
