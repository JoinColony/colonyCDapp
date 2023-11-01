import React, { FC } from 'react';

import { TokenProps } from './types';
import Icon from '~shared/Icon';

export const displayName = 'common.Extensions.UserNavigation.partials.Token';

const Token: FC<TokenProps> = ({ nativeToken }) => (
  <div className="flex items-center justify-center min-w-[2.625rem] min-h-[2.5rem] px-[0.875rem] py-[0.625rem] bg-base-white border rounded-full border-gray-200">
    <Icon
      name={nativeToken.iconName || 'ganache'}
      appearance={{ size: 'tiny' }}
    />
    <p className="text-3 text-gray-700 ml-1 hidden md:block">
      {nativeToken.name}
    </p>
  </div>
);

Token.displayName = displayName;

export default Token;
