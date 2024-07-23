import { SpinnerGap } from '@phosphor-icons/react';
import { isEqual } from 'lodash';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';

import { ExpenditureStep } from '../PaymentBuilderWidget/types.ts';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import MilestoneReleaseModal from './partials/MilestoneReleaseModal/MilestoneReleaseModal.tsx';
import { type MilestoneItem } from './partials/MilestoneReleaseModal/types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedReleaseStep';

const MSG = defineMessages({
  releaseNextMilestone: {
    id: `${displayName}.releaseNextMilestone`,
    defaultMessage: 'Releases the next milestone payment.',
  },
  releaseNextButton: {
    id: `${displayName}.releaseNextButton`,
    defaultMessage: 'Release next payment',
  },
});

interface StagedReleaseStepProps {
  expectedStepKey: ExpenditureStep | null;
  items: MilestoneItem[];
  expenditure: Expenditure;
}

const StagedReleaseStep: FC<StagedReleaseStepProps> = ({
  expectedStepKey,
  items,
  expenditure,
}) => {
  const {
    toggleOnMilestoneModal: showModal,
    isMilestoneModalOpen,
    toggleOffMilestoneModal: hideModal,
    selectedMilestones,
    setSelectedMilestones,
  } = usePaymentBuilderContext();

  const firstMilestone = items
    .sort((a, b) => a.id - b.id)
    .filter((item) => !item.isReleased)[0];

  const releaseNextMilestone = () => {
    setSelectedMilestones([firstMilestone]);
    showModal();
  };

  const notReleasedMilestones = items.filter((item) => !item.isReleased);
  const hasAllMilestonesReleased = isEqual(
    notReleasedMilestones,
    selectedMilestones,
  );

  return (
    <>
      <StepDetailsBlock
        text={formatText(MSG.releaseNextMilestone)}
        content={
          expectedStepKey === ExpenditureStep.Payment ? (
            <TxButton
              className="max-h-[2.5rem] w-full !text-md"
              rounded="s"
              text={{ id: 'button.pending' }}
              icon={
                <span className="ml-1.5 flex shrink-0">
                  <SpinnerGap className="animate-spin" size={14} />
                </span>
              }
            />
          ) : (
            <Button
              className="w-full"
              onClick={releaseNextMilestone}
              text={formatText(MSG.releaseNextButton)}
            />
          )
        }
      />
      <MilestoneReleaseModal
        items={selectedMilestones}
        expenditure={expenditure}
        isOpen={isMilestoneModalOpen}
        hasAllMilestonesReleased={hasAllMilestonesReleased}
        onClose={hideModal}
      />
    </>
  );
};

StagedReleaseStep.displayName = displayName;

export default StagedReleaseStep;
