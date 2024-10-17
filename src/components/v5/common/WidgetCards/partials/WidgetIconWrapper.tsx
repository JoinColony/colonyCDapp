import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { tw } from '~utils/css/index.ts';

const iconWrapperClassName = tw`flex w-full items-center justify-center gap-1`;

interface WidgetIconWrapperProps {
  Icon: Icon;
}

export const WidgetIconWrapper: FC<
  PropsWithChildren<WidgetIconWrapperProps>
> = ({ Icon, children }) => (
  <span className={clsx(iconWrapperClassName)}>
    <Icon size={18} />
    {children}
  </span>
);
