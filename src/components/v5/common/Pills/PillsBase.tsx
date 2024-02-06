import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type PillsProps } from './types.ts';

import styles from './PillsBase.module.css';

const displayName = 'v5.common.Pills.PillsBase';

const PillsBase: FC<PropsWithChildren<PillsProps>> = ({
  className,
  children,
  text,
  icon: Icon,
  pillSize = 'medium',
  textClassName,
  ...rest
}) => (
  <span
    className={clsx(styles.pills, className, {
      'text-3 h-[1.625rem]': pillSize === 'medium',
      'text-4 h-[1.5rem]': pillSize === 'small',
    })}
    {...rest}
  >
    {Icon && (
      <span className="flex shrink-0">
        <Icon size={pillSize === 'medium' ? 14 : 12} />
      </span>
    )}
    <span
      className={clsx(textClassName, {
        'ml-1': !!Icon,
      })}
    >
      {text || children}
    </span>
  </span>
);

PillsBase.displayName = displayName;

export default PillsBase;
