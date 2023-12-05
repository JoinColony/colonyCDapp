import React, { FC, useEffect, useMemo, useState } from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';
import clsx from 'clsx';
import { BigNumber } from 'ethers';

import { SpinnerLoader } from '~shared/Preloaders';
import { useGetColonyAction } from '~v5/common/ActionSidebar/hooks/useGetColonyAction';
import Stepper from '~v5/shared/Stepper';

import { getMotionState, MotionState, MotionVote } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { formatText } from '~utils/intl';
import { getSafePollingInterval } from '~utils/queries';
import { useAppContext } from '~hooks';
import { MotionAction } from '~types/motions';

import MotionCountDownTimer from './partials/MotionCountDownTimer';
import MotionProvider from './partials/MotionProvider/MotionProvider';
import FinalizeStep from './steps/FinalizeStep';
import OutcomeStep from './steps/OutcomeStep';
import RevealStep from './steps/RevealStep';
import StakingStep from './steps/StakingStep';
import VotingStep from './steps/VotingStep';
import { MotionsProps, Steps, CustomStep } from './types';

const displayName = 'v5.common.ActionSidebar.partials.Motions';

const Motions: FC<MotionsProps> = ({ transactionId }) => {
  const { wallet, user } = useAppContext();
  const canInteract = !!wallet && !!user;
  const {
    action,
    motionState,
    refetchMotionState,
    loadingAction,
    startPollingForAction,
    stopPollingForAction,
    refetchAction,
  } = useGetColonyAction(transactionId);

  const { motionData } = action || {};
  const {
    motionId = '',
    motionStakes,
    requiredStake = '',
    motionStateHistory,
  } = motionData || {};

  const networkMotionStateEnum = getEnumValueFromKey(
    NetworkMotionState,
    motionState,
  );

  const [activeStepKey, setActiveStepKey] = useState<Steps>(
    networkMotionStateEnum,
  );

  const motionFinished =
    motionState === NetworkMotionState.Finalizable ||
    motionState === NetworkMotionState.Finalized ||
    motionState === NetworkMotionState.Failed;

  useEffect(() => {
    startPollingForAction(getSafePollingInterval());
    setActiveStepKey(networkMotionStateEnum);
    if (motionFinished) {
      setActiveStepKey(CustomStep.Finalize);
    }
    return () => stopPollingForAction();
  }, [
    motionFinished,
    networkMotionStateEnum,
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

  const motionStateEnum: MotionState | undefined = useMemo(() => {
    if (!motionData) return undefined;
    const motionStakesRaw = motionData?.motionStakes?.raw;
    const revealedVotesPercentage = motionData?.revealedVotes.percentage || '';

    if (
      activeStepKey === NetworkMotionState.Finalizable &&
      BigNumber.from(motionStakesRaw?.nay).gte(requiredStake) &&
      BigNumber.from(motionStakesRaw?.yay).gte(requiredStake)
    ) {
      if (
        BigNumber.from(revealedVotesPercentage?.yay).gt(
          revealedVotesPercentage?.nay,
        )
      ) {
        return MotionState.Passed;
      }

      return MotionState.Failed;
    }

    return motionData
      ? getMotionState(networkMotionStateEnum, motionData)
      : MotionState.Staking;
  }, [activeStepKey, motionData, networkMotionStateEnum, requiredStake]);

  const revealedVotes = motionData?.revealedVotes?.raw;
  const winningSide: MotionVote = BigNumber.from(revealedVotes?.yay).gt(
    revealedVotes?.nay || '',
  )
    ? MotionVote.Yay
    : MotionVote.Nay;

  const votesHaveBeenRevealed: boolean =
    revealedVotes?.yay !== '0' || revealedVotes?.nay !== '0';
  const hasVotedMotionPassed = motionStateHistory?.hasPassed;
  const hasVotedMotionFaild = motionStateHistory?.hasFailed;

  const motionStakedAndFinalizable =
    motionFinished &&
    motionData?.remainingStakes
      .reduce((totalStakes, stake) => totalStakes.add(stake), BigNumber.from(0))
      .gt(0);

  const items = useMemo(() => {
    if (loadingAction) {
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
            motionStateEnum ? (
              <MotionCountDownTimer
                motionState={motionStateEnum}
                motionId={motionId}
                motionStakes={motionStakes}
                refetchMotionState={refetchMotionState}
              />
            ) : null,
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
            motionStateEnum === MotionState.Voting && motionStakes ? (
              <MotionCountDownTimer
                motionState={motionStateEnum}
                motionId={motionId}
                motionStakes={motionStakes}
                refetchMotionState={refetchMotionState}
              />
            ) : null,
        },
        isOptional: !isFullyStaked,
        isHidden: motionStakedAndFinalizable,
      },
      {
        key: NetworkMotionState.Reveal,
        content: (
          <RevealStep
            motionData={motionData}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            transactionId={transactionId}
          />
        ),
        heading: {
          label: formatText({ id: 'motion.reveal.label' }) || '',
          decor:
            motionStateEnum === MotionState.Reveal && motionStakes ? (
              <MotionCountDownTimer
                motionState={motionStateEnum}
                motionId={motionId}
                motionStakes={motionStakes}
                refetchMotionState={refetchMotionState}
              />
            ) : null,
        },
        isHidden: motionStakedAndFinalizable,
      },
      {
        key: CustomStep.StakedMotionOutcome,
        content: <div />,
        heading: {
          iconName:
            (motionStateHistory?.hasPassed && 'thumbs-up') ||
            (motionStateHistory?.hasFailed && 'thumbs-down') ||
            (motionStateHistory?.hasFailedNotFinalizable && 'thumbs-down') ||
            '',
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
            '!bg-base-white !text-purple-400 border-purple-400':
              motionStateHistory?.hasPassed,
            '!bg-base-white !text-red-400 border-red-400':
              motionStateHistory?.hasFailed ||
              motionStateHistory?.hasFailedNotFinalizable,
          }),
        },
        isSkipped: motionStakedAndFinalizable,
        isHidden: !motionStakedAndFinalizable,
      },
      {
        key: CustomStep.VotedMotionOutcome,
        content: (
          <OutcomeStep motionData={motionData} motionState={motionStateEnum} />
        ),
        heading: {
          iconName:
            (winningSide === MotionVote.Yay && 'thumbs-up') ||
            (hasVotedMotionPassed && 'thumbs-up') ||
            (hasVotedMotionFaild && 'thumbs-down') ||
            '',
          label:
            (hasVotedMotionPassed &&
              formatText({ id: 'motion.support.wins.label' })) ||
            (hasVotedMotionFaild &&
              formatText({ id: 'motion.oppose.wins.label' })) ||
            formatText({ id: 'motion.outcome.label' }) ||
            '',
          className: clsx({
            '!bg-base-white !text-purple-400 border-purple-400':
              hasVotedMotionPassed ||
              (winningSide === MotionVote.Yay && votesHaveBeenRevealed),
            '!bg-base-white !text-red-400 border-red-400':
              (hasVotedMotionFaild && !votesHaveBeenRevealed) ||
              winningSide === MotionVote.Nay,
          }),
        },
        isOptional: true,
        isHidden: motionStakedAndFinalizable,
      },
      {
        key: CustomStep.Finalize,
        content: (
          <FinalizeStep
            actionData={action as MotionAction}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            refetchAction={refetchAction}
            motionState={motionStateEnum}
          />
        ),
        heading: {
          label: formatText({ id: 'motion.finalize.label' }) || '',
        },
        isSkipped: !canInteract,
      },
    ];
  }, [
    loadingAction,
    activeStepKey,
    motionStakes,
    motionStateEnum,
    motionId,
    refetchMotionState,
    action,
    startPollingForAction,
    stopPollingForAction,
    transactionId,
    isFullyStaked,
    motionStakedAndFinalizable,
    motionData,
    motionStateHistory,
    winningSide,
    hasVotedMotionPassed,
    hasVotedMotionFaild,
    votesHaveBeenRevealed,
    refetchAction,
    canInteract,
  ]);

  return loadingAction ? (
    <SpinnerLoader appearance={{ size: 'medium' }} />
  ) : (
    <MotionProvider
      motionAction={action as MotionAction}
      startPollingAction={startPollingForAction}
      stopPollingAction={stopPollingForAction}
    >
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
