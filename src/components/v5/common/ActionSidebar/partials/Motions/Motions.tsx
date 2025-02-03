import {
  Extension,
  MotionState as NetworkMotionState,
} from '@colony/colony-js';
import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import { right as RightPlacementType } from '@popperjs/core';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useEffect, useMemo, useState } from 'react';

import { useActionContext } from '~context/ActionContext/ActionContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import UninstalledMessage from '~v5/common/UninstalledMessage/index.ts';
import Stepper from '~v5/shared/Stepper/index.ts';

import { MotionStep } from './MotionStep/index.ts';
import MotionCountDownTimer from './partials/MotionCountDownTimer/index.ts';
import MotionProvider from './partials/MotionProvider/MotionProvider.tsx';
import {
  type Steps,
  CustomStep,
  type ICompletedMotionAction,
} from './types.ts';
import {
  getFinalizeStepTooltipText,
  getOutcomeStepTooltipText,
  getRevealStepTooltipText,
  getStakingStepTooltipText,
  getVotingStepTooltipText,
} from './utils.ts';

const displayName = 'v5.common.ActionSidebar.partials.Motions';

const Motions: FC<ICompletedMotionAction> = ({ action, motionData }) => {
  const { motionState, refetchMotionState, networkMotionState, loadingAction } =
    useActionContext();

  const { canInteract } = useAppContext();

  const { loading: loadingExtensions, votingReputationExtensionData } =
    useEnabledExtensions();

  const isVotingReputationExtensionUninstalled =
    !loadingExtensions && !votingReputationExtensionData;

  const {
    motionId = '',
    motionStakes,
    motionStateHistory,
    remainingStakes,
  } = motionData;

  const [activeStepKey, setActiveStepKey] = useState<Steps>(networkMotionState);

  const { hasPassed, endedAt } = motionStateHistory ?? {};

  const motionFinished =
    networkMotionState === NetworkMotionState.Finalizable ||
    networkMotionState === NetworkMotionState.Finalized ||
    networkMotionState === NetworkMotionState.Failed;

  const motionOutcomeAvailable = motionFinished && endedAt;

  useEffect(() => {
    setActiveStepKey(networkMotionState);

    if (motionFinished) {
      setActiveStepKey(CustomStep.Finalize);
    }
  }, [motionFinished, networkMotionState]);

  const { percentage } = motionStakes || {};
  const { nay, yay } = percentage || {};

  const objectingStakesPercentageValue = Number(nay) || 0;
  const supportingStakesPercentageValue = Number(yay) || 0;

  const isFullyStaked =
    objectingStakesPercentageValue === 100 &&
    supportingStakesPercentageValue === 100;

  const motionStakedAndFinalizable =
    motionFinished &&
    remainingStakes
      .reduce((totalStakes, stake) => totalStakes.add(stake), BigNumber.from(0))
      .gt(0);

  const items = useMemo(() => {
    if (
      loadingAction ||
      loadingExtensions ||
      isVotingReputationExtensionUninstalled
    ) {
      return [];
    }
    return [
      {
        key: NetworkMotionState.Staking,
        content: (
          <MotionStep.Staking
            isActive={activeStepKey === NetworkMotionState.Staking}
          />
        ),
        heading: {
          label: formatText({ id: 'motion.staking.label' }) || '',
          decor:
            activeStepKey === NetworkMotionState.Staking &&
            motionStakes &&
            motionState ? (
              <MotionCountDownTimer
                motionState={motionState}
                motionId={motionId}
                motionStakes={motionStakes}
                refetchMotionState={refetchMotionState}
              />
            ) : null,
          tooltipProps: {
            tooltipContent: getStakingStepTooltipText(
              networkMotionState,
              motionData,
            ),
            placement: RightPlacementType,
            className: 'z-base',
          },
        },
      },
      {
        key: NetworkMotionState.Submit,
        content: <MotionStep.Voting action={action} motionData={motionData} />,
        heading: {
          label: formatText({ id: 'motion.voting.label' }) || '',
          decor:
            motionState === MotionState.Voting && motionStakes ? (
              <MotionCountDownTimer
                motionState={motionState}
                motionId={motionId}
                motionStakes={motionStakes}
                refetchMotionState={refetchMotionState}
              />
            ) : null,
          tooltipProps: {
            tooltipContent: getVotingStepTooltipText(
              networkMotionState,
              motionData,
            ),
            placement: RightPlacementType,
            className: 'z-base',
          },
        },
        isOptional: !isFullyStaked,
        isHidden: motionStakedAndFinalizable,
      },
      {
        key: NetworkMotionState.Reveal,
        content: (
          <MotionStep.Reveal action={action} motionState={networkMotionState} />
        ),
        heading: {
          label: formatText({ id: 'motion.reveal.label' }) || '',
          decor:
            activeStepKey === NetworkMotionState.Reveal &&
            motionStakes &&
            motionState ? (
              <MotionCountDownTimer
                motionState={motionState}
                motionId={motionId}
                motionStakes={motionStakes}
                refetchMotionState={refetchMotionState}
              />
            ) : null,
          tooltipProps: {
            tooltipContent: getRevealStepTooltipText(
              networkMotionState,
              motionData,
            ),
            placement: RightPlacementType,
            className: 'z-base',
          },
        },
        isHidden: motionStakedAndFinalizable,
      },
      {
        key: CustomStep.StakedMotionOutcome,
        content: <div />,
        heading: {
          icon:
            (motionStateHistory?.hasPassed && ThumbsUp) ||
            (motionStateHistory?.hasFailed && ThumbsDown) ||
            (motionStateHistory?.hasFailedNotFinalizable && ThumbsDown) ||
            undefined,
          label:
            (motionStateHistory?.hasPassed &&
              formatText({ id: 'motion.passed.label' })) ||
            (motionStateHistory?.hasFailed &&
              formatText({ id: 'motion.failed.label' })) ||
            (motionStateHistory?.hasFailedNotFinalizable &&
              formatText({ id: 'motion.failed.label' })) ||
            formatText({ id: 'motion.outcome.label' }) ||
            '',
          className: clsx({
            'border-purple-400 bg-base-white text-purple-400 md:enabled:hover:border-purple-400 md:enabled:hover:bg-purple-400 md:enabled:hover:text-base-white':
              motionStateHistory?.hasPassed,
            'border-negative-400 bg-base-white text-negative-400 md:enabled:hover:border-negative-400 md:enabled:hover:bg-negative-400 md:enabled:hover:text-base-white':
              motionStateHistory?.hasFailed ||
              motionStateHistory?.hasFailedNotFinalizable,
          }),
        },
        isSkipped: motionStakedAndFinalizable,
        isHidden: !motionStakedAndFinalizable,
      },
      {
        key: CustomStep.VotedMotionOutcome,
        content: <MotionStep.Outcome motionData={motionData} />,
        heading: {
          icon: motionOutcomeAvailable
            ? (hasPassed && ThumbsUp) || ThumbsDown
            : undefined,
          label: motionOutcomeAvailable
            ? (hasPassed && formatText({ id: 'motion.support.wins.label' })) ||
              formatText({ id: 'motion.oppose.wins.label' })
            : formatText({ id: 'motion.outcome.label' }) || '',
          className: clsx('z-base', {
            'border-purple-400 bg-base-white text-purple-400 md:enabled:hover:border-purple-400 md:enabled:hover:bg-purple-400 md:enabled:hover:text-base-white':
              motionOutcomeAvailable && hasPassed,
            'border-negative-400 bg-base-white text-negative-400 md:enabled:hover:border-negative-400 md:enabled:hover:bg-negative-400 md:enabled:hover:text-base-white':
              motionOutcomeAvailable && !hasPassed,
          }),
          highlightedClassName: clsx({
            '!border-purple-400 !bg-purple-400 !text-base-white':
              motionOutcomeAvailable && hasPassed,
            '!border-negative-400 !bg-negative-400 !text-base-white':
              motionOutcomeAvailable && !hasPassed,
          }),
          tooltipProps: {
            tooltipContent: getOutcomeStepTooltipText(
              networkMotionState,
              motionData,
            ),
            placement: RightPlacementType,
            className: 'z-base',
          },
        },
        isOptional: true,
        isHidden: motionStakedAndFinalizable,
      },
      {
        key: CustomStep.Finalize,
        content: (
          <MotionStep.Finalize
            action={action}
            motionData={motionData}
            motionState={motionState}
          />
        ),
        heading: {
          label: formatText({ id: 'motion.finalize.label' }) || '',
          tooltipProps: {
            tooltipContent: getFinalizeStepTooltipText(
              networkMotionState,
              motionData,
            ),
            placement: RightPlacementType,
            className: 'z-base',
          },
        },
        isSkipped: !canInteract,
      },
    ];
  }, [
    action,
    activeStepKey,
    canInteract,
    hasPassed,
    isFullyStaked,
    isVotingReputationExtensionUninstalled,
    loadingAction,
    loadingExtensions,
    motionData,
    motionId,
    motionOutcomeAvailable,
    motionStakedAndFinalizable,
    motionStakes,
    motionState,
    motionStateHistory?.hasFailed,
    motionStateHistory?.hasFailedNotFinalizable,
    motionStateHistory?.hasPassed,
    networkMotionState,
    refetchMotionState,
  ]);

  if (
    networkMotionState === NetworkMotionState.Null ||
    isVotingReputationExtensionUninstalled
  ) {
    return <UninstalledMessage extension={Extension.VotingReputation} />;
  }

  return loadingAction || loadingExtensions ? (
    <SpinnerLoader appearance={{ size: 'medium' }} />
  ) : (
    <MotionProvider action={action} motionData={motionData}>
      <Stepper<Steps>
        activeStepKey={activeStepKey}
        setActiveStepKey={setActiveStepKey}
        items={items}
      />
    </MotionProvider>
  );
};

Motions.displayName = displayName;

export default Motions;
