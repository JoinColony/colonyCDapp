import React from 'react';
import classnames from 'classnames';
import { BigNumber } from 'ethers';

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
  tokenBalanceData: { balance, inactiveBalance },
}: Props) => {
  return (
    <div>
      <span
        className={classnames(styles.dot, {
          [styles.dotInactive]:
            BigNumber.from(inactiveBalance ?? 0).gt(0) ||
            BigNumber.from(balance ?? 0).isZero(),
        })}
      />
      <Numeral
        value={balance ?? 0}
        decimals={getTokenDecimalsWithFallback(nativeToken?.decimals)}
        suffix={nativeToken?.symbol}
      />
    </div>
  );
};

UserTokenActivationDisplay.displayName = displayName;
export default UserTokenActivationDisplay;
