import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

import ReleaseButton from '../ReleaseButton/ReleaseButton.tsx';

const displayName =
  'v5.common.CompletedAction.partials.StagedPaymentTable.partials.ReleaseAllButton';

const MSG = defineMessages({
  payAll: {
    id: `${displayName}.payAll`,
    defaultMessage: 'Pay all',
  },
});

interface ReleaseAllButtonProps {
  items: MilestoneItem[];
}

const ReleaseAllButton: FC<ReleaseAllButtonProps> = ({ items }) => (
  <ReleaseButton
    description={MSG.payAll}
    items={items.filter((item) => !item.isClaimed)}
    className="w-full text-end"
  />
);

export default ReleaseAllButton;
