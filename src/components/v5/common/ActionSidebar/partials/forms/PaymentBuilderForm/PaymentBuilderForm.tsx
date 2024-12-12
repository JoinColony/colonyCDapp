import { UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { usePaymentBuilder } from './hooks.ts';
import PaymentBuilderRecipientsField from './partials/PaymentBuilderRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.PaymentBuilderForm';

const PaymentBuilderForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { renderStakedExpenditureModal } = usePaymentBuilder(getFormOptions);
  const hasNoDecisionMethods = useHasNoDecisionMethods();

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
        // @TODO remove MultiSig once we add support for multisig advanced payments
        filterOptionsFn={({ value }) =>
          ![DecisionMethod.Reputation, DecisionMethod.MultiSig].includes(value)
        }
      />
      <Description />
      <PaymentBuilderRecipientsField name="payments" />
      {renderStakedExpenditureModal()}
    </>
  );
};

PaymentBuilderForm.displayName = displayName;

export default PaymentBuilderForm;
