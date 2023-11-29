import React, { FC, useEffect, useMemo, useState } from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';
import clsx from 'clsx';
import { BigNumber } from 'ethers';

import { SpinnerLoader } from '~shared/Preloaders';
import { useGetColonyAction } from '~v5/common/ActionSidebar/hooks/useGetColonyAction';
import Stepper from '~v5/shared/Stepper';
import { StepperItem } from '~v5/shared/Stepper/types';

import { getMotionState, MotionState, MotionVote } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { formatText } from '~utils/intl';
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
    undefined,
  );

  const [activeStepKey, setActiveStepKey] = useState<Steps>(
    networkMotionStateEnum,
  );

  useEffect(() => {
    startPollingForAction(1000);
    setActiveStepKey(networkMotionStateEnum);
    return () => stopPollingForAction();
  }, [networkMotionStateEnum, startPollingForAction, stopPollingForAction]);

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
  const hasMotionPassed = motionStateEnum === MotionState.Passed;
  const hasMotionFaild = motionStateEnum === MotionState.Failed;

  const motionStakedAndFinalizable =
    (motionState === NetworkMotionState.Finalizable ||
      motionState === NetworkMotionState.Finalized ||
      motionState === NetworkMotionState.Failed) &&
    !motionStateHistory?.hasVoted;

  const items = useMemo(() => {
    if (loadingAction) {
      return [];
    }
    const itemsEntries: StepperItem<Steps>[] = [
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
            ) : undefined,
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
            ) : undefined,
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
            ) : undefined,
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
            (hasMotionPassed && 'thumbs-up') ||
            (hasMotionFaild && 'thumbs-down') ||
            '',
          label:
            (winningSide === MotionVote.Yay &&
              votesHaveBeenRevealed &&
              formatText({ id: 'motion.support.wins.label' })) ||
            (winningSide === MotionVote.Nay &&
              votesHaveBeenRevealed &&
              formatText({ id: 'motion.oppose.wins.label' })) ||
            formatText({ id: 'motion.outcome.label' }) ||
            '',
          className: clsx({
            '!bg-base-white !text-purple-400 border-purple-400':
              hasMotionPassed ||
              (winningSide === MotionVote.Yay && votesHaveBeenRevealed),
            '!bg-base-white !text-red-400 border-red-400':
              (hasMotionFaild && !votesHaveBeenRevealed) ||
              winningSide === MotionVote.Nay,
          }),
        },
        isOptional: true,
        isHidden: motionStakedAndFinalizable,
      },
    ];
    if (
      networkMotionStateEnum === NetworkMotionState.Finalizable ||
      networkMotionStateEnum === NetworkMotionState.Finalized ||
      networkMotionStateEnum === NetworkMotionState.Failed
    ) {
      itemsEntries.push({
        key: networkMotionStateEnum,
        content: (
          <FinalizeStep
            actionData={action as MotionAction}
            startPollingAction={startPollingForAction}
            stopPollingAction={stopPollingForAction}
            refetchAction={refetchAction}
          />
        ),
        heading: {
          label: formatText({ id: 'motion.finalize.label' }) || '',
          decor: undefined,
        },
        isSkipped: !canInteract,
      });
    }
    return itemsEntries;
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
    hasMotionPassed,
    hasMotionFaild,
    votesHaveBeenRevealed,
    networkMotionStateEnum,
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
