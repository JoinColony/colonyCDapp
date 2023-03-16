import React from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { ColonyAction, SetStateFn } from '~types';
import StakingWidget, { StakingWidgetProvider } from './StakingWidget';
import FinalizeMotion from './FinalizeMotion';
import ClaimMotionStakes from './ClaimMotionStakes';
import { MotionState } from '~utils/colonyMotions';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionPhaseWidget';

interface MotionPhaseWidgetProps {
  actionData: ColonyAction;
  motionState: MotionState;
  setShowStakeBanner: SetStateFn;
  updateMotion: () => void;
  setMotionState: SetStateFn;
}

const MotionPhaseWidget = ({
  actionData: { motionData },
  motionState,
  setShowStakeBanner,
  updateMotion,
  setMotionState,
}: MotionPhaseWidgetProps) => {
  if (!motionData) {
    return null;
  }

  const { motionState: networkMotionState } = motionData;

  switch (networkMotionState) {
    case NetworkMotionState.Staking: {
      return (
        <StakingWidgetProvider
          motionData={motionData}
          setShowStakeBanner={setShowStakeBanner}
          setMotionState={setMotionState}
        >
          <StakingWidget />
        </StakingWidgetProvider>
      );
    }
    case NetworkMotionState.Finalizable: {
      if (motionState === MotionState.Passed) {
        return (
          <FinalizeMotion motionData={motionData} updateMotion={updateMotion} />
        );
      }
      return null;
    }
    case NetworkMotionState.Finalized: {
      return <ClaimMotionStakes motionData={motionData} />;
    }

    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
