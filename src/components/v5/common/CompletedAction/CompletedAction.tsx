import clsx from 'clsx';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';

import PermissionSidebar from '../ActionSidebar/partials/ActionSidebarContent/partials/PermissionSidebar.tsx';
import Motions from '../ActionSidebar/partials/Motions/index.ts';
import MultiSigSidebar from '../ActionSidebar/partials/MultiSigSidebar/MultiSigSidebar.tsx';

import AddVerifiedMembers from './partials/AddVerifiedMembers/index.ts';
import CreateDecision from './partials/CreateDecision/index.ts';
import EditColonyDetails from './partials/EditColonyDetails/index.ts';
import ManageReputation from './partials/ManageReputation/index.ts';
import ManageTeam from './partials/ManageTeam/index.ts';
import ManageTokens from './partials/ManageTokens/ManageTokens.tsx';
import MintTokens from './partials/MintTokens/index.ts';
import PaymentBuilderWidget from './partials/PaymentBuilder/partials/PaymentBuilderWidget/PaymentBuilderWidget.tsx';
import PaymentBuilder from './partials/PaymentBuilder/PaymentBuilder.tsx';
import RemoveVerifiedMembers from './partials/RemoveVerifiedMembers/index.ts';
import SetUserRoles from './partials/SetUserRoles/index.ts';
import SimplePayment from './partials/SimplePayment/index.ts';
import SplitPayment from './partials/SplitPayment/SplitPayment.tsx';
import TransferFunds from './partials/TransferFunds/index.ts';
import UnlockToken from './partials/UnlockToken/index.ts';
import UpgradeColonyObjective from './partials/UpgradeColonyObjective/index.ts';
import UpgradeColonyVersion from './partials/UpgradeColonyVersion/index.ts';

interface CompletedActionProps {
  action: ColonyAction;
}

const displayName = 'v5.common.CompletedAction';

const CompletedAction = ({ action }: CompletedActionProps) => {
  const { colony } = useColonyContext();

  const actionType = getExtendedActionType(action, colony.metadata);

  const getActionContent = () => {
    switch (actionType) {
      case ColonyActionType.Payment:
      case ColonyActionType.PaymentMotion:
      case ColonyActionType.PaymentMultisig:
        return <SimplePayment action={action} />;
      case ColonyActionType.MintTokens:
      case ColonyActionType.MintTokensMotion:
      case ColonyActionType.MintTokensMultisig:
        return <MintTokens action={action} />;
      case ColonyActionType.MoveFunds:
      case ColonyActionType.MoveFundsMotion:
      case ColonyActionType.MoveFundsMultisig:
        return <TransferFunds action={action} />;
      case ColonyActionType.CreateDomain:
      case ColonyActionType.CreateDomainMotion:
      case ColonyActionType.EditDomain:
      case ColonyActionType.EditDomainMotion:
      case ColonyActionType.CreateDomainMultisig:
      case ColonyActionType.EditDomainMultisig:
        return <ManageTeam action={action} />;
      case ColonyActionType.UnlockToken:
      case ColonyActionType.UnlockTokenMotion:
      case ColonyActionType.UnlockTokenMultisig:
        return <UnlockToken action={action} />;
      case ColonyActionType.VersionUpgrade:
      case ColonyActionType.VersionUpgradeMotion:
      case ColonyActionType.VersionUpgradeMultisig:
        return <UpgradeColonyVersion action={action} />;
      case ColonyActionType.CreateDecisionMotion:
        return <CreateDecision action={action} />;
      case ColonyActionType.SetUserRoles:
      case ColonyActionType.SetUserRolesMotion:
      case ColonyActionType.SetUserRolesMultisig:
        return <SetUserRoles action={action} />;
      case ColonyActionType.AddVerifiedMembers:
      case ColonyActionType.AddVerifiedMembersMotion:
      case ColonyActionType.AddVerifiedMembersMultisig:
        return <AddVerifiedMembers action={action} />;
      case ColonyActionType.RemoveVerifiedMembers:
      case ColonyActionType.RemoveVerifiedMembersMotion:
      case ColonyActionType.RemoveVerifiedMembersMultisig:
        return <RemoveVerifiedMembers action={action} />;
      case ColonyActionType.EmitDomainReputationReward:
      case ColonyActionType.EmitDomainReputationRewardMotion:
      case ColonyActionType.EmitDomainReputationRewardMultisig:
      case ColonyActionType.EmitDomainReputationPenalty:
      case ColonyActionType.EmitDomainReputationPenaltyMotion:
      case ColonyActionType.EmitDomainReputationPenaltyMultisig:
        return <ManageReputation action={action} />;
      case ColonyActionType.ColonyEdit:
      case ColonyActionType.ColonyEditMotion:
      case ColonyActionType.ColonyEditMultisig:
        return <EditColonyDetails action={action} />;
      /**
       * @deprecated
       * This is still needed to allow users to view existing Colony Objectives in the Completed Action component
       */
      case ExtendedColonyActionType.UpdateColonyObjective:
      case ExtendedColonyActionType.UpdateColonyObjectiveMotion:
      case ExtendedColonyActionType.UpdateColonyObjectiveMultisig:
        return <UpgradeColonyObjective action={action} />;
      // @TODO: Connect this to the reputation actions
      /* case ColonyActionType.EmitDomainReputationReward:
         case ColonyActionType.EmitDomainReputationPenalty:
          return <ManageReputation action={action} />; */
      case ColonyActionType.CreateExpenditure:
      case ExtendedColonyActionType.StagedPayment:
        return <PaymentBuilder action={action} />;
      case ColonyActionType.ManageTokens:
      case ColonyActionType.ManageTokensMotion:
      case ColonyActionType.ManageTokensMultisig:
        return <ManageTokens action={action} />;
      case ExtendedColonyActionType.SplitPayment:
        return <SplitPayment action={action} />;
      default:
        console.warn('Unsupported action display', action);
        return <div>Not implemented yet</div>;
    }
  };

  const getSidebarWidgetContent = () => {
    if (action.isMultiSig) {
      return <MultiSigSidebar transactionId={action.transactionHash} />;
    }

    switch (actionType) {
      case ColonyActionType.AddVerifiedMembersMotion:
      case ColonyActionType.RemoveVerifiedMembersMotion:
      case ColonyActionType.PaymentMotion:
      case ColonyActionType.MintTokensMotion:
      case ColonyActionType.MoveFundsMotion:
      case ColonyActionType.CreateDomainMotion:
      case ColonyActionType.EditDomainMotion:
      case ColonyActionType.UnlockTokenMotion:
      case ColonyActionType.VersionUpgradeMotion:
      case ColonyActionType.CreateDecisionMotion:
      case ColonyActionType.SetUserRolesMotion:
      case ColonyActionType.ColonyEditMotion:
      case ColonyActionType.ManageTokensMotion:
      case ColonyActionType.EmitDomainReputationRewardMotion:
      case ColonyActionType.EmitDomainReputationPenaltyMotion:
      case ExtendedColonyActionType.UpdateColonyObjectiveMotion:
      case ColonyActionType.ReleaseStagedPaymentsMotion:
      case ColonyActionType.EditExpenditureMotion:
      case ColonyActionType.FundExpenditureMotion:
        // @NOTE: Enabling expenditure-related motions above temporarily (action UI will be missing)
        return <Motions transactionId={action.transactionHash} />;
      // @todo: reorganize folder structure after all of the advanced payments will be ready
      case ColonyActionType.CreateExpenditure:
      case ExtendedColonyActionType.StagedPayment:
      case ExtendedColonyActionType.SplitPayment:
        return <PaymentBuilderWidget action={action} />;
      default:
        return <PermissionSidebar action={action} />;
    }
  };

  return (
    <div
      data-testid="completed-action"
      className="flex flex-grow flex-col-reverse justify-end overflow-auto sm:flex-row sm:justify-start"
    >
      <div
        className={clsx('w-full overflow-y-auto px-6 pb-6 pt-8', {
          'sm:w-[calc(100%-23.75rem)]': action.isMotion,
        })}
      >
        {getActionContent()}
      </div>

      <div
        className={`
            w-full
            border-b
            border-b-gray-200
            bg-gray-25
            px-6
            py-8
            sm:h-full
            sm:w-[23.75rem]
            sm:flex-shrink-0
            sm:overflow-y-auto
            sm:border-b-0
            sm:border-l
            sm:border-l-gray-200
          `}
      >
        {getSidebarWidgetContent()}
      </div>
    </div>
  );
};

CompletedAction.displayName = displayName;
export default CompletedAction;
