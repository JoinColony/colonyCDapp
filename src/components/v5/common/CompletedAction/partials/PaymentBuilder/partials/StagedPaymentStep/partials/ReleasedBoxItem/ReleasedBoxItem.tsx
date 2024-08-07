import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { useGetExtensionInstalled } from '../../../PaymentBuilderWidget/utils.ts';
import { type MilestoneItem } from '../MilestoneReleaseModal/types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedReleaseStep.partials.ReleasedBoxItem';

export interface ReleaseBoxItem extends Omit<MilestoneItem, 'slotId'> {
  transactionHash?: string;
  uniqueId: string;
  createdAt: string;
  slotId: number | number[];
}

interface ReleasedBoxItemProps {
  item: ReleaseBoxItem;
  isReleasingMultipleMilestones?: boolean;
}

const MSG = defineMessages({
  releaseAll: {
    id: `${displayName}.releaseAll`,
    defaultMessage: 'All remaining milestones',
  },
});

const ReleasedBoxItem: FC<ReleasedBoxItemProps> = ({
  item,
  isReleasingMultipleMilestones,
}) => {
  const { setSelectedMilestoneMotion, selectedMilestoneMotion } =
    usePaymentBuilderContext();
  const { isStagedExtensionInstalled } = useGetExtensionInstalled();
  const { motionState, loadingAction } = useGetColonyAction(
    item?.transactionHash,
  );

  return (
    <button
      className="group flex w-full items-center justify-between gap-2"
      type="button"
      onClick={() => {
        if (!isStagedExtensionInstalled) {
          return;
        }

        setSelectedMilestoneMotion(item);
      }}
    >
      <span
        className={clsx(
          'truncate text-sm underline transition-colors group-hover:text-blue-400',
          {
            'text-blue-400':
              selectedMilestoneMotion?.uniqueId === item.uniqueId,
          },
        )}
      >
        {isReleasingMultipleMilestones
          ? formatText(MSG.releaseAll)
          : item.milestone}
      </span>
      {!item.transactionHash ? (
        <PillsBase
          className="bg-success-100 text-success-400"
          isCapitalized={false}
        >
          {formatText({ id: 'action.passed' })}
        </PillsBase>
      ) : (
        <>
          {loadingAction ? (
            <div className="h-[1.625rem] w-14 overflow-hidden rounded-xl skeleton" />
          ) : (
            <ActionBadge motionState={motionState} />
          )}
        </>
      )}
    </button>
  );
};

ReleasedBoxItem.displayName = displayName;

export default ReleasedBoxItem;
