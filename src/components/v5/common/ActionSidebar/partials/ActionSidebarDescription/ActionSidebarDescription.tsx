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
    case Action.MintTokens:
      return <MintTokensDescription />;
    case Action.SimplePayment:
      return <SimplePaymentDescription />;
    case Action.CreateDecision:
      return <CreateDecisionDescription />;
    case Action.CreateNewTeam:
      return <CreateNewDomainDescription />;
    case Action.EditColonyDetails:
      return <EditColonyDetailsDescription />;
    case Action.EditExistingTeam:
      return <EditDomainDescription />;
    case Action.EnterRecoveryMode:
      return <EnterRecoveryModeDescription />;
    case Action.ManageColonyObjectives:
      return <ManageColonyObjectiveDescription />;
    case Action.ManagePermissions:
      return <ManagePermissionsDescription />;
    case Action.ManageTokens:
      return <ManageTokensDescription />;
    case Action.TransferFunds:
      return <TransferFundsDescription />;
    case Action.UnlockToken:
      return <UnlockTokenDescription />;
    case Action.UpgradeColonyVersion:
      return <UpgradeColonyDescription />;
    default:
      return null;
  }
};

ActionSidebarDescription.displayName = displayName;
export default ActionSidebarDescription;
