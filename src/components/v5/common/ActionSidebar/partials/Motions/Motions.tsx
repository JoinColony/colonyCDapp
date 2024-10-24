import {
  Extension,
  MotionState as NetworkMotionState,
} from '@colony/colony-js';
import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import { right as RightPlacementType } from '@popperjs/core';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useEffect, useMemo, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { type MotionAction } from '~types/motions.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import UninstalledMessage from '~v5/common/UninstalledMessage/index.ts';
import Stepper from '~v5/shared/Stepper/index.ts';

import MotionCountDownTimer from './partials/MotionCountDownTimer/index.ts';
import MotionProvider from './partials/MotionProvider/MotionProvider.tsx';
import FinalizeStep from './steps/FinalizeStep/index.ts';
import OutcomeStep from './steps/OutcomeStep/index.ts';
import RevealStep from './steps/RevealStep/index.ts';
import StakingStep from './steps/StakingStep/index.ts';
import VotingStep from './steps/VotingStep/index.ts';
import { type MotionsProps, type Steps, CustomStep } from './types.ts';
import {
  getFinalizeStepTooltipText,
  getOutcomeStepTooltipText,
  getRevealStepTooltipText,
  getStakingStepTooltipText,
  getVotingStepTooltipText,
} from './utils.ts';

const displayName = 'v5.common.ActionSidebar.partials.Motions';

const Motions: FC<MotionsProps> = ({ transactionId }) => {
  const { canInteract } = useAppContext();
  const {
    action,
    networkMotionState,
    motionState,
    refetchMotionState,
    loadingAction,
    startPollingForAction,
    stopPollingForAction,
    refetchAction,
  } = useGetColonyAction(transactionId);

  const { loading: loadingExtensions, votingReputationExtensionData } =
    useEnabledExtensions();

  const isVotingReputationExtensionUninstalled =
    !loadingExtensions && !votingReputationExtensionData;

  const { motionData, rootHash } = action || {};
  const { motionId = '', motionStakes, motionStateHistory } = motionData || {};

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

  const { percentage } = motionStakes || {};
  const { nay, yay } = percentage || {};

  const objectingStakesPercentageValue = Number(nay) || 0;
  const supportingStakesPercentageValue = Number(yay) || 0;

  const isFullyStaked =
    objectingStakesPercentageValue === 100 &&
    supportingStakesPercentageValue === 100;

  const hasVotedMotionPassed = motionStateHistory?.hasPassed;

  const motionStakedAndFinalizable =
    motionFinished &&
    motionData?.remainingStakes
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
          <StakingStep
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
        content: (
          <VotingStep
            actionData={action as MotionAction}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            transactionId={transactionId}
          />
        ),
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
          <RevealStep
            motionData={motionData}
            motionState={networkMotionState}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            transactionId={transactionId}
            rootHash={rootHash}
          />
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
        content: <OutcomeStep motionData={motionData} />,
        heading: {
          icon: motionFinished
            ? (hasVotedMotionPassed && ThumbsUp) || ThumbsDown
            : undefined,
          label: motionFinished
            ? (hasVotedMotionPassed &&
                formatText({ id: 'motion.support.wins.label' })) ||
              formatText({ id: 'motion.oppose.wins.label' })
            : formatText({ id: 'motion.outcome.label' }) || '',
          className: clsx('z-base', {
            'border-purple-400 bg-base-white text-purple-400 md:enabled:hover:border-purple-400 md:enabled:hover:bg-purple-400 md:enabled:hover:text-base-white':
              motionFinished && hasVotedMotionPassed,
            'border-negative-400 bg-base-white text-negative-400 md:enabled:hover:border-negative-400 md:enabled:hover:bg-negative-400 md:enabled:hover:text-base-white':
              motionFinished && !hasVotedMotionPassed,
          }),
          highlightedClassName: clsx({
            '!border-purple-400 !bg-purple-400 !text-base-white':
              motionFinished && hasVotedMotionPassed,
            '!border-negative-400 !bg-negative-400 !text-base-white':
              motionFinished && !hasVotedMotionPassed,
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
        content: motionState && (
          <FinalizeStep
            actionData={action as MotionAction}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            refetchAction={refetchAction}
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
    loadingAction,
    loadingExtensions,
    isVotingReputationExtensionUninstalled,
    activeStepKey,
    motionStakes,
    motionState,
    motionId,
    refetchMotionState,
    networkMotionState,
    motionData,
    action,
    startPollingForAction,
    stopPollingForAction,
    transactionId,
    isFullyStaked,
    motionStakedAndFinalizable,
    rootHash,
    motionStateHistory?.hasPassed,
    motionStateHistory?.hasFailed,
    motionStateHistory?.hasFailedNotFinalizable,
    motionFinished,
    hasVotedMotionPassed,
    refetchAction,
    canInteract,
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
    <MotionProvider
      motionAction={action as MotionAction}
      startPollingAction={startPollingForAction}
      stopPollingAction={stopPollingForAction}
    >
      <Stepper<Steps>
        activeStepKey={activeStepKey}
        setActiveStepKey={(key: Steps) => setActiveStepKey(key)}
        items={items}
      />
    </MotionProvider>
  );
};

Motions.displayName = displayName;

export default Motions;
