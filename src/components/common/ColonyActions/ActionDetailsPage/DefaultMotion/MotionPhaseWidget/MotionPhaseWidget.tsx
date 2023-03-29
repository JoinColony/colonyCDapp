import React from 'react';

import { ColonyAction, ColonyActionType } from '~types';
import { MotionState } from '~utils/colonyMotions';

import FinalizeMotion from './FinalizeMotion';
import StakingWidget, { StakingWidgetProvider } from './StakingWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.MotionPhaseWidget';

interface MotionPhaseWidgetProps {
  actionData: ColonyAction;
  motionState: MotionState;
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
}

const MotionPhaseWidget = ({
  actionData,
  motionState,
  ...rest
}: MotionPhaseWidgetProps) => {
  const { motionData, type, amount, fromDomain } = actionData;

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

    case MotionState.Passed: {
      if (!motionData.isFinalized) {
        return (
          <FinalizeMotion
            amount={amount}
            motionData={motionData}
            requiresDomainFunds={
              !!fromDomain &&
              !!amount &&
              type !== ColonyActionType.MintTokensMotion
            }
            {...rest}
          />
        );
      }

      return <div>claim!</div>;
    }

    /* Extend with other widgets as they get ported. */

    default: {
      return null;
    }
  }
};

MotionPhaseWidget.displayName = displayName;

export default MotionPhaseWidget;
