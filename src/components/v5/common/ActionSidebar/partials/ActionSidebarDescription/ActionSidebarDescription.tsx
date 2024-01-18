import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { ACTION, Action } from '~constants/actions';

import { ACTION_TYPE_FIELD_NAME } from '../../consts';

import MintTokensDescription from './partials/MintTokensDescription/MintTokensDescription';
import SimplePaymentDescription from './partials/SimplePaymentDescription/SimplePaymentDescription';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription';

/*
@NOTE this form values approach is pretty fragile since it doesn't have strict typing
we could do type guards for each form I guess?
*/
const ActionSidebarDescription = () => {
  const formValues = useFormContext().getValues();
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  switch (selectedAction) {
    case ACTION.MINT_TOKENS:
      return <MintTokensDescription amount={formValues?.amount?.amount} />;
    case ACTION.SIMPLE_PAYMENT:
      return (
        <SimplePaymentDescription
          amount={formValues?.amount?.amount}
          recipientAddress={formValues?.recipient}
          tokenAddress={formValues?.amount?.tokenAddress}
        />
      );
    default:
      return null;
  }
};

ActionSidebarDescription.displayName = displayName;
export default ActionSidebarDescription;
