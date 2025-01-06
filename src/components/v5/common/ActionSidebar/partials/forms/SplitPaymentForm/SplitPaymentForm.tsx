import { ChartPieSlice, UsersThree } from '@phosphor-icons/react';
import React, { useEffect, type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { TEAM_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import AmountRow from '~v5/common/ActionSidebar/partials/AmountRow/AmountRow.tsx';
import { distributionMethodOptions } from '~v5/common/ActionSidebar/partials/consts.tsx';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { useSplitPayment } from './hooks.ts';
import SplitPaymentRecipientsField from './partials/SplitPaymentRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.SplitPaymentForm';

const SplitPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { currentToken, distributionMethod, renderStakedExpenditureModal } =
    useSplitPayment(getFormOptions);
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const { watch, trigger } = useFormContext();
  const selectedTeam = watch(TEAM_FIELD_NAME);

  useEffect(() => {
    const subscription = watch((_, { name: fieldName = '', type }) => {
      const fieldNameParts = fieldName.split('.');

      if (fieldNameParts[0] !== 'tokenAddress') {
        return;
      }

      if (type === 'change') {
        trigger('amount');
      }
    });

    return () => subscription.unsubscribe();
  }, [trigger, watch]);

  return (
    <>
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
        isDisabled={hasNoDecisionMethods}
      >
        <FormCardSelect
          name="distributionMethod"
          options={distributionMethodOptions}
          placeholder={formatText({
            id: 'actionSidebar.distributionPlaceholder',
          })}
          title={formatText({ id: 'actionSidebar.distributionTypes' })}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
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
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="team" disabled={hasNoDecisionMethods} />
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
      <Description />
      {currentToken && (
        <SplitPaymentRecipientsField
          name="payments"
          token={currentToken}
          distributionMethod={distributionMethod}
          disabled={hasNoDecisionMethods}
        />
      )}
      {renderStakedExpenditureModal()}
    </>
  );
};

SplitPaymentForm.displayName = displayName;

export default SplitPaymentForm;
