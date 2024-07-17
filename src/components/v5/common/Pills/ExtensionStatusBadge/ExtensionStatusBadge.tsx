import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import PillsBase from '../PillsBase.tsx';
import { type PillsProps } from '../types.ts';

const displayName = 'v5.common.Pills.ExtensionStatusBadge';

const ExtensionStatusBadge: FC<PropsWithChildren<PillsProps>> = ({
  mode = 'coming-soon',
  children,
  text,
  className,
  ...rest
}) => (
  <PillsBase
    className={clsx(className, {
      'bg-indigo-100 text-indigo-400': mode === 'coming-soon',
      'bg-blue-100 text-blue-400':
        mode === 'not-installed' ||
        mode === 'finalizable' ||
        mode === 'extension',
      'bg-negative-100 text-negative-400': mode === 'disabled',
      'bg-purple-100 text-purple-400': mode === 'deprecated',
      'border border-gray-200 bg-base-white text-gray-900':
        mode === 'governance' || mode === 'payments',
      'bg-success-100 text-success-400':
        mode === 'staking' ||
        mode === 'enabled' ||
        mode === 'new' ||
        mode === 'installed',
      'bg-gray-100 text-gray-500': mode === 'claimed',
    })}
    {...rest}
  >
    {text || children}
  </PillsBase>
);

ExtensionStatusBadge.displayName = displayName;

export default ExtensionStatusBadge;
