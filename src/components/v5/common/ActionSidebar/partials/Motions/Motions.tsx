import React, { FC, useEffect, useMemo, useState } from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { getMotionState, MotionState } from '~utils/colonyMotions';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { formatText } from '~utils/intl';
import { MotionAction } from '~types/motions';
import { SpinnerLoader } from '~shared/Preloaders';
import { useGetColonyAction } from '~v5/common/ActionSidebar/hooks/useGetColonyAction';
import Stepper from '~v5/shared/Stepper';

import MotionCountDownTimer from './partials/MotionCountDownTimer';
import { MotionProvider } from './partials/MotionProvider/MotionProvider';
import FinalizeStep from './steps/FinalizeStep';
import OutcomeStep from './steps/OutcomeStep';
import RevealStep from './steps/RevealStep';
import StakingStep from './steps/StakingStep';
import VotingStep from './steps/VotingStep';
import { MotionsProps } from './types';

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
  const { motionId = '', motionStakes } = motionData || {};

  const networkMotionStateEnum = getEnumValueFromKey(
    NetworkMotionState,
    motionState,
    NetworkMotionState.Null,
  );

  const motionStateEnum = motionData
    ? getMotionState(networkMotionStateEnum, motionData)
    : MotionState.Staking;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeStepKey, setActiveStepKey] = useState(networkMotionStateEnum);

  useEffect(() => {
    startPollingForAction(1000);
    setActiveStepKey(networkMotionStateEnum);
  }, [networkMotionStateEnum, startPollingForAction]);

  const { percentage } = motionStakes || {};
  const { nay, yay } = percentage || {};

  const objectingStakesPercentageValue = Number(nay) || 0;
  const supportingStakesPercentageValue = Number(yay) || 0;

  const isFullyStaked =
    objectingStakesPercentageValue === 100 &&
    supportingStakesPercentageValue === 100;

  // @todo: add missing steps
  const items = useMemo(
    () =>
      loadingAction
        ? []
        : [
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
                  motionStakes ? (
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
              content: <OutcomeStep />,
              heading: {
                // @todo: chnage label and styling when the outcome is known and revealed
                label: formatText({ id: 'motion.outcome.label' }) || '',
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
      activeStepKey,
      isFullyStaked,
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
    ],
  );

  return loadingAction ? (
    <SpinnerLoader />
  ) : (
    <MotionProvider
      motionAction={action as MotionAction}
      startPollingAction={startPollingForAction}
      stopPollingAction={stopPollingForAction}
    >
      <Stepper<NetworkMotionState>
        activeStepKey={activeStepKey}
        setActiveStepKey={setActiveStepKey}
        items={items}
      />
    </MotionProvider>
  );
};

Motions.displayName = displayName;

export default Motions;
