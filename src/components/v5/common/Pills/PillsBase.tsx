import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import Icon from '~shared/Icon/index.ts';

import { type PillsProps } from './types.ts';

import styles from './PillsBase.module.css';

const displayName = 'v5.common.Pills.PillsBase';

const PillsBase: FC<PropsWithChildren<PillsProps>> = ({
  className,
  children,
  text,
  iconName,
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
    {iconName && (
      <span className="flex shrink-0">
        <Icon
          name={iconName}
          appearance={{
            size: pillSize === 'medium' ? 'tiny' : 'extraTiny',
          }}
        />
      </span>
    )}
    <span
      className={clsx(textClassName, {
        'ml-1': iconName,
      })}
    >
      {text || children}
    </span>
  </span>
);

PillsBase.displayName = displayName;

export default PillsBase;
