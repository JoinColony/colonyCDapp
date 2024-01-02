import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Id } from '@colony/colony-js';

import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { formatText } from '~utils/intl';

import { useTransferFunds } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useDecisionMethods } from '../../../hooks';
import DescriptionRow from '../../DescriptionRow';

const displayName = 'v5.common.ActionSidebar.partials.TransferFundsForm';

const TransferFundsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  useTransferFunds(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('from');
  const selectedDecisionMethod = watch('decisionMethod');

  return (
    <>
      <ActionFormRow
        icon="users-three"
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
        icon="arrow-down-right"
        fieldName="to"
        title={formatText({ id: 'actionSidebar.recipient' })}
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
        icon="coins"
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
      {selectedDecisionMethod &&
        selectedDecisionMethod === DecisionMethod.Reputation && (
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
            <TeamsSelect
              name="createdIn"
              filterOptionsFn={(option) =>
                (option.value === Id.RootDomain.toString() ||
                  option.value === selectedTeam) &&
                !!option.isRoot
              }
            />
          </ActionFormRow>
        )}
      <DescriptionRow />
    </>
  );
};

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
