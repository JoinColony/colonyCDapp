import React, { type FC } from 'react';

import GanacheIcon from '~icons/GanacheIcon.tsx';

import { type TokenProps } from './types.ts';

const displayName = 'common.Extensions.UserNavigation.partials.Token';

const Token: FC<TokenProps> = ({ nativeToken, size = 14 }) => {
  const Icon = nativeToken.icon || GanacheIcon;
  return (
    <div className="flex min-h-[2.5rem] min-w-[2.625rem] items-center justify-center rounded-full border border-gray-200 bg-base-white px-[0.875rem] py-[0.625rem]">
      <Icon size={size} />
      <p className="ml-1 hidden text-gray-700 text-3 md:block">
        {nativeToken.name}
      </p>
    </div>
  );
};

Token.displayName = displayName;

export default Token;
