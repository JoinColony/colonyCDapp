import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { formatText } from '~utils/intl';

import { useSimplePayment } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import { useDecisionMethods } from '../../../hooks';
import DescriptionRow from '../../DescriptionRow';

const displayName = 'v5.common.ActionSidebar.partials.SimplePaymentForm';

const SimplePaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  useSimplePayment(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('from');

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
        title={formatText({ id: 'actionSidebar.from' })}
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <ActionFormRow
        icon="user-focus"
        fieldName="recipient"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.recipient' })}
      >
        <UserSelect name="recipient" />
      </ActionFormRow>
      <ActionFormRow
        icon="coins"
        fieldName="amount"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.amount',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.amount' })}
      >
        <AmountField name="amount" maxWidth={270} teamId={selectedTeam} />
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
      {/* Disabled for now */}
      {/* <TransactionTable name="payments" tokenAddress={tokenAddress} /> */}
    </>
  );
};

SimplePaymentForm.displayName = displayName;

export default SimplePaymentForm;
