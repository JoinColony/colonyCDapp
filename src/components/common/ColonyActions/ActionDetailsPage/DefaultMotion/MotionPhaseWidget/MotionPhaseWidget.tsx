import React from 'react';
import { MotionState } from '@colony/colony-js';

import StakingWidget from './StakingWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionPhaseWidget';

interface MotionPhaseWidgetProps {
  motionState: MotionState;
}

const MotionPhaseWidget = ({ motionState }: MotionPhaseWidgetProps) => {
  switch (motionState) {
    case MotionState.Staking: {
      return <StakingWidget />;
    }

    /* Extend with other widgets as they get ported. */

    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
