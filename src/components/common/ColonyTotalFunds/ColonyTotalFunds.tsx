import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
// import { ColonyVersion } from '@colony/colony-js';

import Icon from '~shared/Icon';
import Link from '~shared/Link';
import Numeral from '~shared/Numeral';
import IconTooltip from '~shared/IconTooltip';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import {
  useColonyContext,
  useCurrentSelectedToken,
  useTokenTotalBalance,
} from '~hooks';
import { notNull } from '~utils/arrays';

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
  const { currentToken, setCurrentTokenAddress } = useCurrentSelectedToken();
  const totalTokenBalance = useTokenTotalBalance(
    currentToken?.token?.tokenAddress,
  );

  // const isSupportedColonyVersion =
  //   parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;

  const isSupportedColonyVersion = true;

  return (
    <div className={styles.main}>
      <div className={styles.selectedToken}>
        <Numeral
          className={styles.selectedTokenAmount}
          decimals={getTokenDecimalsWithFallback(currentToken?.token?.decimals)}
          value={totalTokenBalance.balance}
          data-test="colonyTotalFunds"
        />
        <ColonyTotalFundsPopover
          tokens={tokens?.items
            .filter(notNull)
            .map((colonyToken) => colonyToken.token)}
          onSelectToken={setCurrentTokenAddress}
          currentTokenAddress={currentToken?.token?.tokenAddress}
        >
          <button className={styles.selectedTokenSymbol} type="button">
            <span data-test="colonyTokenSymbol">
              {currentToken?.token?.symbol}
            </span>
            {currentToken?.token?.tokenAddress === nativeTokenAddress &&
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
