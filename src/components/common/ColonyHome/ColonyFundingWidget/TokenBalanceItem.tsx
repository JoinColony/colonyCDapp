import React from 'react';

import Numeral from '~shared/Numeral';
import IconTooltip from '~shared/IconTooltip';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { Token } from '~types';

import styles from './ColonyFundingWidget.css';

interface Props {
  token: Token;
  isTokenNative?: boolean;
  isNativeTokenLocked?: boolean;
  balance: string;
}

const displayName = 'common.ColonyHome.ColonyFundingWidget.TokenBalanceItem';

const TokenBalanceItem = ({
  token: { decimals, symbol },
  isTokenNative,
  isNativeTokenLocked,
  balance,
}: Props) =>
  typeof balance === 'undefined' ? null : (
    <div className={styles.tokenItem}>
      <span
        className={styles.tokenValue}
        data-test={isTokenNative ? 'colonyFundingNativeTokenValue' : null}
      >
        <Numeral
          decimals={getTokenDecimalsWithFallback(decimals)}
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

TokenBalanceItem.displayName = displayName;

export default TokenBalanceItem;
