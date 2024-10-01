import { ChartPieSlice, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import AmountRow from '~v5/common/ActionSidebar/partials/AmountRow/AmountRow.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { useSplitPayment } from './hooks.ts';
import SplitPaymentRecipientsField from './partials/SplitPaymentRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.SplitPaymentForm';

const SplitPaymentForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  const { currentToken, distributionMethod, amount } =
    useSplitPayment(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('team');

  const createdInFilterFn = useFilterCreatedInField('team');

  return (
    <ActionFormLayout>
      <ActionFormRow
        icon={ChartPieSlice}
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
          options={[]}
          placeholder={formatText({
            id: 'actionSidebar.distributionPlaceholder',
          })}
          title={formatText({ id: 'actionSidebar.distributionTypes' })}
        />
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
      <ActionFormRow
        icon={UsersThree}
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
      <DecisionMethodField />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      {currentToken && (
        <SplitPaymentRecipientsField
          amount={amount}
          name="payments"
          token={currentToken}
          distributionMethod={distributionMethod}
        />
      )}
    </ActionFormLayout>
  );
};

SplitPaymentForm.displayName = displayName;

export default SplitPaymentForm;
