import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { CardProps } from './types';

const Card: FC<PropsWithChildren<CardProps>> = ({ hasShadow, rounded = 's', children, ...props }) => (
  <div
    className={clsx('border border-gray-200 p-6 flex flex-col w-full', {
      'rounded-lg': rounded === 's',
      'rounded-xl': rounded === 'm',
      'shadow-default': hasShadow,
    })}
    {...{ rounded, ...props }}
  >
    {children}
  </div>
);

export default Card;
