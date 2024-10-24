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
  iconSize,
  pillSize = 'medium',
  isCapitalized = true,
  textClassName,
}) => {
  const content = text || children;

  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center rounded-3xl px-[9px] py-1.5 text-center',
        className,
        {
          capitalize: isCapitalized,
          'h-[1.625rem] text-3': pillSize === 'medium',
          'h-[1.5rem] text-4': pillSize === 'small',
        },
      )}
    >
      {Icon && (
        <span className="flex shrink-0">
          <Icon
            size={iconSize || (pillSize === 'medium' ? 14 : 12)}
            className={iconClassName}
          />
        </span>
      )}
      {content && (
        <span
          className={clsx(textClassName, {
            'ml-1': !!Icon,
          })}
        >
          {content}
        </span>
      )}
    </span>
  );
};

PillsBase.displayName = displayName;

export default PillsBase;
