import React from 'react';
import clsx from 'clsx';

import { CardProps } from './types';

const displayName = 'v5.Card';

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { hasShadow, rounded = 's', children, className, withPadding = true },
    ref,
  ) => (
    <div
      className={clsx(
        className,
        'bg-base-white border border-gray-200 flex flex-col',
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

Card.displayName = displayName;

export default Card;
