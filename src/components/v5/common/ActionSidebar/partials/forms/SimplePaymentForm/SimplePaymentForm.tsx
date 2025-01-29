import { UserFocus, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { CHAIN_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import AmountRow from '~v5/common/ActionSidebar/partials/AmountRow/AmountRow.tsx';
import ChainSelect from '~v5/common/ActionSidebar/partials/ChainSelect/ChainSelect.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/CreatedIn.tsx';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { useActiveChainsFilter, useSimplePayment } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SimplePaymentForm';

const SimplePaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useSimplePayment(getFormOptions);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const createdInFilterFn = useFilterCreatedInField('from');
  const activeChainsFilterFn = useActiveChainsFilter();

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
        isMultiLine
      >
        <div className="flex flex-row flex-wrap items-center gap-2">
          <TeamsSelect
            className="w-full sm:w-auto"
            name="from"
            disabled={hasNoDecisionMethods}
          />
          <p className="text-md font-normal">{formatText({ id: 'on' })}</p>
          <ChainSelect
            name={CHAIN_FIELD_NAME}
            filterOptionsFn={activeChainsFilterFn}
          />
        </div>
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
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      {/* This input is needed for default values when changing the action */}
      <input name="payments" className="hidden" />
      {/* Disabled for now */}
      {/* <TransactionTable name="payments" /> */}
    </>
  );
};

SimplePaymentForm.displayName = displayName;

export default SimplePaymentForm;
