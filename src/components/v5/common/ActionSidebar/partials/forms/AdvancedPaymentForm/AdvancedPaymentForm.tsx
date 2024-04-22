import { UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useAdvancedPayment } from './hooks.ts';
import AdvancedPaymentRecipientsField from './partials/AdvancedPaymentRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.AdvancedPaymentForm';

const AdvancedPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useAdvancedPayment(getFormOptions);

  const createdInFilterFn = useFilterCreatedInField('from');

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
        title={formatText({ id: 'actionSidebar.fundFrom' })}
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <DecisionMethodField />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      <AdvancedPaymentRecipientsField name="payments" />
    </>
  );
};

AdvancedPaymentForm.displayName = displayName;

export default AdvancedPaymentForm;
