import React from 'react';

import TokenErrorMessage from './TokenErrorMessage';

const displayName =
  '~common.ColonyActions.ActionDetails.DefaultMotion.StakingWidget.StakingValidationMessage';

interface StakingValidationMessageProps {
  enoughTokensToStakeMinimum: boolean;
  tokensLeftToActivate: string;
}

const StakingValidationMessage = ({
  enoughTokensToStakeMinimum,
  tokensLeftToActivate,
}: StakingValidationMessageProps) => {
  if (!enoughTokensToStakeMinimum) {
    return <TokenErrorMessage tokensLeftToActivate={tokensLeftToActivate} />;
  }

  return null;
};

StakingValidationMessage.displayName = displayName;

export default StakingValidationMessage;
