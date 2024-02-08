import { UserFocus, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { useHasNoDecisionMethods } from '~v5/common/ActionSidebar/hooks/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import AmountRow from '../../AmountRow/AmountRow.tsx';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useSimplePayment } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SimplePaymentForm';

const SimplePaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useSimplePayment(getFormOptions);

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
              id: 'actionSidebar.tooltip.simplePayment.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="from" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <ActionFormRow
        icon={UserFocus}
        fieldName="recipient"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.recipient' })}
        isDisabled={hasNoDecisionMethods}
      >
        <UserSelect name="recipient" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <AmountRow
        domainId={selectedTeam}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.amount',
            }),
          },
        }}
      />
      <DecisionMethodField />
      <CreatedInRow />
      <DescriptionRow />
      {/* Disabled for now */}
      {/* <TransactionTable name="payments" tokenAddress={tokenAddress} /> */}
    </>
  );
};

SimplePaymentForm.displayName = displayName;

export default SimplePaymentForm;
