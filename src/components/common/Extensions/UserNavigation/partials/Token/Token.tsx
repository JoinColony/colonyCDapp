import React, { FC } from 'react';
import TokenIcon from '~shared/TokenIcon';
import { TokenProps } from './types';

export const displayName = 'common.Extensions.UserNavigation.partials.Token';

const Token: FC<TokenProps> = ({ nativeToken }) => (
  <div className="text-md h-[2.5rem] px-4 py-2.5 bg-base-white border rounded-full border-gray-300 flex items-center">
    <TokenIcon token={nativeToken} size="xxs" />
    <p className="text-sm font-inter font-medium ml-1 hidden md:block">{nativeToken.name}</p>
  </div>
);

Token.displayName = displayName;

export default Token;
