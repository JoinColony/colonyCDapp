import React from 'react';
import clsx from 'clsx';

import { CardProps } from './types';

const displayName = 'v5.Card';

const Card = ({
  hasShadow,
  rounded = 's',
  children,
  className,
  withPadding = true,
}: CardProps) => (
  <div
    className={clsx(className, 'border', {
      'rounded-lg': rounded === 's',
      'rounded-xl': rounded === 'm',
      'shadow-default': hasShadow,
      'px-6 py-4': withPadding,
    })}
  >
    {children}
  </div>
);

Card.displayName = displayName;

export default Card;
