import { Id } from '@colony/colony-js';
import { ArrowDownRight, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { useHasNoDecisionMethods } from '~v5/common/ActionSidebar/hooks/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import AmountRow from '../../AmountRow/AmountRow.tsx';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useTransferFunds } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.TransferFundsForm';

const TransferFundsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useTransferFunds(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <>
      <ActionFormRow
        icon={UsersThree}
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="from" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <ActionFormRow
        icon={ArrowDownRight}
        fieldName="to"
        title={formatText({ id: 'actionSidebar.to' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.to',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="to" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <AmountRow
        domainId={selectedTeam}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.transferFunds.amount',
            }),
          },
        }}
      />

      <DecisionMethodField />
      <CreatedInRow
        filterOptionsFn={(option) =>
          (option.value === Id.RootDomain.toString() ||
            option.value === selectedTeam) &&
          !!option.isRoot
        }
      />
      <DescriptionRow />
    </>
  );
};

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
