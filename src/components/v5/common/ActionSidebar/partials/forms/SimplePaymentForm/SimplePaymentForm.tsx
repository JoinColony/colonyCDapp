import { UserFocus, UsersThree } from '@phosphor-icons/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import AmountRow from '~v5/common/ActionSidebar/partials/AmountRow/AmountRow.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/CreatedIn.tsx';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';
// import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

// import { useSimplePayment } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SimplePaymentForm';

const SimplePaymentForm = () => {
  // useSimplePayment(getFormOptions);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const createdInFilterFn = useFilterCreatedInField('from');

  return (
    <>
      <ActionFormRow
        icon={UsersThree}
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="from" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <ActionFormRow
        icon={UserFocus}
        fieldName="recipient"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.recipient' })}
        isDisabled={hasNoDecisionMethods}
      >
        <UserSelect name="recipient" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <AmountRow
        domainId={selectedTeam}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.amount',
            }),
          },
        }}
      />
      <DecisionMethodField />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      {/* This input is needed for default values when changing the action */}
      <input name="payments" className="hidden" />
      {/* Disabled for now */}
      {/* <TransactionTable name="payments" /> */}
    </>
  );
};

SimplePaymentForm.displayName = displayName;

export default SimplePaymentForm;
