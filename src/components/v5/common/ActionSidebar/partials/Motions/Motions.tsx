import React, { FC, useEffect, useMemo, useState } from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import clsx from 'clsx';
import { BigNumber } from 'ethers';
import { getMotionState, MotionState, MotionVote } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { formatText } from '~utils/intl';
import { useGetColonyAction } from '~v5/common/ActionSidebar/hooks/useGetColonyAction';
import Stepper from '~v5/shared/Stepper';

import MotionCountDownTimer from './partials/MotionCountDownTimer';
import FinalizeStep from './steps/FinalizeStep';
import OutcomeStep from './steps/OutcomeStep';
import RevealStep from './steps/RevealStep';
import StakingStep from './steps/StakingStep';
import VotingStep from './steps/VotingStep';
import { MotionsProps } from './types';
import { MotionAction } from '~types/motions';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'v5.common.ActionSidebar.partials.Motions';

const Motions: FC<MotionsProps> = ({ transactionId }) => {
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
  const { motionId = '', motionStakes, requiredStake = '' } = motionData || {};

  const networkMotionStateEnum = getEnumValueFromKey(
    NetworkMotionState,
    motionState,
    NetworkMotionState.Null,
  );

  const [activeStepKey, setActiveStepKey] = useState(networkMotionStateEnum);

  useEffect(() => {
    setActiveStepKey(networkMotionStateEnum);
  }, [networkMotionStateEnum]);

  const motionStateEnum: MotionState | undefined = useMemo(() => {
    if (!motionData) return undefined;
    const motionStakesPercentage = motionData?.motionStakes.percentage;
    const revealedVotesPercentage = motionData?.revealedVotes.percentage || '';

    if (
      activeStepKey === NetworkMotionState.Finalizable &&
      BigNumber.from(motionStakesPercentage).gte(requiredStake) &&
      BigNumber.from(motionStakesPercentage).gte(requiredStake)
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
  }, [motionData]);

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

  // @todo: add missing steps
  const items = useMemo(
    () =>
      loadingAction
        ? []
        : [
            {
              key: NetworkMotionState.Staking,
              content: <StakingStep />,
              heading: {
                label: formatText({ id: 'motion.staking.label' }) || '',
                decor:
                  motionStateEnum === MotionState.Staking && motionStakes ? (
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
              // @todo: add a condition to be required if staking won't go directly to finalize step
              isOptional: true,
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
              // @todo: add a condition to show when voting step is active
              isHidden: false,
              // @todo: chnage to false when visible
              isOptional: true,
            },
            {
              // @todo: change to MotionState when the outcome is known and revealed
              key: NetworkMotionState.Finalizable,
              content: (
                <OutcomeStep
                  motionData={motionData}
                  motionState={motionStateEnum}
                />
              ),
              heading: {
                iconName:
                  (winningSide === MotionVote.Yay && 'thumbs-up') ||
                  (hasMotionPassed && 'thumbs-up') ||
                  (hasMotionFaild && 'thumbs-down') ||
                  '',
                label:
                  (hasMotionPassed &&
                    !votesHaveBeenRevealed &&
                    formatText({ id: 'motion.passed.label' })) ||
                  (hasMotionFaild &&
                    !votesHaveBeenRevealed &&
                    formatText({ id: 'motion.failed.label' })) ||
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
              // @todo: add a condition to be required if staking won't go directly to finalize step
              isOptional: true,
              // @todo: add a condition to hide when voting step is skipped
              isHidden: false,
            },
            {
              key: NetworkMotionState.Finalized,
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
              },
            },
          ],
    [
      action,
      loadingAction,
      motionData,
      motionId,
      motionStakes,
      motionStateEnum,
      refetchAction,
      refetchMotionState,
      startPollingForAction,
      stopPollingForAction,
      transactionId,
      hasMotionPassed,
    ],
  );

  return loadingAction ? (
    <div>
      <SpinnerLoader appearance={{ size: 'medium' }} />
    </div>
  ) : (
    <Stepper<NetworkMotionState>
      activeStepKey={activeStepKey}
      setActiveStepKey={setActiveStepKey}
      items={items}
    />
  );
};

Motions.displayName = displayName;

export default Motions;
