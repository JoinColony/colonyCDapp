import React, { FC, useEffect, useMemo, useState } from 'react';

import { MotionState } from '~utils/colonyMotions';
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
import { MotionSimplePaymentProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment';

const MotionSimplePayment: FC<MotionSimplePaymentProps> = ({
  transactionId,
}) => {
  const { action, motionState, refetchMotionState, loadingAction } =
    useGetColonyAction(transactionId);
  const { motionData } = action || {};
  const { motionId = '', motionStakes } = motionData || {};
  const [activeStepKey, setActiveStepKey] = useState(MotionState.Staking);

  const motionStateEnum = getEnumValueFromKey(
    MotionState,
    motionState,
    MotionState.Staking,
  );

  useEffect(() => {
    setActiveStepKey(motionStateEnum);
  }, [motionStateEnum]);

  // @todo: add missing steps
  const items = useMemo(
    () =>
      loadingAction
        ? []
        : [
            {
              key: MotionState.Staking,
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
              key: MotionState.Voting,
              content: <VotingStep />,
              heading: {
                label: formatText({ id: 'motion.voting.label' }) || '',
              },
              // @todo: add a condition to be required if staking won't go directly to finalize step
              isOptional: true,
            },
            {
              key: MotionState.Reveal,
              content: <RevealStep />,
              heading: {
                label: formatText({ id: 'motion.reveal.label' }) || '',
              },
              // @todo: add a condition to show when voting step is active
              isHidden: true,
              // @todo: chnage to false when visible
              isOptional: true,
            },
            {
              // @todo: change to MotionState when the outcome is known and revealed
              key: MotionState.Objection,
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
              key: MotionState.Passed,
              content: <FinalizeStep />,
              heading: {
                label: formatText({ id: 'motion.finalize.label' }) || '',
              },
            },
          ],
    [
      loadingAction,
      motionId,
      motionStakes,
      motionStateEnum,
      refetchMotionState,
    ],
  );

  // @todo: replace with spinner
  return loadingAction ? (
    <div>Loading</div>
  ) : (
    <Stepper<MotionState>
      activeStepKey={activeStepKey}
      setActiveStepKey={setActiveStepKey}
      items={items}
    />
  );
};

MotionSimplePayment.displayName = displayName;

export default MotionSimplePayment;
