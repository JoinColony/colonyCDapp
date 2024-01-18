import React from 'react';
import { useWatch } from 'react-hook-form';

import { ACTION, Action } from '~constants/actions';

import { ACTION_TYPE_FIELD_NAME } from '../../consts';

import CreateDecisionDescription from './partials/CreateDecisionDescription/CreateDecisionDescription';
import CreateNewDomainDescription from './partials/CreateNewDomainDescription/CreateNewDomainDescription';
import EditColonyDetailsDescription from './partials/EditColonyDetailsDescription/EditColonyDetailsDescription';
import EditDomainDescription from './partials/EditDomainDescription/EditDomainDescription';
import EnterRecoveryModeDescription from './partials/EnterRecoveryModeDescription/EnterRecoveryModeDescription';
import ManageColonyObjectiveDescription from './partials/ManageColonyObjectiveDescription/ManageColonyObjectiveDescription';
import ManagePermissionsDescription from './partials/ManagePermissionsDescription/ManagePermissionsDescription';
import ManageTokensDescription from './partials/ManageTokensDescription/ManageTokensDescription';
import MintTokensDescription from './partials/MintTokensDescription/MintTokensDescription';
import SimplePaymentDescription from './partials/SimplePaymentDescription/SimplePaymentDescription';
import TransferFundsDescription from './partials/TransferFundsDescription/TransferFundsDescription';

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
    case ACTION.EDIT_EXISTING_TEAM:
      return <EditDomainDescription />;
    case ACTION.ENTER_RECOVERY_MODE:
      return <EnterRecoveryModeDescription />;
    case ACTION.MANAGE_COLONY_OBJECTIVES:
      return <ManageColonyObjectiveDescription />;
    case ACTION.MANAGE_PERMISSIONS:
      return <ManagePermissionsDescription />;
    case ACTION.MANAGE_TOKENS:
      return <ManageTokensDescription />;
    case ACTION.TRANSFER_FUNDS:
      return <TransferFundsDescription />;
    default:
      return null;
  }
};

ActionSidebarDescription.displayName = displayName;
export default ActionSidebarDescription;
