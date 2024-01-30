import { Id } from '@colony/colony-js';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { DecisionMethod, useDecisionMethods } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useTransferFunds } from './hooks.ts';

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
        title={formatText({ id: 'actionSidebar.to' })}
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
