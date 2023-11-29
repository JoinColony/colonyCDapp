import React, { FC } from 'react';
import clsx from 'clsx';

import { CardProps } from './types';

const displayName = 'v5.Card';

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { hasShadow, rounded = 's', children, className, withPadding = true },
    ref,
  ) => (
    <div
      className={clsx(className, 'border', {
        'rounded-lg': rounded === 's',
        'rounded-xl': rounded === 'm',
        'shadow-default': hasShadow,
        'px-6 py-4': withPadding,
      })}
      ref={ref}
    >
      {children}
    </div>
  ),
);

(Card as FC).displayName = displayName;

export default Card;
