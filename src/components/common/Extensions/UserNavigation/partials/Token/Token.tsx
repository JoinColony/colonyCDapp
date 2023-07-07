import React, { FC } from 'react';

import TokenIcon from '~shared/TokenIcon';
import { TokenProps } from './types';
import styles from './Token.module.css';

export const displayName = 'common.Extensions.UserNavigation.partials.Token';

const Token: FC<TokenProps> = ({ nativeToken }) => (
  <div className={styles.token}>
    <TokenIcon token={nativeToken} size="xxxs" className="relative h-4 w-4" />
    <p className="text-3 text-gray-700 ml-1 hidden md:block">
      {nativeToken.name}
    </p>
  </div>
);

Token.displayName = displayName;

export default Token;
