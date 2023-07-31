import { BigNumber } from 'ethers';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import TokenErrorMessage from './TokenErrorMessage';
import NotEnoughReputationMessage from './NotEnoughReputationMessage';

import styles from './StakingValidationMessage.css';
import { userCanStakeMore, userHasInsufficientReputation } from './helpers';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingValidationMessage';

const MSG = defineMessages({
  limitExceeded: {
    id: `${displayName}.limitExceeded`,
    defaultMessage: `Oops! You don't have enough active tokens. To stake more than this, please activate more tokens.`,
  },
  moreRepNeeded: {
    id: `${displayName}.moreRepNeeded`,
    defaultMessage: `Oops! Your ability to stake is limited by the amount of Reputation you have. To be able to stake more on future motions, you'll need to earn more Reputation.`,
  },
  cantStakeMore: {
    id: `${displayName}.cantStakeMore`,
    defaultMessage: `The amount left to stake is less than the minimum stake. A motion can't be staked more than 100%.`,
  },
});

enum StakingValidationErrors {
  CantStakeMore = 'cantStakeMore',
  MoreRepNeeded = 'moreRepNeeded',
  LimitExceeded = 'limitExceeded',
}

interface StakingValidationMessageProps {
  enoughTokensToStakeMinimum: boolean;
  userActivatedTokens: BigNumber;
  limitExceeded: boolean;
  nativeTokenDecimals: number;
  userMinStake: string;
  userMaxStake: BigNumber;
  enoughReputationToStakeMinimum: boolean;
  remainingToStake: string;
}

const StakingValidationMessage = ({
  enoughTokensToStakeMinimum,
  userActivatedTokens,
  limitExceeded,
  enoughReputationToStakeMinimum,
  nativeTokenDecimals,
  userMinStake,
  userMaxStake,
  remainingToStake,
}: StakingValidationMessageProps) => {
  const tokensLeftToActivate = BigNumber.from(userMinStake)
    .sub(userActivatedTokens)
    .toString();

  if (!enoughReputationToStakeMinimum) {
    return (
      <NotEnoughReputationMessage
        userMaxStake={userMaxStake}
        userMinStake={userMinStake}
        nativeTokenDecimals={nativeTokenDecimals}
      />
    );
  }

  if (!enoughTokensToStakeMinimum) {
    return <TokenErrorMessage tokensLeftToActivate={tokensLeftToActivate} />;
  }

  let errorType: StakingValidationErrors | undefined;

  const userNeedsMoreReputation = userHasInsufficientReputation(
    userActivatedTokens,
    userMaxStake,
    remainingToStake,
  );

  const canStakeMore = userCanStakeMore(userMinStake, remainingToStake);

  if (!canStakeMore && remainingToStake !== '0') {
    errorType = StakingValidationErrors.CantStakeMore;
  } else if (userNeedsMoreReputation) {
    errorType = StakingValidationErrors.MoreRepNeeded;
  } else if (limitExceeded) {
    errorType = StakingValidationErrors.LimitExceeded;
  }

  if (!errorType) {
    return null;
  }

  return (
    <div className={styles.validationError}>
      <FormattedMessage {...MSG[errorType]} />
    </div>
  );
};

StakingValidationMessage.displayName = displayName;

export default StakingValidationMessage;
