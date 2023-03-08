import React from 'react';

import Numeral from '~shared/Numeral';
import { useStakingWidgetContext } from '../../StakingWidgetProvider';

import styles from './StakingValidationMessage/StakingValidationMessage.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.TokensLeftToActivate';

interface TokensLeftToActivateProps {
  className?: string;
  suffix?: string;
}

const TokensLeftToActivate = ({
  className = styles.validationErrorValues,
  suffix,
}: TokensLeftToActivateProps) => {
  const { nativeTokenDecimals, userActivatedTokens, minUserStake } =
    useStakingWidgetContext();

  const tokensLeftToActivate = minUserStake.sub(userActivatedTokens).toString();

  return (
    <Numeral
      className={className}
      value={tokensLeftToActivate}
      decimals={nativeTokenDecimals}
      suffix={suffix}
    />
  );
};

TokensLeftToActivate.displayName = displayName;

export default TokensLeftToActivate;
