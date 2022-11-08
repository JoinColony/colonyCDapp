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
// } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Colony, ColonyTokens } from '~types';
import { useColonyContext } from '~hooks';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';

import styles from './ColonyTotalFunds.css';

const displayName = 'dashboard.ColonyTotalFunds';

const MSG = defineMessages({
  totalBalance: {
    id: `${displayName}.totalBalance`,
    defaultMessage: 'Colony total balance',
  },
  manageFundsLink: {
    id: `${displayName}.manageFundsLink`,
    defaultMessage: 'Manage Funds',
  },
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: 'Loading token information...',
  },
  tokenSelect: {
    id: `${displayName}.tokenSelect`,
    defaultMessage: 'Select Tokens',
  },
});

type Props = {
  colony: Colony;
};

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
  const { canInteractWithColony } = useColonyContext();
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
      return (tokens.items as unknown as ColonyTokens[]).find(
        ({ token }) => token.tokenAddress === currentTokenAddress,
      );
    }
    return undefined;
  }, [tokens, currentTokenAddress]);

  // const isSupportedColonyVersion =
  //   parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;

  const isSupportedColonyVersion = true;

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
          /*
           * @TODO Plese remove the ignore and fix types, once this gets refactored
           */
          // @ts-ignore
          tokens={tokens?.items}
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
        {isSupportedColonyVersion && canInteractWithColony && (
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
