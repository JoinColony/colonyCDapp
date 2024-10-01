import { UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { usePaymentBuilder } from './hooks.ts';
import PaymentBuilderRecipientsField from './partials/PaymentBuilderRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.PaymentBuilderForm';

const PaymentBuilderForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  usePaymentBuilder(getFormOptions);
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const createdInFilterFn = useFilterCreatedInField('from');

  return (
    <ActionFormLayout>
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
        // @TODO remove MultiSig once we add support for multisig advanced payments
        filterOptionsFn={({ value }) =>
          ![DecisionMethod.Reputation, DecisionMethod.MultiSig].includes(value)
        }
      />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      <PaymentBuilderRecipientsField name="payments" />
    </ActionFormLayout>
  );
};

PaymentBuilderForm.displayName = displayName;

export default PaymentBuilderForm;
