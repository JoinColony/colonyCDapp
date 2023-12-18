import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import { useDecisionMethods } from '~v5/common/ActionSidebar/hooks';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';

import { ActionFormBaseProps } from '../../../types';
import DescriptionRow from '../../DescriptionRow';

import { useSplitPayment } from './hooks';
import SplitPaymentRecipientsField from './partials/SplitPaymentRecipientsField';

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
        icon="pie-chart"
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
        icon="users-three"
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
        hideWhenValueIsEmpty
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
