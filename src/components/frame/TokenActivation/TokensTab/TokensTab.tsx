import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers';

import Icon from '~shared/Extensions/Icon';
import TokenInfoPopover from '~shared/TokenInfoPopover';
import TokenIcon from '~shared/TokenIcon';
import Numeral from '~shared/Numeral';
import { UserTokenBalanceData } from '~types';
import { useColonyContext } from '~hooks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import ChangeTokenStateForm from './ChangeTokenStateForm';
import TokenTooltip from './TokenTooltip';

import styles from './TokensTab.css';

const displayName = 'frame.TokenActivation.TokensTab';

const MSG = defineMessages({
  active: {
    id: `${displayName}.active`,
    defaultMessage: 'Active',
  },
  activeLocked: {
    id: `${displayName}.activeLocked`,
    defaultMessage: 'Active',
  },
  staked: {
    id: `${displayName}.staked`,
    defaultMessage: 'Staked',
  },
  inactive: {
    id: `${displayName}.inactive`,
    defaultMessage: 'Inactive',
  },
  activeTokensTooltip: {
    id: `${displayName}.activeTokensTooltip`,
    defaultMessage: `Tokens are “Active” when they’ve been deposited to a
      contract which lets them get ‘locked’ when you need to stake,
      or claim a share of Rewards. You can withdraw tokens back
      to your wallet any time, you just need to clear any locks first.`,
  },
  inactiveTokensTooltip: {
    id: `${displayName}.inactiveTokensTooltip`,
    defaultMessage: `Inactive tokens are contained in your own wallet.
      You need to “Activate” them to stake, or be eligible to receive Rewards.`,
  },
  stakedTokensTooltip: {
    id: `${displayName}.stakedTokensTooltip`,
    defaultMessage: `You have tokens staked in processes which must conclude
      before they can be deactivated.`,
  },
  pendingError: {
    id: `${displayName}.pendingError`,
    defaultMessage: 'Error: balance pending!',
  },
  pendingErrorTooltip: {
    id: `${displayName}.pendingErrorTooltip`,
    defaultMessage: 'Send any “Activate” transaction to claim pending balance.',
  },
});

export interface TokensTabProps {
  tokenBalanceData: UserTokenBalanceData;
}

const TokensTab = ({ tokenBalanceData }: TokensTabProps) => {
  const { colony } = useColonyContext();
  const targetRef = useRef<HTMLParagraphElement>(null);

  const { nativeToken } = colony || {};
  const { balance, inactiveBalance, lockedBalance, activeBalance, pendingBalance } = tokenBalanceData;

  const [totalTokensWidth, setTotalTokensWidth] = useState(0);

  const widthLimit = 164;

  useLayoutEffect(() => {
    if (targetRef?.current && totalTokensWidth === 0) {
      setTotalTokensWidth(targetRef?.current?.offsetWidth);
    }
  }, [totalTokensWidth]);

  const hasLockedTokens = BigNumber.from(lockedBalance ?? 0).gt(0);
  const hasPendingBalance = BigNumber.from(pendingBalance ?? 0).gt(0);

  const tokenDecimals = useMemo(() => getTokenDecimalsWithFallback(nativeToken?.decimals), [nativeToken]);

  if (!nativeToken) {
    return null;
  }

  return (
    <>
      <TokenInfoPopover token={nativeToken} isTokenNative>
        <div className={styles.totalTokensContainer}>
          <div className={totalTokensWidth <= widthLimit ? styles.tokenSymbol : styles.tokenSymbolSmall}>
            <TokenIcon token={nativeToken} size={totalTokensWidth <= widthLimit ? 'xs' : 'xxs'} />
          </div>
          <p ref={targetRef} className={totalTokensWidth <= widthLimit ? styles.totalTokens : styles.totalTokensSmall}>
            <Numeral value={balance ?? 0} decimals={tokenDecimals} suffix={nativeToken.symbol} />
          </p>
        </div>
      </TokenInfoPopover>
      <div className={styles.tokensDetailsContainer}>
        <ul>
          <li>
            <TokenTooltip className={styles.listItemActive} content={<FormattedMessage {...MSG.activeTokensTooltip} />}>
              <FormattedMessage {...(!hasLockedTokens ? MSG.active : MSG.activeLocked)} />
            </TokenTooltip>
            <div className={styles.tokenNumbers}>
              <span data-test="activeTokens">
                <Numeral value={activeBalance ?? 0} decimals={tokenDecimals} suffix={nativeToken.symbol} />
              </span>
            </div>
          </li>
          <li>
            <TokenTooltip className={styles.lockedTokens} content={<FormattedMessage {...MSG.stakedTokensTooltip} />}>
              <FormattedMessage {...MSG.staked} />
            </TokenTooltip>
            <div className={styles.tokenNumbersLocked}>
              <span data-test="stakedTokens">
                <Numeral value={lockedBalance ?? 0} decimals={tokenDecimals} suffix={nativeToken.symbol} />
              </span>
            </div>
          </li>
          <li>
            <TokenTooltip
              className={styles.listItemInactive}
              content={<FormattedMessage {...MSG.inactiveTokensTooltip} />}
            >
              <FormattedMessage {...MSG.inactive} />
            </TokenTooltip>
            <div className={styles.tokenNumbersInactive}>
              <span data-test="inactiveTokens">
                <Numeral value={inactiveBalance ?? 0} decimals={tokenDecimals} suffix={nativeToken.symbol} />
              </span>
            </div>
            {hasPendingBalance && (
              <div className={styles.pendingError}>
                <FormattedMessage {...MSG.pendingError} />
                <TokenTooltip
                  className={styles.questionmarkIcon}
                  content={<FormattedMessage {...MSG.pendingErrorTooltip} />}
                  popperOffset={[-5, 8]}
                >
                  <Icon name="question-mark" title={MSG.pendingError} appearance={{ size: 'small' }} />
                </TokenTooltip>
              </div>
            )}
          </li>
        </ul>
      </div>
      <ChangeTokenStateForm tokenBalanceData={tokenBalanceData} hasLockedTokens={hasLockedTokens} />
    </>
  );
};

export default TokensTab;
