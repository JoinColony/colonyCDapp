import React from 'react';

import Numeral from '~shared/Numeral';
import IconTooltip from '~shared/IconTooltip';
// import { TokenBalancesForDomainsQuery } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { Token } from '~types';

import styles from './ColonyFundingWidget.css';

interface Props {
  // currentDomainId: number;
  token: Token;
  isTokenNative?: boolean;
  isNativeTokenLocked?: boolean;
}

const displayName = 'common.ColonyHome.ColonyFundingWidget.TokenBalanceItem';

const TokenBalanceItem = ({
  // currentDomainId,
  token: { decimals, symbol },
  isTokenNative,
  isNativeTokenLocked,
}: Props) => {
  // const domainBalance = balances.find(
  //   ({ domainId }) => domainId === currentDomainId,
  // );
  // const balance = domainBalance && domainBalance.amount;
  const balance = 0;

  return typeof balance === 'undefined' ? null : (
    <div className={styles.tokenItem}>
      <span
        className={styles.tokenValue}
        data-test={isTokenNative ? 'colonyFundingNativeTokenValue' : null}
      >
        <Numeral
          unit={getTokenDecimalsWithFallback(decimals)}
          value={balance}
        />
      </span>
      <span className={styles.tokenSymbol}>
        <span>{symbol}</span>
        {isTokenNative && isNativeTokenLocked && (
          <IconTooltip
            icon="lock"
            tooltipText={{ id: 'tooltip.lockedToken' }}
            className={styles.tokenLockWrapper}
            appearance={{ size: 'small' }}
            dataTest="lockIconTooltip"
          />
        )}
      </span>
    </div>
  );
};

TokenBalanceItem.displayName = displayName;

export default TokenBalanceItem;
