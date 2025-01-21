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

const MotionBox: FC<MotionBoxProps> = ({ transactionId }) => {
  const { canInteract } = useAppContext();
  const { action, networkMotionState, motionState, loadingAction } =
    useGetColonyAction(transactionId);

  const { motionData } = action || {};

  const { motionStakes } = motionData || {};

  const [activeStepKey, setActiveStepKey] = useState<Steps>(networkMotionState);

  const motionFinished =
    networkMotionState === NetworkMotionState.Finalizable ||
    networkMotionState === NetworkMotionState.Finalized ||
    networkMotionState === NetworkMotionState.Failed;

  useEffect(() => {
    setActiveStepKey(networkMotionState);
    if (motionFinished) {
      setActiveStepKey(CustomStep.Finalize);
    }
  }, [motionFinished, networkMotionState]);

  const items = useMemo(() => {
    return [
      {
        key: NetworkMotionState.Staking,
        content: (
          <StakingStep
            isActive={activeStepKey === NetworkMotionState.Staking}
          />
        ),
        isVisible: activeStepKey === NetworkMotionState.Staking,
      },
      {
        key: NetworkMotionState.Submit,
        content:
          action && motionData ? (
            <VotingStep action={action} motionData={motionData} />
          ) : null,
        isVisible: motionState === MotionState.Voting && motionStakes,
      },
      {
        key: NetworkMotionState.Reveal,
        content: action ? (
          <RevealStep action={action} motionState={networkMotionState} />
        ) : null,
        isVisible: activeStepKey === NetworkMotionState.Reveal && motionStakes,
      },
      {
        key: CustomStep.Finalize,
        content:
          action && motionData && motionState ? (
            <FinalizeStep
              action={action}
              motionData={motionData}
              motionState={motionState}
            />
          ) : null,
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
  ]);

  return !loadingAction ? (
    <MotionProvider motionAction={action as MotionAction}>
      {items.map(({ key, content, isVisible }) => (
        <React.Fragment key={key}>{isVisible && content}</React.Fragment>
      ))}
    </MotionProvider>
  ) : (
    <MotionWidgetSkeleton />
  );
};

export default MotionBox;
