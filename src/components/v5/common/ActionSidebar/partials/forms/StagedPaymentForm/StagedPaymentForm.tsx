import { UserFocus, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/ActionFormRow.tsx';
import {
  FROM_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/CreatedIn.tsx';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/DecisionMethodField.tsx';
import Description from '~v5/common/ActionSidebar/partials/Description/Description.tsx';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/TeamsSelect.tsx';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/UserSelect.tsx';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';
import { createUnsupportedDecisionMethodFilter } from '~v5/common/ActionSidebar/utils.ts';

import { useStagePayment } from './hooks.ts';
import StagedPaymentRecipientsField from './partials/StagedPaymentRecipientsField/StagedPaymentRecipientField.tsx';

const displayName = 'v5.common.ActionSidebar.partials.StagedPaymentForm';

const StagedPaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const { renderStakedExpenditureModal } = useStagePayment(getFormOptions);

  const decisionMethodFilterFn = createUnsupportedDecisionMethodFilter([
    DecisionMethod.MultiSig,
    DecisionMethod.Reputation,
  ]);

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
      <DecisionMethodField filterOptionsFn={decisionMethodFilterFn} />
      <CreatedIn />
      <Description />
      <StagedPaymentRecipientsField name="stages" />
      {renderStakedExpenditureModal()}
    </>
  );
};

StagedPaymentForm.displayName = displayName;

export default StagedPaymentForm;
