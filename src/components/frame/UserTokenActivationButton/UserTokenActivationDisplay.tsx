import React from 'react';
import classnames from 'classnames';

import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~shared/Numeral';
import { Token, UserTokenBalanceData } from '~types';

import styles from './UserTokenActivationButton.css';

const displayName =
  'frame.RouteLayouts.UserNavigation.UserTokenActivationButton.UserTokenActivationDisplay';

interface Props {
  nativeToken?: Token;
  tokenBalanceData: UserTokenBalanceData;
}

const UserTokenActivationDisplay = ({
  nativeToken,
  tokenBalanceData,
}: Props) => {
  return (
    <div>
      <span
        className={classnames(styles.dot, {
          /** @TODO Pass inactive balance below */
          // [styles.dotInactive]: inactiveBalance.gt(0) || totalBalance.isZero(),
        })}
      />
      <Numeral
        value={tokenBalanceData.balance ?? 0}
        decimals={getTokenDecimalsWithFallback(nativeToken?.decimals)}
        suffix={nativeToken?.symbol}
      />
    </div>
  );
};

UserTokenActivationDisplay.displayName = displayName;
export default UserTokenActivationDisplay;
