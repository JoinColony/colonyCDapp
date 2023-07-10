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
      isTopContributorType,
      ...props
    },
    ref,
  ) => (
    <div
      className={clsx(
        className,
        'bg-base-white border border-gray-200 flex flex-col w-full',
        {
          'rounded-lg': rounded === 's',
          'rounded-xl': rounded === 'm',
          'shadow-default': hasShadow,
          'p-6': !isTopContributorType,
        },
      )}
      {...{ rounded, ref, ...props }}
    >
      {children}
    </div>
  ),
);

Card.displayName = displayName;

export default Card;
