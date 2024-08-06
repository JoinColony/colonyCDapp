import { UserFocus, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/ActionFormRow.tsx';
import {
  FROM_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/CreatedIn.tsx';
import DecisionMethodField from '../../DecisionMethodField/DecisionMethodField.tsx';
import Description from '../../Description/Description.tsx';
import TeamsSelect from '../../TeamsSelect/TeamsSelect.tsx';
import UserSelect from '../../UserSelect/UserSelect.tsx';

import { useStagePayment } from './hooks.ts';
import StagedPaymentRecipientsField from './partials/StagedPaymentRecipientsField/StagedPaymentRecipientField.tsx';

const displayName = 'v5.common.ActionSidebar.partials.StagedPaymentForm';

const StagedPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  useStagePayment(getFormOptions);

  return (
    <>
      <ActionFormRow
        icon={UsersThree}
        fieldName={FROM_FIELD_NAME}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.fundFrom' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name={FROM_FIELD_NAME} disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <ActionFormRow
        icon={UserFocus}
        fieldName={RECIPIENT_FIELD_NAME}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.recipient' })}
      >
        <UserSelect name={RECIPIENT_FIELD_NAME} />
      </ActionFormRow>
      <DecisionMethodField />
      <CreatedIn />
      <Description />
      <StagedPaymentRecipientsField name="stages" />
    </>
  );
};

StagedPaymentForm.displayName = displayName;

export default StagedPaymentForm;
