import React, { useMemo, useState, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';
// import { MiniSpinnerLoader } from '~shared/Preloaders';
// import { Colony, useTokenBalancesForDomainsQuery } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';

import styles from './ColonyTotalFunds.css';
import IconTooltip from '~shared/IconTooltip';

const MSG = defineMessages({
  loadingData: {
    id: 'dashboard.ColonyTotalFundsSelectedToken.loadingData',
    defaultMessage: 'Loading token information...',
  },
  tokenSelect: {
    id: 'dashboard.ColonyTotalFundsSelectedToken.tokenSelect',
    defaultMessage: 'Select Tokens',
  },
});

type Props = {
  children?: React.ReactChild;
};

const displayName = 'dashboard.ColonyTotalFundsSelectedToken';

const ColonyTotalFundsSelectedToken = ({ children }: Props) => {
  const { colony } = useColonyContext();
  const { tokens, nativeToken, status } = colony || {};
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
          <span data-test="colonyTokenSymbol">
            {currentToken?.token?.symbol}
          </span>
          {currentTokenAddress === nativeTokenAddress &&
            !status?.nativeToken?.unlocked && (
              <IconTooltip
                icon="lock"
                tooltipText={{ id: 'tooltip.lockedToken' }}
                className={styles.tokenLockWrapper}
                appearance={{ size: 'large' }}
              />
            )}
          <Icon
            className={styles.caretIcon}
            name="caret-down-small"
            title={MSG.tokenSelect}
          />
        </button>
      </ColonyTotalFundsPopover>
      {children}
    </div>
  );
};

ColonyTotalFundsSelectedToken.displayName = displayName;

export default ColonyTotalFundsSelectedToken;
