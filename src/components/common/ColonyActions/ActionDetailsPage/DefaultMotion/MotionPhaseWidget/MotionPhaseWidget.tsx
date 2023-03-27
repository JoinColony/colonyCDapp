import React from 'react';
import { MotionState } from '@colony/colony-js';

import { ColonyAction } from '~types';
import StakingWidget from './StakingWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionPhaseWidget';

interface MotionPhaseWidgetProps {
  actionData: ColonyAction;
  motionState: MotionState;
}

const MotionPhaseWidget = ({
  actionData,
  motionState,
}: MotionPhaseWidgetProps) => {
  const { motionData } = actionData;

  if (!motionData) {
    /*
     * Will not happen. Undefined motion data will result in the invalid transaction view being
     * rendered by the parent. But, this is cleaner than creating a custom ColonyAction type to reflect
     * the fact that motion data is defined here.
     */
    return null;
  }

  switch (motionState) {
    case MotionState.Staking: {
      return <StakingWidget motionData={motionData} />;
    }

    /* Extend with other widgets as they get ported. */

    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
