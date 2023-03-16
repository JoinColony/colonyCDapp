import React from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { ColonyAction, SetStateFn } from '~types';
import StakingWidget, { StakingWidgetProvider } from './StakingWidget';
import FinalizeMotion from './FinalizeMotion';
import { MotionState } from '~utils/colonyMotions';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionPhaseWidget';

interface MotionPhaseWidgetProps {
  actionData: ColonyAction;
  motionState: MotionState;
  setShowStakeBanner: SetStateFn;
  updateMotion: () => void;
}

const MotionPhaseWidget = ({
  actionData: { motionData },
  motionState,
  setShowStakeBanner,
  updateMotion,
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

    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
