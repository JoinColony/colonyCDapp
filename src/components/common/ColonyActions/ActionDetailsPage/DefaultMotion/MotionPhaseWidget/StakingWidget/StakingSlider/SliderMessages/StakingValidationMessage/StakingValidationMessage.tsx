import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Decimal from 'decimal.js';

import Button from '~shared/Button';
// import { TokenActivationContext } from '~users/TokenActivationProvider';

import { StakingWidgetContextValues } from '../../../StakingWidgetProvider';

import styles from './StakingValidationMessage.css';
import getErrorValues from './getErrorValues';

const displayName =
  'common.ActionDetailsPage.DefaultMotion.StakingWidget.StakingValidationError';

const MSG = defineMessages({
  tokens: {
    id: `${displayName}.tokens`,
    defaultMessage: `Activate {leftToActivate} more {tokenSymbol} to be eligible to stake.`,
  },
  reputation: {
    id: `${displayName}.reputation`,
    defaultMessage: `The minimum reputation required to stake in this team is {minimumReputation} points. When this motion was created you only had {userReputation} points, so you can't stake on this motion. If you now have more than {minimumReputation} Reputation points, you will be able to stake on future motions.`,
  },
  stakeMoreTokens: {
    id: `${displayName}.stakeMoreTokens`,
    defaultMessage: `Oops! You don't have enough active tokens. To stake more than this, please activate more tokens.`,
  },
  stakeMoreReputation: {
    id: `${displayName}.stakeMoreReputation`,
    defaultMessage: `Oops! Your ability to stake is limited by the amount of Reputation you have. To be able to stake more on future motions, you'll need to earn more Reputation.`,
  },
  cantStakeMore: {
    id: `${displayName}.cantStakeMore`,
    defaultMessage: `The motion can't be staked more than the minimum stake.`,
  },
});

export interface StakingValidationMessageProps {
  limitExceeded: boolean;
  minUserStake: Decimal;
  maxUserStake: Decimal;
  getErrorType: StakingWidgetContextValues['getErrorType'];
  nativeTokenDecimals: number;
  nativeTokenSymbol: string;
  reputationLoading: boolean;
}

const StakingValidationMessage = ({
  limitExceeded,
  minUserStake,
  maxUserStake,
  getErrorType,
  nativeTokenDecimals,
  nativeTokenSymbol,
  reputationLoading,
}: StakingValidationMessageProps) => {
  //   const { setIsOpen: openTokenActivationPopover } = useContext(
  //     TokenActivationContext,
  //   );

  const errorType = getErrorType(limitExceeded);
  const errorValues = getErrorValues({
    maxUserStake,
    minUserStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
  });

  if (!errorType || reputationLoading) {
    return null;
  }

  if (errorType === 'tokens') {
    return (
      <div className={styles.activateTokens}>
        <Button
          text={MSG.tokens}
          textValues={errorValues.tokens}
          appearance={{ theme: 'pink' }}
          // onClick={() => openTokenActivationPopover(true)}
        />
      </div>
    );
  }

  return (
    <div className={styles.validationError}>
      <FormattedMessage {...MSG[errorType]} values={errorValues[errorType]} />
    </div>
  );
};

StakingValidationMessage.displayName = displayName;

export default StakingValidationMessage;
