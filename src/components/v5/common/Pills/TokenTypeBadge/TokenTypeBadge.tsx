import React, { FC, PropsWithChildren } from 'react';

import clsx from 'clsx';
import PillsBase from '../PillsBase';
import { TOKEN_TYPE, TokenTypeBadgeProps } from './types';

const displayName = 'v5.common.Pills.TokenTypeBadge';

const TokenTypeBadge: FC<PropsWithChildren<TokenTypeBadgeProps>> = ({
  tokenType,
  children,
}) => {
  return (
    <PillsBase
      className={clsx('bg-base-white text-sm border font-medium', {
        'text-purple-400 border-purple-100':
          tokenType === TOKEN_TYPE.reputation,
        'text-blue-400 border-blue-100': tokenType === TOKEN_TYPE.native,
      })}
    >
      {children}
    </PillsBase>
  );
};

TokenTypeBadge.displayName = displayName;

export default TokenTypeBadge;
