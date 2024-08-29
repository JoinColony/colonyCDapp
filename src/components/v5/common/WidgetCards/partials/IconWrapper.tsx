import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { iconWrapperClassName } from '../styles.ts';

interface IconWrapperProps {
  Icon: Icon;
}

export const IconWrapper: FC<PropsWithChildren<IconWrapperProps>> = ({
  Icon,
  children,
}) => (
  <span className={clsx(iconWrapperClassName)}>
    <Icon size={18} />
    {children}
  </span>
);
