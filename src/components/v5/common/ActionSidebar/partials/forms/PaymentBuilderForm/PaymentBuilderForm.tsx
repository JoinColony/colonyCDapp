import { UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';

import { type CreateActionFormProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { usePaymentBuilder } from './hooks.ts';
import PaymentBuilderRecipientsField from './partials/PaymentBuilderRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.PaymentBuilderForm';

const PaymentBuilderForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  usePaymentBuilder(getFormOptions);
  const hasNoDecisionMethods = useHasNoDecisionMethods();

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
        title={formatText({ id: 'actionSidebar.fundFrom' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="from" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <DecisionMethodField
        filterOptionsFn={({ value }) => value !== DecisionMethod.Reputation}
      />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      <PaymentBuilderRecipientsField name="payments" />
    </>
  );
};

PaymentBuilderForm.displayName = displayName;

export default PaymentBuilderForm;
