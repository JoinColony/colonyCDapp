import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type PillsProps } from './types.ts';

const displayName = 'v5.common.Pills.PillsBase';

const PillsBase: FC<PropsWithChildren<PillsProps>> = ({
  className,
  children,
  text,
  icon: Icon,
  iconClassName,
  pillSize = 'medium',
  isCapitalized = true,
  textClassName,
  ...rest
}) => (
  <span
    className={clsx(
      'inline-flex shrink-0 items-center rounded-3xl px-3 py-1 text-center',
      className,
      {
        capitalize: isCapitalized,
        'h-[1.625rem] text-3': pillSize === 'medium',
        'h-[1.5rem] text-4': pillSize === 'small',
      },
    )}
    {...rest}
  >
    {Icon && (
      <span className="flex shrink-0">
        <Icon
          size={pillSize === 'medium' ? 14 : 12}
          className={iconClassName}
        />
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
