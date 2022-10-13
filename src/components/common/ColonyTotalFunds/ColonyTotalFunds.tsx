import React, { useMemo, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
// import { ColonyVersion } from '@colony/colony-js';

import Icon from '~shared/Icon';
import Link from '~shared/Link';
import Numeral from '~shared/Numeral';
// import { MiniSpinnerLoader } from '~shared/Preloaders';
import IconTooltip from '~shared/IconTooltip';
// import {
//   Colony,
//   useTokenBalancesForDomainsQuery,
//   useLoggedInUser,
// } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import { checkIfNetworkIsAllowed } from '~utils/networks';

import { FullColony, FullColonyTokens } from '~gql';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';

import styles from './ColonyTotalFunds.css';

const MSG = defineMessages({
  totalBalance: {
    id: 'dashboard.ColonyTotalFunds.totalBalance',
    defaultMessage: 'Colony total balance',
  },
  manageFundsLink: {
    id: 'dashboard.ColonyTotalFunds.manageFundsLink',
    defaultMessage: 'Manage Funds',
  },
  loadingData: {
    id: 'dashboard.ColonyTotalFunds.loadingData',
    defaultMessage: 'Loading token information...',
  },
  tokenSelect: {
    id: 'dashboard.ColonyTotalFunds.tokenSelect',
    defaultMessage: 'Select Tokens',
  },
});

type Props = {
  colony: FullColony;
};

const displayName = 'dashboard.ColonyTotalFunds';

const ColonyTotalFunds = ({
  colony: {
    name,
    tokens,
    nativeToken: { tokenAddress: nativeTokenAddress },
    status,
    // version,
    // isNativeTokenLocked,
  },
}: Props) => {
  // const { networkId } = useLoggedInUser();

  const [currentTokenAddress, setCurrentTokenAddress] =
    useState<Address>(nativeTokenAddress);

  // const {
  //   data,
  //   loading: isLoadingTokenBalances,
  // } = useTokenBalancesForDomainsQuery({
  //   variables: {
  //     colonyAddress,
  //     domainIds: [COLONY_TOTAL_BALANCE_DOMAIN_ID],
  //     tokenAddresses: colonyTokens.map(({ address }) => address),
  //   },
  // });

  useEffect(() => {
    setCurrentTokenAddress(nativeTokenAddress);
  }, [nativeTokenAddress]);

  const currentToken = useMemo(() => {
    if (tokens) {
      return (tokens.items as unknown as FullColonyTokens[]).find(
        ({ token }) => token.tokenAddress === currentTokenAddress,
      );
    }
    return undefined;
  }, [tokens, currentTokenAddress]);

  // const isSupportedColonyVersion =
  //   parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;
  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const isSupportedColonyVersion = true;
  const isNetworkAllowed = true;

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
    <div className={styles.main}>
      <div className={styles.selectedToken}>
        <Numeral
          className={styles.selectedTokenAmount}
          unit={getTokenDecimalsWithFallback(currentToken?.token?.decimals)}
          // value={currentToken.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount}
          value={0}
          data-test="colonyTotalFunds"
        />
        <ColonyTotalFundsPopover
          tokens={tokens?.items as FullColonyTokens[]}
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
              name="caret-down"
              title={MSG.tokenSelect}
            />
          </button>
        </ColonyTotalFundsPopover>
      </div>
      <div className={styles.totalBalanceCopy}>
        <FormattedMessage {...MSG.totalBalance} />
        {isSupportedColonyVersion && isNetworkAllowed && (
          <Link
            className={styles.manageFundsLink}
            to={`/colony/${name}/funds`}
            data-test="manageFunds"
          >
            <Icon
              className={styles.rightArrowDisplay}
              name="arrow-right"
              appearance={{ size: 'small' }}
              title={MSG.manageFundsLink}
            />
            <FormattedMessage {...MSG.manageFundsLink} />
          </Link>
        )}
      </div>
    </div>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
