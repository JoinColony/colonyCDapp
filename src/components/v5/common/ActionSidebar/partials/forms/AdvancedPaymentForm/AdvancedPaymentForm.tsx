import React, { FC } from 'react';

import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { formatText } from '~utils/intl';

import { ActionFormBaseProps } from '../../../types';
import DescriptionRow from '../../DescriptionRow';
import { useDecisionMethods } from '../../../hooks';
import AdvancedPaymentRecipentsField from './partials/AdvancedPaymentRecipentsField';
import { useAdvancedPayment } from './hooks';

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
      <ActionFormRow
        icon="house-line"
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
