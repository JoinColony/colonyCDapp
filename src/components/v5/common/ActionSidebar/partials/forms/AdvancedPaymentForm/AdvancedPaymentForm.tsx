import { UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useAdvancedPayment } from './hooks.ts';
import AdvancedPaymentRecipientsField from './partials/AdvancedPaymentRecipientsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.AdvancedPaymentForm';

const AdvancedPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useAdvancedPayment(getFormOptions);

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
      <CreatedInRow />
      <DescriptionRow />
      <AdvancedPaymentRecipientsField name="payments" />
    </>
  );
};

AdvancedPaymentForm.displayName = displayName;

export default AdvancedPaymentForm;
