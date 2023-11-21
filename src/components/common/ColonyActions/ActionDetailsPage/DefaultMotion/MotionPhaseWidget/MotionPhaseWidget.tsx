import React from 'react';

import { StakerRewards } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { ColonyActionType, Address } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { MotionAction } from '~types/motions';

import ClaimMotionStakes from './ClaimMotionStakes';
import FinalizeMotion from './FinalizeMotion';
import StakingWidget, { StakingWidgetProvider } from './StakingWidget';
import { VotingWidget } from './VotingWidget';
import { RevealWidget } from './RevealWidget';
import { VoteOutcome } from './VoteOutcome';
import { RefetchAction } from '../../useGetColonyAction';

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
  refetchAction: RefetchAction;
}

interface MotionPhaseWidgetProps extends PollingControls {
  actionData: MotionAction;
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
  const { startPollingAction, stopPollingAction } = rest;
  const isDecision = !!actionData.decisionData;

  switch (motionState) {
    case MotionState.Supported:
    case MotionState.Staking: {
      return (
        <StakingWidgetProvider motionData={motionData} {...rest}>
          <StakingWidget />
        </StakingWidgetProvider>
      );
    }

    case MotionState.Failed:
    case MotionState.Passed: {
      if (!motionData.isFinalized && !isDecision) {
        return (
          <div>
            <FinalizeMotion
              amount={amount}
              tokenAddress={tokenAddress}
              motionData={motionData}
              requiresDomainFunds={
                !!fromDomain &&
                !!amount &&
                type !== ColonyActionType.MintTokensMotion &&
                type !== ColonyActionType.EmitDomainReputationPenaltyMotion &&
                type !== ColonyActionType.EmitDomainReputationRewardMotion
              }
              {...rest}
            />
            <VoteOutcome actionData={actionData} />
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
        <>
          <ClaimMotionStakes motionData={motionData} {...rest} />
          <VoteOutcome actionData={actionData} />
        </>
      );
    }

    case MotionState.FailedNotFinalizable: {
      startPollingAction(1000);
      const { stakerRewards } = motionData;
      if (stakerRewards.length) {
        stopPollingAction();
      }

      return (
        <>
          <ClaimMotionStakes motionData={motionData} {...rest} />
          <VoteOutcome actionData={actionData} />
        </>
      );
    }

    case MotionState.Voting: {
      return (
        <VotingWidget
          actionData={actionData}
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

    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
