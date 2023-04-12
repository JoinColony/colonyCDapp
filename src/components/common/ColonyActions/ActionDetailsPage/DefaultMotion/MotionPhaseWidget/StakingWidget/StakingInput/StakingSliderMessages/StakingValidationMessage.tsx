import { BigNumber } from 'ethers';
import React from 'react';

import TokenErrorMessage from './TokenErrorMessage';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingValidationMessage';

interface StakingValidationMessageProps {
  enoughTokensToStakeMinimum: boolean;
  userActivatedTokens: BigNumber;
  userMinStake: string;
}

const StakingValidationMessage = ({
  enoughTokensToStakeMinimum,
  userActivatedTokens,
  userMinStake,
}: StakingValidationMessageProps) => {
  const tokensLeftToActivate = BigNumber.from(userMinStake)
    .sub(userActivatedTokens)
    .toString();
  if (!enoughTokensToStakeMinimum) {
    return <TokenErrorMessage tokensLeftToActivate={tokensLeftToActivate} />;
  }

  return null;
};

StakingValidationMessage.displayName = displayName;

export default StakingValidationMessage;
