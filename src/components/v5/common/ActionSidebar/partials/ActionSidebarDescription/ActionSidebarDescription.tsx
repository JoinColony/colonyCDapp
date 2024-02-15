import React from 'react';
import { useWatch } from 'react-hook-form';

import { Action } from '~constants/actions.ts';

import { ACTION_TYPE_FIELD_NAME } from '../../consts.tsx';

import CreateDecisionDescription from './partials/CreateDecisionDescription.tsx';
import CreateNewDomainDescription from './partials/CreateNewDomainDescription.tsx';
import EditColonyDetailsDescription from './partials/EditColonyDetailsDescription.tsx';
import EditDomainDescription from './partials/EditDomainDescription.tsx';
import EnterRecoveryModeDescription from './partials/EnterRecoveryModeDescription.tsx';
import ManageColonyObjectiveDescription from './partials/ManageColonyObjectiveDescription.tsx';
import ManagePermissionsDescription from './partials/ManagePermissionsDescription.tsx';
import ManageTokensDescription from './partials/ManageTokensDescription.tsx';
import MintTokensDescription from './partials/MintTokensDescription.tsx';
import SimplePaymentDescription from './partials/SimplePaymentDescription.tsx';
import TransferFundsDescription from './partials/TransferFundsDescription.tsx';
import UnlockTokenDescription from './partials/UnlockTokenDescription.tsx';
import UpgradeColonyDescription from './partials/UpgradeColonyDescription.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription';

const ActionSidebarDescription = () => {
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  switch (selectedAction) {
    case Action.MINT_TOKENS:
      return <MintTokensDescription />;
    case Action.SIMPLE_PAYMENT:
      return <SimplePaymentDescription />;
    case Action.CREATE_DECISION:
      return <CreateDecisionDescription />;
    case Action.CREATE_NEW_TEAM:
      return <CreateNewDomainDescription />;
    case Action.EDIT_COLONY_DETAILS:
      return <EditColonyDetailsDescription />;
    case Action.EDIT_EXISTING_TEAM:
      return <EditDomainDescription />;
    case Action.ENTER_RECOVERY_MODE:
      return <EnterRecoveryModeDescription />;
    case Action.MANAGE_COLONY_OBJECTIVES:
      return <ManageColonyObjectiveDescription />;
    case Action.MANAGE_PERMISSIONS:
      return <ManagePermissionsDescription />;
    case Action.MANAGE_TOKENS:
      return <ManageTokensDescription />;
    case Action.TRANSFER_FUNDS:
      return <TransferFundsDescription />;
    case Action.UNLOCK_TOKEN:
      return <UnlockTokenDescription />;
    case Action.UPGRADE_COLONY_VERSION:
      return <UpgradeColonyDescription />;
    default:
      return null;
  }
};

ActionSidebarDescription.displayName = displayName;
export default ActionSidebarDescription;
