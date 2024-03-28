import { UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { usePaymentBuilder } from './hooks.ts';
import PaymentBuilderRecipientsField from './partials/PaymentBuilderRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.PaymentBuilderForm';

const PaymentBuilderForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  usePaymentBuilder(getFormOptions);

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
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <DecisionMethodField />
      <CreatedIn />
      <Description />
      <PaymentBuilderRecipientsField name="payments" />
    </>
  );
};

PaymentBuilderForm.displayName = displayName;

export default PaymentBuilderForm;
