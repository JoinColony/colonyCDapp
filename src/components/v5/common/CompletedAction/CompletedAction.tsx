import clsx from 'clsx';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { ColonyActionType } from '~gql';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';

import PermissionSidebar from '../ActionSidebar/partials/ActionSidebarContent/partials/PermissionSidebar.tsx';
import Motions from '../ActionSidebar/partials/Motions/index.ts';

import CreateDecision from './partials/CreateDecision/index.ts';
import CreateNewTeam from './partials/CreateNewTeam/index.ts';
// import EditColonyDetails from './partials/EditColonyDetails';
import MintTokens from './partials/MintTokens/index.ts';
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

  const actionType = getExtendedActionType(action, colony.metadata);

  const getActionContent = () => {
    switch (actionType) {
      case ColonyActionType.Payment:
        return <SimplePayment action={action} />;
      case ColonyActionType.MintTokens:
        return <MintTokens action={action} />;
      case ColonyActionType.MoveFunds:
        return <TransferFunds action={action} />;
      case ColonyActionType.CreateDomain:
      case ColonyActionType.EditDomain:
        return <CreateNewTeam action={action} />;
      case ColonyActionType.UnlockToken:
        return <UnlockToken action={action} />;
      case ColonyActionType.VersionUpgrade:
      case ColonyActionType.VersionUpgradeMotion:
        return <UpgradeColonyVersion action={action} />;
      case ColonyActionType.CreateDecisionMotion:
        return <CreateDecision action={action} />;
      case ColonyActionType.SetUserRoles:
        return <SetUserRoles action={action} />;
      /* @TODO uncomment when social links are added to action display
      case ColonyActionType.ColonyEdit:
        return <EditColonyDetails action={action} />;
        */
      case ExtendedColonyActionType.UpdateColonyObjective:
        return <UpgradeColonyObjective action={action} />;
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
            md:w-[35%]
            md:h-full
            md:overflow-y-auto
            md:flex-shrink-0
            px-6
            py-8
            border-b
            border-b-gray-200
            md:border-b-0
            md:border-l
            md:border-l-gray-200
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
