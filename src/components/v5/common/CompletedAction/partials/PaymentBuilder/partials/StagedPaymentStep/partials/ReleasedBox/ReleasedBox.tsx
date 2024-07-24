import React, { useState, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import ActionWithPermissionsInfo from '../../../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import { type ReleaseActionItem } from '../../StagedPaymentStep.tsx';
import { type MilestoneItem } from '../MilestoneReleaseModal/types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedReleaseStep.partials.ReleaseBox';

interface ReleasedBoxProps {
  items: MilestoneItem[];
  releaseActions: ReleaseActionItem[];
}

const MSG = defineMessages({
  milestonePayments: {
    id: `${displayName}.releases`,
    defaultMessage: 'Milestone payments',
  },
});

const ReleasedBox: FC<ReleasedBoxProps> = ({ items, releaseActions }) => {
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneItem | null>(null);
  const actionInformation = releaseActions.find((action) =>
    action.slotIds.includes(selectedMilestone?.slotId || 0),
  );

  return (
    <div className="mb-2">
      <div className="rounded-lg border border-gray-200 bg-base-white p-[1.125rem]">
        <h3 className="mb-2 text-1">{formatText(MSG.milestonePayments)}</h3>
        <ul>
          {items.map((item) => (
            <li key={item.slotId} className="mb-2 last:mb-0">
              <button
                className="group flex w-full items-center justify-between gap-2"
                type="button"
                onClick={() => setSelectedMilestone(item)}
              >
                <span className="text-sm underline transition-colors group-hover:text-blue-400">
                  {item.milestone}
                </span>
                <PillsBase
                  className="bg-success-100 text-success-400"
                  isCapitalized={false}
                >
                  {formatText({ id: 'action.passed' })}
                </PillsBase>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedMilestone && (
        <div className="mt-2">
          <ActionWithPermissionsInfo
            userAdddress={actionInformation?.userAddress}
            createdAt={actionInformation?.createdAt}
          />
        </div>
      )}
    </div>
  );
};

ReleasedBox.displayName = displayName;

export default ReleasedBox;
