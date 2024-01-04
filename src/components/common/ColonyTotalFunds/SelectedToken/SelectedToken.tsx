import React, { ReactNode, useState } from 'react';
// import { defineMessages } from 'react-intl';

import { useColonyContext } from '~hooks';
import Numeral from '~shared/Numeral';
import { Address } from '~types';
import { notNull } from '~utils/arrays';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';
import { getCurrentToken, getCurrentTokenRootBalance } from './helpers';
import TokenSymbol from './TokenSymbol';

import styles from './SelectedToken.css';

// import { MiniSpinnerLoader } from '~shared/Preloaders';
// import { Colony, useTokenBalancesForDomainsQuery } from '~data/index';

// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

const displayName = 'common.ColonyTotalFunds.SelectedToken';

type Props = {
  children?: ReactNode;
};

const SelectedToken = ({ children }: Props) => {
  const { colony } = useColonyContext();
  const { tokens, nativeToken, balances } = colony || {};
  const { tokenAddress: nativeTokenAddress } = nativeToken || {};
  const [currentTokenAddress, setCurrentTokenAddress] = useState<Address>(
    nativeTokenAddress ?? '',
  );
  const currentToken = getCurrentToken(tokens, currentTokenAddress);
  const currentTokenBalance = getCurrentTokenRootBalance(
    balances,
    currentTokenAddress,
  );

  return (
    <div className={styles.selectedToken}>
      <Numeral
        className={styles.selectedTokenAmount}
        decimals={getTokenDecimalsWithFallback(currentToken?.token?.decimals)}
        value={currentTokenBalance ?? 0}
        data-test="colonyTotalFunds"
      />
      <ColonyTotalFundsPopover
        tokens={tokens?.items
          .filter(notNull)
          .map((colonyToken) => colonyToken.token)}
        onSelectToken={setCurrentTokenAddress}
        currentTokenAddress={currentTokenAddress}
        balances={balances}
      >
        <TokenSymbol
          token={currentToken?.token}
          tokenAddress={currentTokenAddress}
        />
      </ColonyTotalFundsPopover>
      {children}
    </div>
  );
};

SelectedToken.displayName = displayName;

export default SelectedToken;
