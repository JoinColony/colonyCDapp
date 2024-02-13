import { Id } from '@colony/colony-js';
import { ArrowDownRight, Coins, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useTransferFunds } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.TransferFundsForm';

const TransferFundsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useTransferFunds(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('from');

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
      >
        <TeamsSelect name="from" />
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
      >
        <TeamsSelect name="to" />
      </ActionFormRow>
      <ActionFormRow
        icon={Coins}
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
