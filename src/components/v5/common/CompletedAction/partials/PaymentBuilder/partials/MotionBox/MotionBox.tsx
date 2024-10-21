import { MotionState as NetworkMotionState } from '@colony/colony-js';
import React, { type FC, useEffect, useState, useMemo } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { type MotionAction } from '~types/motions.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MotionProvider from '~v5/common/ActionSidebar/partials/Motions/partials/MotionProvider/index.ts';
import FinalizeStep from '~v5/common/ActionSidebar/partials/Motions/steps/FinalizeStep/FinalizeStep.tsx';
import RevealStep from '~v5/common/ActionSidebar/partials/Motions/steps/RevealStep/RevealStep.tsx';
import StakingStep from '~v5/common/ActionSidebar/partials/Motions/steps/StakingStep/index.ts';
import VotingStep from '~v5/common/ActionSidebar/partials/Motions/steps/VotingStep/VotingStep.tsx';
import MotionWidgetSkeleton from '~v5/shared/MotionWidgetSkeleton/MotionWidgetSkeleton.tsx';

import { type Steps, CustomStep, type MotionBoxProps } from './types.ts';

const MotionBox: FC<MotionBoxProps> = ({
  transactionId,
  isActionCancelled,
}) => {
  const { canInteract } = useAppContext();
  const {
    action,
    networkMotionState,
    motionState,
    loadingAction,
    startPollingForAction,
    stopPollingForAction,
    refetchAction,
  } = useGetColonyAction(transactionId);

  const { motionData, rootHash } = action || {};

  const { motionStakes } = motionData || {};

  const [activeStepKey, setActiveStepKey] = useState<Steps>(networkMotionState);

  const motionFinished =
    networkMotionState === NetworkMotionState.Finalizable ||
    networkMotionState === NetworkMotionState.Finalized ||
    networkMotionState === NetworkMotionState.Failed;

  useEffect(() => {
    startPollingForAction();
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

  const items = useMemo(() => {
    return [
      {
        key: NetworkMotionState.Staking,
        content: (
          <StakingStep
            isActive={activeStepKey === NetworkMotionState.Staking}
            isActionCancelled={isActionCancelled}
          />
        ),
        isVisible: activeStepKey === NetworkMotionState.Staking,
      },
      {
        key: NetworkMotionState.Submit,
        content: (
          <VotingStep
            actionData={action as MotionAction}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            transactionId={transactionId}
            isActionCancelled={isActionCancelled}
          />
        ),
        isVisible: motionState === MotionState.Voting && motionStakes,
      },
      {
        key: NetworkMotionState.Reveal,
        content: (
          <RevealStep
            motionData={motionData}
            motionState={networkMotionState}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            transactionId={transactionId}
            rootHash={rootHash}
            isActionCancelled={isActionCancelled}
          />
        ),
        isVisible: activeStepKey === NetworkMotionState.Reveal && motionStakes,
      },
      {
        key: CustomStep.Finalize,
        content: motionState && (
          <FinalizeStep
            actionData={action as MotionAction}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            refetchAction={refetchAction}
            motionState={motionState}
          />
        ),
        isVisible:
          activeStepKey === CustomStep.Finalize && motionStakes && canInteract,
      },
    ];
  }, [
    action,
    activeStepKey,
    canInteract,
    motionData,
    motionStakes,
    motionState,
    networkMotionState,
    refetchAction,
    rootHash,
    startPollingForAction,
    stopPollingForAction,
    transactionId,
    isActionCancelled,
  ]);

  return !loadingAction ? (
    <MotionProvider
      motionAction={action as MotionAction}
      startPollingAction={startPollingForAction}
      stopPollingAction={stopPollingForAction}
    >
      {items.map(({ key, content, isVisible }) => (
        <React.Fragment key={key}>{isVisible && content}</React.Fragment>
      ))}
    </MotionProvider>
  ) : (
    <MotionWidgetSkeleton />
  );
};

export default MotionBox;
