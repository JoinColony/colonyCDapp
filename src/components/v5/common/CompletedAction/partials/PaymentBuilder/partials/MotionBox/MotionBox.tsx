import { MotionState as NetworkMotionState } from '@colony/colony-js';
import React, { type FC, useEffect, useState, useMemo } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import { MotionStep } from '~v5/common/ActionSidebar/partials/Motions/MotionStep/index.ts';
import StakingStep from '~v5/common/ActionSidebar/partials/Motions/MotionStep/StakingStep/index.ts';
import MotionProvider from '~v5/common/ActionSidebar/partials/Motions/partials/MotionProvider/index.ts';
import MotionWidgetSkeleton from '~v5/shared/MotionWidgetSkeleton/MotionWidgetSkeleton.tsx';

import { type Steps, CustomStep, type MotionBoxProps } from './types.ts';

const MotionBox: FC<MotionBoxProps> = ({
  transactionId,
  isActionCancelled,
}) => {
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
            isActionCancelled={isActionCancelled}
          />
        ),
        isVisible: activeStepKey === NetworkMotionState.Staking,
      },
      {
        key: NetworkMotionState.Submit,
        content:
          action && motionData ? (
            <MotionStep.Voting
              action={action}
              motionData={motionData}
              isActionCancelled={isActionCancelled}
            />
          ) : null,
        isVisible: motionState === MotionState.Voting && motionStakes,
      },
      {
        key: NetworkMotionState.Reveal,
        content: action ? (
          <MotionStep.Reveal
            action={action}
            motionState={networkMotionState}
            isActionCancelled={isActionCancelled}
          />
        ) : null,
        isVisible: activeStepKey === NetworkMotionState.Reveal && motionStakes,
      },
      {
        key: CustomStep.Finalize,
        content:
          action && motionData && motionState ? (
            <MotionStep.Finalize
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
    isActionCancelled,
  ]);

  return !loadingAction && action && motionData ? (
    <MotionProvider action={action} motionData={motionData}>
      {items.map(({ key, content, isVisible }) => (
        <React.Fragment key={key}>{isVisible && content}</React.Fragment>
      ))}
    </MotionProvider>
  ) : (
    <MotionWidgetSkeleton />
  );
};

export default MotionBox;
