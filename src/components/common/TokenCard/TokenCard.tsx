import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Card from '~shared/Card';
import EthUsd from '~shared/EthUsd';
import Numeral from '~shared/Numeral';
import CopyableAddress from '~shared/CopyableAddress';
import TokenInfoPopover from '~shared/TokenInfoPopover';
import TokenIcon from '~shared/TokenIcon';
import IconTooltip from '~shared/IconTooltip';
import { Token } from '~types';
import { getBalanceForTokenAndDomain, getTokenDecimalsWithFallback } from '~utils/tokens';
import { useColonyContext } from '~hooks';
import { ColonyBalances } from '~gql';
import { ADDRESS_ZERO } from '~constants';

import styles from './TokenCard.css';

interface Props {
  domainId: number;
  token: Token;
}

const displayName = 'common.TokenCard';

const MSG = defineMessages({
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: ' (Native Token)',
  },
  unknownToken: {
    id: `${displayName}.unknownToken`,
    defaultMessage: 'Unknown Token',
  },
});

const TokenCard = ({ domainId, token }: Props) => {
  const { colony } = useColonyContext();
  const { balances, nativeToken, status } = colony || {};
  const { nativeToken: nativeTokenStatus } = status || {};

  const currentTokenBalance =
    getBalanceForTokenAndDomain(balances as ColonyBalances, token?.tokenAddress, domainId) || 0;

  return (
    <Card key={token.tokenAddress} className={styles.main}>
      <TokenInfoPopover
        token={token}
        isTokenNative={token.tokenAddress === nativeToken?.tokenAddress}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [[0, 0]],
              },
            },
          ],
        }}
      >
        <div className={styles.cardHeading}>
          <TokenIcon token={token} size="xs" />
          <div className={styles.tokenSymbol}>
            {token.symbol ? (
              <span>{token.symbol}</span>
            ) : (
              <>
                <FormattedMessage {...MSG.unknownToken} />
                <CopyableAddress>{token.tokenAddress}</CopyableAddress>
              </>
            )}
            {token.tokenAddress === nativeToken?.tokenAddress && !nativeTokenStatus?.unlocked && (
              <IconTooltip
                icon="lock"
                tooltipText={{ id: 'tooltip.lockedToken' }}
                className={styles.tokenLockWrapper}
                appearance={{ size: 'tiny' }}
              />
            )}
            {token.tokenAddress === nativeToken?.tokenAddress && (
              <span className={styles.nativeTokenText}>
                <FormattedMessage {...MSG.nativeToken} />
              </span>
            )}
          </div>
        </div>
      </TokenInfoPopover>
      <div className={currentTokenBalance.lt(0) ? styles.balanceNotPositive : styles.balanceContent}>
        <Numeral
          className={styles.balanceNumeral}
          decimals={getTokenDecimalsWithFallback(token.decimals)}
          value={currentTokenBalance}
        />
      </div>
      <div className={styles.cardFooter}>
        {token.tokenAddress === ADDRESS_ZERO && <EthUsd className={styles.ethUsdText} value={currentTokenBalance} />}
      </div>
    </Card>
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
