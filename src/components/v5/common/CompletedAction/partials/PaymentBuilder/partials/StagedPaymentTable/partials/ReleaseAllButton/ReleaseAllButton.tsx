import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { formatText } from '~utils/intl.ts';

import { type MilestoneItem } from '../../../StagedReleaseStep/partials/MilestoneReleaseModal/types.ts';

const displayName =
  'v5.common.CompletedAction.partials.StagedPaymentTable.partials.ReleaseAllButton';

const MSG = defineMessages({
  releaseAll: {
    id: `${displayName}.releaseAll`,
    defaultMessage: 'Release all',
  },
});

interface ReleaseAllButtonProps {
  items: MilestoneItem[];
}

const ReleaseAllButton: FC<ReleaseAllButtonProps> = ({ items }) => {
  const { toggleOnMilestoneModal: showModal, setSelectedMilestones } =
    usePaymentBuilderContext();
  const notReleasedMilestones = items.filter((item) => !item.isReleased);

  return (
    <button
      type="button"
      className="w-full text-center text-gray-900 underline transition-colors text-3 hover:text-blue-400"
      onClick={() => {
        setSelectedMilestones(notReleasedMilestones);
        showModal();
      }}
    >
      {formatText(MSG.releaseAll)}
    </button>
  );
};

export default ReleaseAllButton;
