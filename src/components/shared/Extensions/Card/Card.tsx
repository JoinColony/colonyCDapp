import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { CardProps } from './types';

const Card: FC<PropsWithChildren<CardProps>> = ({ withShadow, rounded = 's', children, ...props }) => (
  <div
    className={clsx('border border-gray-200 p-6', {
      'rounded-lg': rounded === 's',
      'rounded-xl': rounded === 'm',
      'shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.05)]': withShadow,
    })}
    {...{ withShadow, rounded, ...props }}
  >
    {children}
  </div>
);

export default Card;
