import React from 'react';
import { useWatch } from 'react-hook-form';

import { ACTION, Action } from '~constants/actions';

import { ACTION_TYPE_FIELD_NAME } from '../../consts';

import MintTokensDescription from './partials/MintTokensDescription/MintTokensDescription';
import SimplePaymentDescription from './partials/SimplePaymentDescription/SimplePaymentDescription';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription';

const ActionSidebarDescription = () => {
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  switch (selectedAction) {
    case ACTION.MINT_TOKENS:
      return <MintTokensDescription />;
    case ACTION.SIMPLE_PAYMENT:
      return <SimplePaymentDescription />;
    default:
      return null;
  }
};

ActionSidebarDescription.displayName = displayName;
export default ActionSidebarDescription;
