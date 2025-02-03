import clsx from 'clsx';
import React, { type FC } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { useStagedPaymentContext } from '~context/StagedPaymentContext/StagedPaymentContext.ts';
import { formatText } from '~utils/intl.ts';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

const displayName =
  'v5.common.CompletedAction.partials.StagedPaymentTable.partials.ReleaseButton';

interface ReleaseButtonProps {
  items: MilestoneItem[];
  description: MessageDescriptor;
  className?: string;
}

const ReleaseButton: FC<ReleaseButtonProps> = ({
  items,
  description,
  className,
}) => {
  const {
    toggleOnMilestoneModal: showModal,
    setCurrentMilestonesAwaitingRelease,
    allMilestonesSlotIdsAwaitingRelease,
    isPendingStagesRelease,
  } = useStagedPaymentContext();

  const disabledSlotsMap = new Map(
    allMilestonesSlotIdsAwaitingRelease.map((id) => [id, true]),
  );

  const notReleasedMilestones = items.filter(
    (item) => !disabledSlotsMap.get(item.slotId),
  );

  const isDisabled = isPendingStagesRelease && !notReleasedMilestones.length;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={clsx(
        className,
        'text-gray-900 underline transition-colors text-3 hover:text-blue-400 disabled:text-gray-300',
      )}
      onClick={() => {
        setCurrentMilestonesAwaitingRelease(notReleasedMilestones);
        showModal();
      }}
    >
      {formatText(description)}
    </button>
  );
};

ReleaseButton.displayName = displayName;

export default ReleaseButton;
