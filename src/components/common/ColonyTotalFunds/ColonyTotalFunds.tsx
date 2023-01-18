import React, { useMemo, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
// import { ColonyVersion } from '@colony/colony-js';

import Icon from '~shared/Icon';
import Link from '~shared/Link';
import Numeral from '~shared/Numeral';
// import { MiniSpinnerLoader } from '~shared/Preloaders';
import IconTooltip from '~shared/IconTooltip';
// import {
//   useTokenBalancesForDomainsQuery,
// } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { Icons } from '~constants';

import ColonyTotalFundsPopover from './ColonyTotalFundsPopover';

import styles from './ColonyTotalFunds.css';

const displayName = 'common.ColonyTotalFunds';

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

const ColonyTotalFunds = () => {
  const { colony, canInteractWithColony } = useColonyContext();
  const { name, tokens, nativeToken, status } = colony || {};
  const { tokenAddress: nativeTokenAddress } = nativeToken || {};

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
                  icon={Icons.Lock}
                  tooltipText={{ id: 'tooltip.lockedToken' }}
                  className={styles.tokenLockWrapper}
                  appearance={{ size: 'large' }}
                />
              )}
            <Icon
              className={styles.caretIcon}
              name={Icons.CaretDownSmall}
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
              name={Icons.ArrowRight}
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
