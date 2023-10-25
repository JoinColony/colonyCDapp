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
        'bg-base-white border border-gray-200 flex flex-col',
        className,
        {
          'rounded-lg': rounded === 's',
          'rounded-xl': rounded === 'm',
          'shadow-default': hasShadow,
          'px-6 py-4': withPadding,
        },
      )}
      ref={ref}
    >
      {children}
    </div>
  ),
);

export default Object.assign(Card, { displayName });
