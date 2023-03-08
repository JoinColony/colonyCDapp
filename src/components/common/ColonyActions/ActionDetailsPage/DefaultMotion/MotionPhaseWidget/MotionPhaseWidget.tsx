import React from 'react';
import { MotionState } from '@colony/colony-js';

import { ColonyAction } from '~types';
import StakingWidget, { StakingWidgetProvider } from './StakingWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionPhaseWidget';

interface MotionPhaseWidgetProps {
  actionData: ColonyAction;
}

const MotionPhaseWidget = ({
  actionData: { motionData },
}: MotionPhaseWidgetProps) => {
  if (!motionData) {
    return null;
  }

  switch (motionData.motionState) {
    case MotionState.Staking: {
      return (
        <StakingWidgetProvider motionData={motionData}>
          <StakingWidget />
        </StakingWidgetProvider>
      );
    }
    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
