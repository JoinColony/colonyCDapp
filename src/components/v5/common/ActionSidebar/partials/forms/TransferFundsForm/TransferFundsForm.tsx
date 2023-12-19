import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { formatText } from '~utils/intl';

import { useTransferFunds } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import { useDecisionMethods } from '../../../hooks';
import DescriptionRow from '../../DescriptionRow';

const displayName = 'v5.common.ActionSidebar.partials.TransferFundsForm';

const TransferFundsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  useTransferFunds(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  return (
    <>
      <ActionFormRow
        iconName="users-three"
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <ActionFormRow
        iconName="arrow-down-right"
        fieldName="to"
        title={formatText({ id: 'actionSidebar.recipent' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.to',
            }),
          },
        }}
      >
        <TeamsSelect name="to" />
      </ActionFormRow>
      <ActionFormRow
        iconName="coins"
        fieldName="amount"
        title={formatText({ id: 'actionSidebar.amount' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.amount',
            }),
          },
        }}
      >
        <AmountField name="amount" maxWidth={270} teamId={selectedTeam} />
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
    </>
  );
};

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
