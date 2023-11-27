import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import PillsBase from '../PillsBase';
import { PillsProps } from '../types';

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
      'text-indigo-400 bg-indigo-100': mode === 'coming-soon',
      'text-blue-400 bg-blue-100':
        mode === 'not-installed' ||
        mode === 'finalizable' ||
        mode === 'extension',
      'text-negative-400 bg-red-100': mode === 'disabled',
      'text-purple-400 bg-purple-100': mode === 'deprecated',
      'text-gray-900 bg-base-white border border-gray-200':
        mode === 'governance' || mode === 'payments',
      'text-success-400 bg-success-100':
        mode === 'staking' || mode === 'enabled' || mode === 'new',
      'text-gray-500 bg-gray-100': mode === 'claimed',
    })}
    {...rest}
  >
    {text || children}
  </PillsBase>
);

ExtensionStatusBadge.displayName = displayName;

export default ExtensionStatusBadge;
