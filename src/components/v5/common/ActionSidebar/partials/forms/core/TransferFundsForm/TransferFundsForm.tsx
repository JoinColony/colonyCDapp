import { ArrowDownRight, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import AmountRow from '~v5/common/ActionSidebar/partials/AmountRow/AmountRow.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useTransferFunds } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.TransferFundsForm';

const TransferFundsForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  useTransferFunds(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const createdInFilterFn = useFilterCreatedInField('from', true);

  return (
    <ActionFormLayout>
      <ActionFormRow
        icon={UsersThree}
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="from" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <ActionFormRow
        icon={ArrowDownRight}
        fieldName="to"
        title={formatText({ id: 'actionSidebar.to' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.to',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="to" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <AmountRow
        domainId={selectedTeam}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.amount',
            }),
          },
        }}
      />

      <DecisionMethodField />
      <CreatedIn readonly filterOptionsFn={createdInFilterFn} />
      <Description />
    </ActionFormLayout>
  );
};

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
