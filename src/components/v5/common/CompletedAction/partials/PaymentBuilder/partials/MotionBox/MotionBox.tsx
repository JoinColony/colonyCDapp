import { MotionState as NetworkMotionState } from '@colony/colony-js';
import React, { type FC, useEffect, useState } from 'react';

import { type MotionAction } from '~types/motions.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MotionProvider from '~v5/common/ActionSidebar/partials/Motions/partials/MotionProvider/index.ts';
import FinalizeStep from '~v5/common/ActionSidebar/partials/Motions/steps/FinalizeStep/FinalizeStep.tsx';
import OutcomeStep from '~v5/common/ActionSidebar/partials/Motions/steps/OutcomeStep/OutcomeStep.tsx';
import RevealStep from '~v5/common/ActionSidebar/partials/Motions/steps/RevealStep/RevealStep.tsx';
import StakingStep from '~v5/common/ActionSidebar/partials/Motions/steps/StakingStep/index.ts';
import VotingStep from '~v5/common/ActionSidebar/partials/Motions/steps/VotingStep/VotingStep.tsx';

import { type Steps, CustomStep, type MotionBoxProps } from './types.ts';

const MotionBox: FC<MotionBoxProps> = ({ transactionId }) => {
  // const { canInteract } = useAppContext();
  const {
    action,
    networkMotionState,
    motionState,
    // refetchMotionState,
    // loadingAction,
    startPollingForAction,
    stopPollingForAction,
    refetchAction,
  } = useGetColonyAction(transactionId);

  const { motionData } = action || {};

  const [activeStepKey, setActiveStepKey] = useState<Steps>(networkMotionState);

  const motionFinished =
    networkMotionState === NetworkMotionState.Finalizable ||
    networkMotionState === NetworkMotionState.Finalized ||
    networkMotionState === NetworkMotionState.Failed;

  useEffect(() => {
    startPollingForAction(getSafePollingInterval());
    setActiveStepKey(networkMotionState);
    if (motionFinished) {
      setActiveStepKey(CustomStep.Finalize);
    }
    return () => stopPollingForAction();
  }, [
    motionFinished,
    networkMotionState,
    startPollingForAction,
    stopPollingForAction,
  ]);

  return (
    <MotionProvider
      motionAction={action as MotionAction}
      startPollingAction={startPollingForAction}
      stopPollingAction={stopPollingForAction}
    >
      <StakingStep isActive={activeStepKey === NetworkMotionState.Staking} />
      <VotingStep
        actionData={action as MotionAction}
        startPollingAction={startPollingForAction}
        stopPollingAction={stopPollingForAction}
        transactionId={transactionId}
      />
      <RevealStep
        motionData={motionData}
        motionState={networkMotionState}
        startPollingAction={startPollingForAction}
        stopPollingAction={stopPollingForAction}
        transactionId={transactionId}
      />
      <OutcomeStep motionData={motionData} />
      <FinalizeStep
        actionData={action as MotionAction}
        startPollingAction={startPollingForAction}
        stopPollingAction={stopPollingForAction}
        refetchAction={refetchAction}
        motionState={motionState}
      />
    </MotionProvider>
  );
};

export default MotionBox;
