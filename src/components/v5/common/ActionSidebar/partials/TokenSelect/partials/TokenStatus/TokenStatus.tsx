import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type TokenStatusProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.TokenSelect.partials.TokenStatus';

const TokenStatus: FC<PropsWithChildren<TokenStatusProps>> = ({
  status,
  children,
}) => (
  <div
    className={clsx('flex items-center gap-2 text-md', {
      'text-success-400': status === 'success',
      'text-negative-400': status === 'error',
    })}
  >
    {status === 'success' ? (
      <CheckCircle size={12} />
    ) : (
      <WarningCircle size={12} />
    )}
    {children}
  </div>
);

TokenStatus.displayName = displayName;

export default TokenStatus;
