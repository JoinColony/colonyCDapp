import React from 'react';
import { BigNumber } from 'ethers';
import classnames from 'classnames';

import { getFormattedTokenValue } from '~utils/tokens';
import Numeral from '~shared/Numeral';
import { Token } from '~types';

import styles from './UserTokenActivationButton.css';

const displayName =
  'users.UserTokenActivationButton.UserTokenActivationDisplay';

interface Props {
  nativeToken?: Token;
  inactiveBalance: BigNumber;
  totalBalance: BigNumber;
}

const UserTokenActivationDisplay = ({
  nativeToken,
  inactiveBalance,
  totalBalance,
}: Props) => {
  const formattedTotalBalance = getFormattedTokenValue(
    totalBalance,
    nativeToken?.decimals,
  );

  return (
    <div>
      <span
        className={classnames(styles.dot, {
          [styles.dotInactive]: inactiveBalance.gt(0) || totalBalance.isZero(),
        })}
      />
      <Numeral value={formattedTotalBalance} suffix={nativeToken?.symbol} />
    </div>
  );
};

UserTokenActivationDisplay.displayName = displayName;
export default UserTokenActivationDisplay;
