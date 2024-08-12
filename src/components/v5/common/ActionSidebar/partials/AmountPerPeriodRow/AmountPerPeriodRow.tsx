import { Calendar } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';

import useHasNoDecisionMethods from '../../hooks/permissions/useHasNoDecisionMethods.ts';

import { OPTIONS } from './consts.ts';
import AmountPerPeriodRowField from './partials/AmountPerPeriodRowField/AmountPerPeriodRowField.tsx';
import { type AmountPerPeriodRowProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.AmountPerPeriodRow';

const AmountPerPeriodRow = ({
  title,
  tooltips,
  name,
}: AmountPerPeriodRowProps) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <ActionFormRow
      icon={Calendar}
      fieldName={'period' || name}
      title={
        title ??
        formatText({
          id: 'actionSidebar.amountPer',
        })
      }
      tooltips={
        tooltips || {
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.streamingPayment.amount.per',
            }),
          },
        }
      }
      isDisabled={hasNoDecisionMethods}
    >
      <div>
        <AmountPerPeriodRowField
          name={'period' || name}
          options={OPTIONS}
          placeholder={formatText({
            id: 'actionSidebar.amountPer.placeholder',
          })}
        />
      </div>
    </ActionFormRow>
  );
};

AmountPerPeriodRow.displayName = displayName;

export default AmountPerPeriodRow;
