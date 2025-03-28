import { HandPalm, UserFocus, UsersThree } from '@phosphor-icons/react';
import isDate from 'date-fns/isDate';
import React, { useEffect, type FC } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import { StreamingPaymentEndCondition } from '~gql';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/ActionFormRow.tsx';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/AmountField.tsx';
import AmountPerPeriodRow from '~v5/common/ActionSidebar/partials/AmountPerPeriodRow/AmountPerPeriodRow.tsx';
import AmountRow from '~v5/common/ActionSidebar/partials/AmountRow/AmountRow.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/CreatedIn.tsx';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/DecisionMethodField.tsx';
import Description from '~v5/common/ActionSidebar/partials/Description/Description.tsx';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/TeamsSelect.tsx';
import TimeRow from '~v5/common/ActionSidebar/partials/TimeRow/TimeRow.tsx';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/UserSelect.tsx';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { useStreamingPayment } from './hooks.ts';

const StreamingPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useStreamingPayment(getFormOptions);

  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const createdInFilterFn = useFilterCreatedInField('from');
  const selectedTeam = useWatch({ name: 'from' });
  const startsCondition = useWatch({ name: 'starts' });
  const endsCondition = useWatch({ name: 'ends' });
  const amountValue = useWatch({ name: 'amount' });
  const limitValue = useWatch({ name: 'limit' });

  const { setValue } = useFormContext();

  useEffect(() => {
    if (typeof amountValue === 'string' && amountValue.includes(',')) {
      const newValue = amountValue.replace(/,/g, '');
      setValue('amount', newValue);
    }
    if (typeof limitValue === 'string' && limitValue.includes(',')) {
      const newValue = limitValue.replace(/,/g, '');
      setValue('limit', newValue);
    }
  }, [limitValue, amountValue, setValue]);

  return (
    <>
      <ActionFormRow
        icon={UsersThree}
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.streamingPayment.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.streamFrom' })}
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
              id: 'actionSidebar.tooltip.streamingPayment.recipient',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.recipient' })}
        isDisabled={hasNoDecisionMethods}
      >
        <UserSelect name="recipient" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <TimeRow
        name="starts"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.streamingPayment.starts',
            }),
          },
        }}
      />
      <TimeRow
        name="ends"
        type="end"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.streamingPayment.ends',
            }),
          },
        }}
        minDate={isDate(startsCondition) ? startsCondition : new Date()}
      />
      <AmountRow
        domainId={selectedTeam}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.streamingPayment.amount',
            }),
          },
        }}
      />
      <AmountPerPeriodRow name="period" />
      {endsCondition === StreamingPaymentEndCondition.LimitReached && (
        <ActionFormRow
          icon={HandPalm}
          fieldName="limit"
          title="Limit"
          isDisabled={hasNoDecisionMethods}
          tooltips={{
            label: {
              tooltipContent: formatText({
                id: 'actionSidebar.tooltip.streamingPayment.limit',
              }),
            },
          }}
        >
          <AmountField
            name="limit"
            tokenAddressFieldName="limitTokenAddress"
            domainId={selectedTeam}
            isDisabled={hasNoDecisionMethods}
            isTokenSelectionDisabled
          />
        </ActionFormRow>
      )}
      <DecisionMethodField />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
    </>
  );
};

export default StreamingPaymentForm;
