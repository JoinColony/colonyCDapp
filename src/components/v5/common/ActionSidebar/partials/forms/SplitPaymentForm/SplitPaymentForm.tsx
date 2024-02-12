import {
  ChartPieSlice,
  Coins,
  Scales,
  UsersThree,
} from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { useDecisionMethods } from '~v5/common/ActionSidebar/hooks/index.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useSplitPayment } from './hooks.ts';
import SplitPaymentRecipientsField from './partials/SplitPaymentRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.SplitPaymentForm';

const SplitPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  const { currentToken, distributionMethod, amount } =
    useSplitPayment(getFormOptions);

  const { watch } = useFormContext();
  const selectedTeam = watch('team');

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
      >
        <FormCardSelect
          name="distributionMethod"
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.distributionPlaceholder',
          })}
          title={formatText({ id: 'actionSidebar.distributionTypes' })}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={Coins}
        fieldName="amount"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.amount',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.amount' })}
      >
        <AmountField name="amount" maxWidth={270} teamId={selectedTeam} />
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
      >
        <TeamsSelect name="team" />
      </ActionFormRow>
      <ActionFormRow
        icon={Scales}
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
      <CreatedInRow />
      <DescriptionRow />
      {currentToken && (
        <SplitPaymentRecipientsField
          amount={amount}
          name="payments"
          token={currentToken}
          distributionMethod={distributionMethod}
        />
      )}
    </>
  );
};

SplitPaymentForm.displayName = displayName;

export default SplitPaymentForm;
