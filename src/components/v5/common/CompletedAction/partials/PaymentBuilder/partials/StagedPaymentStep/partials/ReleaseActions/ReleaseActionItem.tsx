import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { type Expenditure, type ExpenditureAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import { getMilestoneName } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/utils.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedReleaseStep.partials.ReleaseActionItem';

interface ReleaseActionItemProps {
  action: ExpenditureAction;
  expenditure: Expenditure;
}

const MSG = defineMessages({
  releaseAll: {
    id: `${displayName}.releaseAll`,
    defaultMessage: 'All remaining milestones',
  },
});

const ReleaseActionItem: FC<ReleaseActionItemProps> = ({
  action,
  expenditure,
}) => {
  const { setSelectedReleaseAction, selectedReleaseAction } =
    usePaymentBuilderContext();
  const { isStagedExtensionInstalled } = useEnabledExtensions();
  const { motionState, loadingAction } = useGetColonyAction(
    action?.transactionHash,
  );

  const releasedSlotIds =
    action.motionData?.expenditureSlotIds ?? action?.expenditureSlotIds ?? [];

  const isReleasingMultipleMilestones = releasedSlotIds.length > 1;

  return (
    <button
      className="group flex w-full items-center justify-between gap-2"
      type="button"
      onClick={() => {
        if (!isStagedExtensionInstalled) {
          return;
        }

        setSelectedReleaseAction(action);
      }}
    >
      <span
        className={clsx(
          'truncate text-sm underline transition-colors group-hover:text-blue-400',
          {
            'text-blue-400':
              selectedReleaseAction?.transactionHash === action.transactionHash,
          },
        )}
      >
        {isReleasingMultipleMilestones
          ? formatText(MSG.releaseAll)
          : getMilestoneName(expenditure, releasedSlotIds[0])}
      </span>
      {!action.motionData ? (
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

ReleaseActionItem.displayName = displayName;

export default ReleaseActionItem;