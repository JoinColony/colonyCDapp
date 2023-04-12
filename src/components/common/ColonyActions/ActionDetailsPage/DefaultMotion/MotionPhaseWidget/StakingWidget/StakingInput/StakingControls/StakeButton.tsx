import { BigNumber } from 'ethers';
import React from 'react';

import { useAppContext } from '~hooks';
import { calculateStakeLimitDecimal } from '~hooks/helpers';

import Button from '~shared/Button';
import { useStakingWidgetContext } from '../../StakingWidgetProvider';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakeButton';

interface StakeButtonProps {
  isLoadingData: boolean;
  enoughTokensToStakeMinimum: boolean;
  enoughReputationToStakeMinimum: boolean;
  canStakeMore: boolean;
  userMaxStake: BigNumber;
  userActivatedTokens: BigNumber;
  userNeedsMoreReputation: boolean;
}

const StakeButton = ({
  isLoadingData,
  enoughTokensToStakeMinimum,
  enoughReputationToStakeMinimum,
  userNeedsMoreReputation,
  userMaxStake,
  userActivatedTokens,
  canStakeMore,
}: StakeButtonProps) => {
  const { user } = useAppContext();
  const { isObjection, remainingToStake, usersStakes, userMinStake } =
    useStakingWidgetContext();

  const userStakes = usersStakes.find(
    ({ address }) => address === user?.walletAddress,
  );

  const userTotalStake = isObjection
    ? userStakes?.stakes.raw.nay
    : userStakes?.stakes.raw.yay;

  const limitIsZero = calculateStakeLimitDecimal(
    remainingToStake,
    userMinStake,
    userMaxStake,
    userTotalStake ?? '0',
    userActivatedTokens,
  ).isZero();

  const userHasReachedReputationLimit = userNeedsMoreReputation && limitIsZero;
  return (
    <Button
      appearance={{
        theme: isObjection ? 'danger' : 'primary',
        size: 'medium',
      }}
      type="submit"
      disabled={
        isLoadingData ||
        userHasReachedReputationLimit ||
        !canStakeMore ||
        !enoughTokensToStakeMinimum ||
        !enoughReputationToStakeMinimum ||
        remainingToStake === '0'
      }
      text={{ id: 'button.stake' }}
      dataTest="stakeWidgetStakeButton"
    />
  );
};

StakeButton.displayName = displayName;

export default StakeButton;
