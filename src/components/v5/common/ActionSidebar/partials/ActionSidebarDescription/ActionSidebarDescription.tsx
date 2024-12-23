import React from 'react';

import { Action } from '~constants/actions.ts';
import { useActiveActionType } from '~v5/common/ActionSidebar/hooks/useActiveActionType.ts';

import CreateDecisionDescription from './partials/CreateDecisionDescription.tsx';
import CreateNewDomainDescription from './partials/CreateNewDomainDescription.tsx';
import EditColonyDetailsDescription from './partials/EditColonyDetailsDescription.tsx';
import EditDomainDescription from './partials/EditDomainDescription.tsx';
import EnterRecoveryModeDescription from './partials/EnterRecoveryModeDescription.tsx';
import ManagePermissionsDescription from './partials/ManagePermissionsDescription.tsx';
import ManageReputationDescription from './partials/ManageReputationDescription.tsx';
import { ManageSupportedChainsDescription } from './partials/ManageSupportedChainsDescription.tsx';
import ManageTokensDescription from './partials/ManageTokensDescription.tsx';
import ManageVerifiedMembersDescription from './partials/ManageVerifiedMembersDescription.tsx';
import MintTokensDescription from './partials/MintTokensDescription.tsx';
import PaymentBuilderDescription from './partials/PaymentBuilderDescription.tsx';
import SimplePaymentDescription from './partials/SimplePaymentDescription.tsx';
import SplitPaymentDescription from './partials/SplitPaymentDescription.tsx';
import StagedPaymentsDescription from './partials/StagedPaymentsDescription.tsx';
import TransferFundsDescription from './partials/TransferFundsDescription.tsx';
import UnlockTokenDescription from './partials/UnlockTokenDescription.tsx';
import UpgradeColonyDescription from './partials/UpgradeColonyDescription.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription';

const ActionSidebarDescription = () => {
  const selectedAction = useActiveActionType();

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
    case Action.ManageVerifiedMembers:
      return <ManageVerifiedMembersDescription />;
    case Action.ManageSupportedChains:
      return <ManageSupportedChainsDescription />;
    case Action.ManageReputation:
      return <ManageReputationDescription />;
    case Action.PaymentBuilder:
      return <PaymentBuilderDescription />;
    case Action.SplitPayment:
      return <SplitPaymentDescription />;
    case Action.StagedPayment:
      return <StagedPaymentsDescription />;
    default:
      return null;
  }
};

ActionSidebarDescription.displayName = displayName;
export default ActionSidebarDescription;
