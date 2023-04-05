import { BigNumber } from 'ethers';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import TokenErrorMessage from './TokenErrorMessage';
import styles from './StakingValidationMessage.css';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingValidationMessage';

const MSG = defineMessages({
  limitExceeded: {
    id: `${displayName}.limitExceeded`,
    defaultMessage: `Oops! You don't have enough active tokens. To stake more than this, please activate more tokens.`,
  },
});

interface StakingValidationMessageProps {
  enoughTokensToStakeMinimum: boolean;
  userActivatedTokens: BigNumber;
  userMinStake: string;
  limitExceeded: boolean;
}

const StakingValidationMessage = ({
  enoughTokensToStakeMinimum,
  userActivatedTokens,
  userMinStake,
  limitExceeded,
}: StakingValidationMessageProps) => {
  const tokensLeftToActivate = BigNumber.from(userMinStake)
    .sub(userActivatedTokens)
    .toString();

  if (!enoughTokensToStakeMinimum) {
    return <TokenErrorMessage tokensLeftToActivate={tokensLeftToActivate} />;
  }

  if (limitExceeded) {
    return (
      <div className={styles.validationError}>
        <FormattedMessage {...MSG.limitExceeded} />
      </div>
    );
  }

  return null;
};

StakingValidationMessage.displayName = displayName;

export default StakingValidationMessage;
