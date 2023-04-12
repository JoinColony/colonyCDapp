import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext, useTokenActivationContext } from '~hooks';

import Button from '~shared/Button';
import Numeral from '~shared/Numeral';

import styles from './TokenErrorMessage.css';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.TokenErrorMessage';

const MSG = defineMessages({
  tokens: {
    id: `${displayName}.tokens`,
    defaultMessage: `Activate {leftToActivate} more {tokenSymbol} to be eligible to stake.`,
  },
});

interface TokenErrorMessageProps {
  tokensLeftToActivate: string;
}

const TokenErrorMessage = ({
  tokensLeftToActivate,
}: TokenErrorMessageProps) => {
  const { colony } = useColonyContext();
  const { symbol: nativeTokenSymbol, decimals: nativeTokenDecimals } =
    colony?.nativeToken || {};
  const { setIsOpen: openTokenActivationPopover } = useTokenActivationContext();
  return (
    <div className={styles.activateTokens}>
      <Button
        text={MSG.tokens}
        textValues={{
          leftToActivate: (
            <Numeral
              className={styles.validationErrorValues}
              value={tokensLeftToActivate}
              decimals={nativeTokenDecimals}
            />
          ),
          tokenSymbol: nativeTokenSymbol,
        }}
        appearance={{ theme: 'pink' }}
        onClick={() => openTokenActivationPopover(true)}
      />
    </div>
  );
};

TokenErrorMessage.displayName = displayName;

export default TokenErrorMessage;
