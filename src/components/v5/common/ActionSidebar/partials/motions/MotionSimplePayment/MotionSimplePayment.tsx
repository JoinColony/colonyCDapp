import React, { FC, useMemo, useState } from 'react';
import { formatText } from '~utils/intl';
import Stepper from '~v5/shared/Stepper';
import FinalizeStep from './steps/FinalizeStep';
import OutcomeStep from './steps/OutcomeStep';
import RevealStep from './steps/RevealStep';
import StakingStep from './steps/StakingStep';
import VotingStep from './steps/VotingStep';

const MotionSimplePayment: FC = () => {
  // @todo: pass current step to the state when other steps will be available
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const items = useMemo(
    () => [
      {
        key: '1',
        content: <StakingStep />,
        heading: {
          label: formatText({ id: 'motion.staking.label' }) || '',
        },
      },
      {
        key: '2',
        content: <VotingStep />,
        heading: {
          label: formatText({ id: 'motion.voting.label' }) || '',
        },
        // @todo: add a condition to be required if staking won't go directly to finalize step
        isOptional: true,
      },
      {
        key: '2.5',
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
        key: '3',
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
        key: '4',
        content: <FinalizeStep />,
        heading: {
          label: formatText({ id: 'motion.finalize.label' }) || '',
        },
      },
    ],
    [],
  );

  return (
    <Stepper
      activeStepIndex={activeStepIndex}
      setActiveStepIndex={setActiveStepIndex}
      items={items}
    />
  );
};

export default MotionSimplePayment;
