import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { useDecisionMethods } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DescriptionRow from '../../DescriptionRow/DescriptionRow.tsx';

import { useAdvancedPayment } from './hooks.ts';
import AdvancedPaymentRecipientsField from './partials/AdvancedPaymentRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.AdvancedPaymentForm';

const AdvancedPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  useAdvancedPayment(getFormOptions);

  return (
    <>
      <ActionFormRow
        icon="users-three"
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
      <ActionFormRow
        icon="scales"
        fieldName="decisionMethod"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.decisionMethod',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.decisionMethod' })}
      >
        <FormCardSelect
          name="decisionMethod"
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          title={formatText({ id: 'actionSidebar.availableDecisions' })}
        />
      </ActionFormRow>
      <CreatedInRow />
      <DescriptionRow />
      <AdvancedPaymentRecipientsField name="payments" />
    </>
  );
};

AdvancedPaymentForm.displayName = displayName;

export default AdvancedPaymentForm;
