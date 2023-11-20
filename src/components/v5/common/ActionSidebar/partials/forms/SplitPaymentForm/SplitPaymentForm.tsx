import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { useDecisionMethods } from '~v5/common/ActionSidebar/hooks';
import { formatText } from '~utils/intl';

import { useSplitPayment } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import SplitPaymentRecipientsField from './partials/SplitPaymentRecipientsField';
import DescriptionRow from '../../DescriptionRow';

const displayName = 'v5.common.ActionSidebar.partials.SplitPaymentForm';

const SplitPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  const { currentToken, distributionMethod, amount } =
    useSplitPayment(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('team');

  return (
    <>
      <ActionFormRow
        iconName="pie-chart"
        fieldName="distributionMethod"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.distributionTypes',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.distribution' })}
      >
        <FormCardSelect
          name="distributionMethod"
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.distributionPlaceholder',
          })}
          title={formatText({ id: 'actionSidebar.distributionTypes' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="coins"
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
        iconName="users-three"
        fieldName="team"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            }),
          },
        }}
        title={formatText({ id: 'team.type' })}
      >
        <TeamsSelect name="team" />
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
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
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
      {currentToken && (
        <SplitPaymentRecipientsField
          amount={amount}
          name="payments"
          token={currentToken}
          distributionMethod={distributionMethod}
        />
      )}
    </>
  );
};

SplitPaymentForm.displayName = displayName;

export default SplitPaymentForm;
