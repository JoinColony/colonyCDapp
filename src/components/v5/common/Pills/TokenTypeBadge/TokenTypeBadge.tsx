import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import PillsBase from '../PillsBase.tsx';

import { TOKEN_TYPE, type TokenTypeBadgeProps } from './types.ts';

const displayName = 'v5.common.Pills.TokenTypeBadge';

const TokenTypeBadge: FC<PropsWithChildren<TokenTypeBadgeProps>> = ({
  tokenType,
  children,
}) => {
  return (
    <PillsBase
      className={clsx('border bg-base-white text-sm font-medium', {
        'border-purple-100 text-purple-400':
          tokenType === TOKEN_TYPE.reputation,
        'border-blue-100 text-blue-400': tokenType === TOKEN_TYPE.native,
      })}
    >
      {children}
    </PillsBase>
  );
};

TokenTypeBadge.displayName = displayName;

export default TokenTypeBadge;
