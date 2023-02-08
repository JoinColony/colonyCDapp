import React, { useMemo, useState, useEffect } from 'react';

import Numeral from '~shared/Numeral';
// import { MiniSpinnerLoader } from '~shared/Preloaders';
// import { Colony, useTokenBalancesForDomainsQuery } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';
import TokenSymbol from './TokenSymbol';

import styles from './ColonyTotalFunds.css';

const displayName = 'common.ColonyTotalFunds.SelectedToken';

type Props = {
  children?: React.ReactChild;
};

const SelectedToken = ({ children }: Props) => {
  const { colony } = useColonyContext();
  const { tokens, nativeToken } = colony || {};
  const { tokenAddress: nativeTokenAddress } = nativeToken || {};

  // const { data, loading: isLoadingTokenBalances } =
  //   useTokenBalancesForDomainsQuery({
  //     variables: {
  //       colonyAddress: colony?.colonyAddress,
  //       domainIds: [COLONY_TOTAL_BALANCE_DOMAIN_ID],
  //       tokenAddresses: colonyTokens.map(({ address }) => address),
  //     },
  //   });

  const [currentTokenAddress, setCurrentTokenAddress] = useState<Address>();

  useEffect(() => {
    if (!nativeTokenAddress) {
      return;
    }

    setCurrentTokenAddress(nativeTokenAddress);
  }, [nativeTokenAddress]);

  const currentToken = useMemo(() => {
    if (tokens) {
      return tokens.items.find(
        (colonyToken) =>
          colonyToken?.token.tokenAddress === currentTokenAddress,
      );
    }
    return undefined;
  }, [tokens, currentTokenAddress]);

  useEffect(() => {
    setCurrentTokenAddress(nativeTokenAddress);
  }, [nativeTokenAddress]);

  // if (!data || !currentToken || isLoadingTokenBalances) {
  //   return (
  //     <MiniSpinnerLoader
  //       className={styles.main}
  //       loadingText={MSG.loadingData}
  //       titleTextValues={{ hasCounter: false }}
  //     />
  //   );
  // }

  return (
    <div className={styles.selectedToken}>
      <Numeral
        className={styles.selectedTokenAmount}
        decimals={getTokenDecimalsWithFallback(currentToken?.token?.decimals)}
        // value={currentToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
        value={0}
        data-test="colonyTotalFunds"
      />
      <ColonyTotalFundsPopover
        tokens={tokens?.items
          .filter(notNull)
          .map((colonyToken) => colonyToken.token)}
        onSelectToken={setCurrentTokenAddress}
        currentTokenAddress={currentTokenAddress}
      >
        <button className={styles.selectedTokenSymbol} type="button">
          <TokenSymbol
            token={currentToken?.token}
            tokenAddress={currentTokenAddress}
          />
        </button>
      </ColonyTotalFundsPopover>
      {children}
    </div>
  );
};

SelectedToken.displayName = displayName;

export default SelectedToken;
