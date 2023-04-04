import React from 'react';

import TokenErrorMessage from './TokenErrorMessage';

const displayName =
  '~common.ColonyActions.ActionDetails.DefaultMotion.StakingWidget.StakingValidationMessage';

interface StakingValidationMessageProps {
  enoughTokens: boolean;
  tokensLeftToActivate: string;
}

const StakingValidationMessage = ({
  enoughTokens,
  tokensLeftToActivate,
}: StakingValidationMessageProps) => {
  if (!enoughTokens) {
    return <TokenErrorMessage tokensLeftToActivate={tokensLeftToActivate} />;
  }

  return null;
};

StakingValidationMessage.displayName = displayName;

export default StakingValidationMessage;
