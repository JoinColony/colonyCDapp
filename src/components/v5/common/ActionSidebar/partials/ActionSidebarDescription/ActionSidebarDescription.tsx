import React from 'react';
import { useWatch } from 'react-hook-form';

import { ACTION, Action } from '~constants/actions';

import { ACTION_TYPE_FIELD_NAME } from '../../consts';

import CreateDecisionDescription from './partials/CreateDecisionDescription/CreateDecisionDescription';
import CreateNewDomainDescription from './partials/CreateNewDomain/CreateNewDomain';
import EditColonyDetailsDescription from './partials/EditColonyDetailsDescription/EditColonyDetailsDescription';
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
    case ACTION.CREATE_DECISION:
      return <CreateDecisionDescription />;
    case ACTION.CREATE_NEW_TEAM:
      return <CreateNewDomainDescription />;
    case ACTION.EDIT_COLONY_DETAILS:
      return <EditColonyDetailsDescription />;
    default:
      return null;
  }
};

ActionSidebarDescription.displayName = displayName;
export default ActionSidebarDescription;
