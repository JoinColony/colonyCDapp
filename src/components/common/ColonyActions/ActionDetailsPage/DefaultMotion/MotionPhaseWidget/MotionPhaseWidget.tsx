import React from 'react';

import { StakerRewards } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { ColonyAction, ColonyActionType, Address } from '~types';
import { MotionState } from '~utils/colonyMotions';

import ClaimMotionStakes from './ClaimMotionStakes';
import FinalizeMotion from './FinalizeMotion';
import StakingWidget, { StakingWidgetProvider } from './StakingWidget';
import { VotingWidget } from './VotingWidget';
import { RevealWidget } from './RevealWidget';
import { VoteOutcome } from './VoteOutcome';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionPhaseWidget';

const isMotionClaimed = (
  stakerRewards: StakerRewards[],
  walletAddress: Address,
) => {
  const userReward = stakerRewards.find(
    ({ address }) => address === walletAddress,
  );

  return !!userReward?.isClaimed;
};

export interface PollingControls {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
}

interface MotionPhaseWidgetProps extends PollingControls {
  actionData: ColonyAction;
  motionState: MotionState;
}

const MotionPhaseWidget = ({
  actionData,
  motionState,
  ...rest
}: MotionPhaseWidgetProps) => {
  const { user } = useAppContext();
  const { refetchColony } = useColonyContext();
  const { motionData, type, amount, fromDomain, tokenAddress } = actionData;
  const { stopPollingAction } = rest;

  if (!motionData) {
    /*
     * Will not happen. Undefined motion data will result in the invalid transaction view being
     * rendered by the parent. But, this is cleaner than creating a custom ColonyAction type to reflect
     * the fact that motion data is defined here.
     */
    return null;
  }

  switch (motionState) {
    case MotionState.Staked:
    case MotionState.Staking: {
      return (
        <StakingWidgetProvider motionData={motionData} {...rest}>
          <StakingWidget />
        </StakingWidgetProvider>
      );
    }

    case MotionState.Failed:
    case MotionState.Passed: {
      if (!motionData.isFinalized) {
        return (
          <div>
            <FinalizeMotion
              amount={amount}
              tokenAddress={tokenAddress}
              motionData={motionData}
              requiresDomainFunds={
                !!fromDomain &&
                !!amount &&
                type !== ColonyActionType.MintTokensMotion
              }
              {...rest}
            />
            <VoteOutcome motionData={motionData} actionType={type} />
          </div>
        );
      }

      /* Update colony object when motion gets finalized. */
      refetchColony();

      const isClaimed = isMotionClaimed(
        motionData.stakerRewards,
        user?.walletAddress ?? '',
      );

      if (isClaimed) {
        stopPollingAction();
      }

      return (
        <div>
          <ClaimMotionStakes motionData={motionData} {...rest} />
          <VoteOutcome motionData={motionData} actionType={type} />
        </div>
      );
    }

    case MotionState.FailedNotFinalizable: {
      return (
        <>
          <ClaimMotionStakes motionData={motionData} {...rest} />
          <VoteOutcome motionData={motionData} actionType={type} />
        </>
      );
    }

    case MotionState.Voting: {
      return (
        <VotingWidget
          actionType={type}
          motionData={motionData}
          motionState={motionState}
          {...rest}
        />
      );
    }

    case MotionState.Reveal: {
      return (
        <RevealWidget
          motionData={motionData}
          motionState={motionState}
          {...rest}
        />
      );
    }

    /* Extend with other widgets as they get ported. */

    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
