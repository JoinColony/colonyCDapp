import React, { FC } from 'react';

import { useAdvancedPayment } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import AdvancedPaymentRecipentsField from './partials/AdvancedPaymentRecipentsField';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { formatText } from '~utils/intl';
import DescriptionRow from '../../DescriptionRow';

const displayName = 'v5.common.ActionSidebar.partials.AdvancedPaymentForm';

const AdvancedPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useAdvancedPayment(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="users-three"
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
        iconName="scales"
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
          options={DECISION_METHOD_OPTIONS}
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createdIn',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.createdIn' })}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <DescriptionRow />
      <AdvancedPaymentRecipentsField name="payments" />
    </>
  );
};

AdvancedPaymentForm.displayName = displayName;

export default AdvancedPaymentForm;
