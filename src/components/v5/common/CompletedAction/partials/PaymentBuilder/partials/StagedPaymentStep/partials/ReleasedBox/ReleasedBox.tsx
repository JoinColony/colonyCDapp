import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { formatText } from '~utils/intl.ts';
import useGetActionData from '~v5/common/ActionSidebar/hooks/useGetActionData.ts';

import ActionWithPermissionsInfo from '../../../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import MotionBox from '../../../MotionBox/MotionBox.tsx';
import ReleasedBoxItem, {
  type ReleaseBoxItem,
} from '../ReleasedBoxItem/ReleasedBoxItem.tsx';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedReleaseStep.partials.ReleaseBox';

interface ReleasedBoxProps {
  items: ReleaseBoxItem[];
}

const MSG = defineMessages({
  milestonePayments: {
    id: `${displayName}.releases`,
    defaultMessage: 'Milestone payments',
  },
});

const ReleasedBox: FC<ReleasedBoxProps> = ({ items }) => {
  const { selectedMilestoneMotion } = usePaymentBuilderContext();

  const { action } = useGetActionData(selectedMilestoneMotion?.transactionHash);

  return (
    <div className="mb-2">
      <div className="rounded-lg border border-gray-200 bg-base-white p-[1.125rem]">
        <h3 className="mb-2 text-1">{formatText(MSG.milestonePayments)}</h3>
        <div className="max-h-[10.25rem] overflow-x-hidden overflow-y-scroll">
          <ul className="flex flex-col gap-2 overflow-hidden">
            {items.map((item) => (
              <li key={item.uniqueId}>
                <ReleasedBoxItem
                  item={item}
                  isReleasingMultipleMilestones={
                    Array.isArray(item.slotId) ? item.slotId.length > 1 : false
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedMilestoneMotion && (
        <div className="mt-2">
          {!selectedMilestoneMotion.transactionHash ? (
            <ActionWithPermissionsInfo action={action} />
          ) : (
            <MotionBox
              transactionId={selectedMilestoneMotion.transactionHash}
            />
          )}
        </div>
      )}
    </div>
  );
};

ReleasedBox.displayName = displayName;

export default ReleasedBox;
