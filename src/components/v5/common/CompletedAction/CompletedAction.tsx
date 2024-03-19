import clsx from 'clsx';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { ColonyActionType } from '~gql';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';

import { useGetExpenditureData } from '../ActionSidebar/hooks/useGetExpenditureData.ts';
import PermissionSidebar from '../ActionSidebar/partials/ActionSidebarContent/partials/PermissionSidebar.tsx';
import Motions from '../ActionSidebar/partials/Motions/index.ts';

import CreateDecision from './partials/CreateDecision/index.ts';
import EditColonyDetails from './partials/EditColonyDetails/index.ts';
import ManageTeam from './partials/ManageTeam/index.ts';
import MintTokens from './partials/MintTokens/index.ts';
import PaymentBuilder from './partials/PaymentBuilder/PaymentBuilder.tsx';
import SetUserRoles from './partials/SetUserRoles/index.ts';
import SimplePayment from './partials/SimplePayment/index.ts';
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
  const { expenditure, loadingExpenditure } = useGetExpenditureData(
    action.expenditureId,
  );

  const actionType = getExtendedActionType(action, colony.metadata);

  const getActionContent = () => {
    switch (actionType) {
      case ColonyActionType.Payment:
      case ColonyActionType.PaymentMotion:
        return <SimplePayment action={action} />;
      case ColonyActionType.MintTokens:
      case ColonyActionType.MintTokensMotion:
        return <MintTokens action={action} />;
      case ColonyActionType.MoveFunds:
      case ColonyActionType.MoveFundsMotion:
        return <TransferFunds action={action} />;
      case ColonyActionType.CreateDomain:
      case ColonyActionType.CreateDomainMotion:
      case ColonyActionType.EditDomain:
      case ColonyActionType.EditDomainMotion:
        return <ManageTeam action={action} />;
      case ColonyActionType.UnlockToken:
      case ColonyActionType.UnlockTokenMotion:
        return <UnlockToken action={action} />;
      case ColonyActionType.VersionUpgrade:
      case ColonyActionType.VersionUpgradeMotion:
        return <UpgradeColonyVersion action={action} />;
      case ColonyActionType.CreateDecisionMotion:
        return <CreateDecision action={action} />;
      case ColonyActionType.SetUserRoles:
      case ColonyActionType.SetUserRolesMotion:
        return <SetUserRoles action={action} />;
      case ColonyActionType.ColonyEdit:
      case ColonyActionType.ColonyEditMotion:
        return <EditColonyDetails action={action} />;
      case ExtendedColonyActionType.UpdateColonyObjective:
        return <UpgradeColonyObjective action={action} />;
      case ColonyActionType.CreateExpenditure:
        return (
          !loadingExpenditure &&
          expenditure && (
            <PaymentBuilder action={action} expenditure={expenditure} />
          )
        );
      default:
        console.warn('Unsupported action display', action);
        return <div>Not implemented yet</div>;
    }
  };

  return (
    <div className="flex flex-grow flex-col sm:flex-row overflow-auto">
      <div
        className={clsx('overflow-y-auto pb-6 pt-8 px-6', {
          'w-full': !action.isMotion,
          'w-full sm:w-[65%]': action.isMotion,
        })}
      >
        {getActionContent()}
      </div>

      <div
        className={`
            w-full
            sm:w-[35%]
            sm:h-full
            sm:overflow-y-auto
            sm:flex-shrink-0
            px-6
            py-8
            border-b
            border-b-gray-200
            sm:border-b-0
            sm:border-l
            sm:border-l-gray-200
            bg-gray-25
          `}
      >
        {action.isMotion ? (
          <Motions transactionId={action.transactionHash} />
        ) : (
          <PermissionSidebar transactionId={action.transactionHash} />
        )}
      </div>
    </div>
  );
};

CompletedAction.displayName = displayName;
export default CompletedAction;
