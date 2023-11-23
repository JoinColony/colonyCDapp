import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { PillsProps } from './types';
import styles from './PillsBase.module.css';
import Icon from '~shared/Icon';

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
    className={clsx(className, styles.pills, {
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
        'ml-2': iconName && pillSize !== 'small',
        'ml-1': iconName && pillSize === 'small',
      })}
    >
      {text || children}
    </span>
  </span>
);

PillsBase.displayName = displayName;

export default PillsBase;
