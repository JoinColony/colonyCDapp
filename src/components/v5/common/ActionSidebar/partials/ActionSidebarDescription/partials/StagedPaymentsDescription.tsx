import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { ExtendedColonyActionType } from '~types/actions.ts';
import { type StagedPaymentFormValues } from '~v5/common/ActionSidebar/partials/forms/StagedPaymentForm/hooks.ts';

import CurrentUser from './CurrentUser.tsx';
import RecipientUser from './RecipientUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.StagedPaymentsDescription';

export const StagedPaymentsDescription = () => {
  const formValues = useFormContext<StagedPaymentFormValues>().getValues();
  const { recipient } = formValues;

  if (!recipient) {
    return (
      <FormattedMessage
        id="staged.description.placeholder"
        values={{
          initiator: <CurrentUser />,
        }}
      />
    );
  }

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ExtendedColonyActionType.StagedPayment,
        recipient: <RecipientUser userAddress={recipient} />,
        initiator: <CurrentUser />,
      }}
    />
  );
};

StagedPaymentsDescription.displayName = displayName;
export default StagedPaymentsDescription;
