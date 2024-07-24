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
import PaymentOverview from '../PaymentStepDetailsBlock/partials/PaymentOverview/PaymentOverview.tsx';
import { getSummedTokens } from '../PaymentStepDetailsBlock/utils.ts';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import MilestoneReleaseModal from './partials/MilestoneReleaseModal/MilestoneReleaseModal.tsx';
import { type MilestoneItem } from './partials/MilestoneReleaseModal/types.ts';
import ReleasedBox from './partials/ReleasedBox/ReleasedBox.tsx';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedPaymentStep';

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

export interface ReleaseActionItem {
  userAddress: string;
  createdAt: string;
  slotIds: number[];
}

interface StagedPaymentStepProps {
  expectedStepKey: ExpenditureStep | null;
  items: MilestoneItem[];
  expenditure: Expenditure;
  releaseActions: ReleaseActionItem[];
}

const StagedPaymentStep: FC<StagedPaymentStepProps> = ({
  expectedStepKey,
  items,
  expenditure,
  releaseActions,
}) => {
  const {
    toggleOnMilestoneModal: showModal,
    isMilestoneModalOpen,
    toggleOffMilestoneModal: hideModal,
    selectedMilestones,
    setSelectedMilestones,
  } = usePaymentBuilderContext();

  const firstMilestone = items
    .sort((a, b) => a.slotId - b.slotId)
    .filter((item) => !item.isClaimed)[0];

  const releaseNextMilestone = () => {
    setSelectedMilestones([firstMilestone]);
    showModal();
  };

  const notReleasedMilestones = items.filter((item) => !item.isClaimed);
  const releasedMilestones = items.filter((item) => item.isClaimed);
  const hasAllMilestonesReleased = isEqual(
    notReleasedMilestones,
    selectedMilestones,
  );

  const totals = getSummedTokens(items);
  const paid = getSummedTokens(items, true);
  const allPaid = items.every(({ isClaimed }) => isClaimed);

  return (
    <>
      {allPaid ? (
        <PaymentOverview
          className="rounded-lg border border-gray-200 bg-base-white p-[1.125rem]"
          total={totals}
          paid={paid}
        />
      ) : (
        <>
          {releasedMilestones.length > 0 && (
            <ReleasedBox
              items={releasedMilestones}
              releaseActions={releaseActions}
            />
          )}
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
        </>
      )}
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

StagedPaymentStep.displayName = displayName;

export default StagedPaymentStep;
