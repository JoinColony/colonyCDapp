import React, { FC } from 'react';

import clsx from 'clsx';
import PillsBase from '../PillsBase';
import { TOKEN_TYPE, TokenTypeBadgeProps } from './types';

const displayName = 'v5.common.Pills.TeamBadge';

const TokenTypeBadge: FC<TokenTypeBadgeProps> = ({ tokenType, name }) => {
  return (
    <PillsBase
      className={clsx('bg-base-white text-sm border font-medium', {
        'text-blue-400 border-blue-100': tokenType === TOKEN_TYPE.NATIVE,
        'text-purple-400 border-purple-100':
          tokenType === TOKEN_TYPE.REPUTATION,
      })}
    >
      {name}
    </PillsBase>
  );
};

TokenTypeBadge.displayName = displayName;

export default TokenTypeBadge;
