import React, { FC } from 'react';

import { TokenProps } from './types';
import styles from './Token.module.css';
import Icon from '~shared/Icon';

export const displayName = 'common.Extensions.UserNavigation.partials.Token';

const Token: FC<TokenProps> = ({ nativeToken }) => (
  <div className={styles.token}>
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
