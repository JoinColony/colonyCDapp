import clsx from 'clsx';
import React, { type ReactNode, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import { COLONY_ACTIVITY_ROUTE, TX_SEARCH_PARAM } from '~routes';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import { formatText } from '~utils/intl.ts';
import { ActionSidebarWidth } from '~v5/common/ActionSidebar/types.ts';
import FourOFourMessage from '~v5/common/FourOFourMessage/FourOFourMessage.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';

import ActionSidebarLayout from '../ActionSidebarLayout/ActionSidebarLayout.tsx';
import MultiSigSidebar from '../MultiSigSidebar/MultiSigSidebar.tsx';
import ShareButton from '../ShareButton.tsx';

import useGetActionData from './hooks/useGetActionData.ts';
import AddVerifiedMembers from './partials/AddVerifiedMembers/index.ts';
import Badges from './partials/Badges.tsx';
import CreateDecision from './partials/CreateDecision/index.ts';
import EditColonyDetails from './partials/EditColonyDetails/index.ts';
import ManageReputation from './partials/ManageReputation/index.ts';
import ManageTeam from './partials/ManageTeam/index.ts';
import ManageTokens from './partials/ManageTokens/ManageTokens.tsx';
import MintTokens from './partials/MintTokens/index.ts';
import Motions from './partials/Motions/index.ts';
import PaymentBuilderWidget from './partials/PaymentBuilder/partials/PaymentBuilderWidget/PaymentBuilderWidget.tsx';
import PaymentBuilder from './partials/PaymentBuilder/PaymentBuilder.tsx';
import PermissionSidebar from './partials/PermissionSidebar/PermissionSidebar.tsx';
import RemoveVerifiedMembers from './partials/RemoveVerifiedMembers/index.ts';
import SetUserRoles from './partials/SetUserRoles/index.ts';
import SimplePayment from './partials/SimplePayment/index.ts';
import TransferFunds from './partials/TransferFunds/index.ts';
import UnlockToken from './partials/UnlockToken/index.ts';
import UpgradeColonyObjective from './partials/UpgradeColonyObjective/index.ts';
import UpgradeColonyVersion from './partials/UpgradeColonyVersion/index.ts';

interface Props {
  transactionId: string;
  userNavigation?: ReactNode;
}

const displayName = 'v5.common.ActionSidebar.CompletedAction';

const CompletedActionSidebar = ({ transactionId, userNavigation }: Props) => {
  const { colony } = useColonyContext();
  const location = useLocation();

  const {
    action,
    isInvalidTransactionHash,
    loadingAction,
    isMotion,
    isMultiSig,
    motionState,
    expenditure,
    loadingExpenditure,
    startPollingForAction,
    stopPollingForAction,
  } = useGetActionData(transactionId);

  const { hide } = useActionSidebarContext();

  const [searchParams, setSearchParams] = useSearchParams();

  // Remove the tx parameter from the query parameters when component is unmounted
  useEffect(() => {
    return () => {
      searchParams.delete(TX_SEARCH_PARAM);
      setSearchParams(searchParams);
    };
    // We only want to do this on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeout = useRef<NodeJS.Timeout>();
  useEffect(() => {
    clearTimeout(timeout.current);

    // If the action has not been found for 20 seconds, then assume transaction doesn't exist.
    if (loadingAction) {
      timeout.current = setTimeout(() => {
        stopPollingForAction();
      }, 20000);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [loadingAction, stopPollingForAction]);

  if (loadingAction || loadingExpenditure) {
    return (
      <ActionSidebarLayout
        userNavigation={userNavigation}
        width={ActionSidebarWidth.Wide}
      >
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <SpinnerLoader appearance={{ size: 'huge' }} />
          <p className="text-gray-600">
            {formatText({ id: 'actionSidebar.loading' })}
          </p>
        </div>
      </ActionSidebarLayout>
    );
  }

  if (!action) {
    return (
      <ActionSidebarLayout
        userNavigation={userNavigation}
        width={ActionSidebarWidth.Wide}
      >
        <div className="pt-14">
          <FourOFourMessage
            description={formatText({
              id: isInvalidTransactionHash
                ? 'actionSidebar.fourOfour.descriptionInvalidHash'
                : 'actionSidebar.fourOfour.description',
            })}
            links={
              <>
                {!isInvalidTransactionHash && (
                  <Link
                    to={COLONY_ACTIVITY_ROUTE}
                    className="mb-2 text-sm text-blue-400 underline"
                    onClick={hide}
                  >
                    {formatText({
                      id: 'actionSidebar.fourOfour.activityPageLink',
                    })}
                  </Link>
                )}
                <ButtonLink
                  to={`${location.pathname}${location.search}`}
                  onClick={hide}
                  className="mb-2 text-sm text-blue-400 underline"
                >
                  {formatText({
                    id: 'actionSidebar.fourOfour.createNewAction',
                  })}
                </ButtonLink>
              </>
            }
            primaryLinkButton={
              isInvalidTransactionHash ? (
                <ButtonLink
                  mode="primarySolid"
                  to={COLONY_ACTIVITY_ROUTE}
                  className="flex-1"
                  onClick={hide}
                >
                  {formatText({
                    id: 'actionSidebar.fourOfour.activityPageLink',
                  })}
                </ButtonLink>
              ) : (
                <Button
                  mode="primarySolid"
                  className="flex-1"
                  onClick={startPollingForAction}
                >
                  {formatText({
                    id: 'button.retry',
                  })}
                </Button>
              )
            }
          />
        </div>
      </ActionSidebarLayout>
    );
  }

  const actionType = getExtendedActionType(action, colony.metadata);

  // FIXME: Aaaaaaaaah
  const getActionContent = () => {
    switch (actionType) {
      case ColonyActionType.Payment:
      case ColonyActionType.PaymentMotion:
      case ColonyActionType.PaymentMultisig:
        return <SimplePayment actionData={action} />;
      case ColonyActionType.MintTokens:
      case ColonyActionType.MintTokensMotion:
      case ColonyActionType.MintTokensMultisig:
        return <MintTokens actionData={action} />;
      case ColonyActionType.MoveFunds:
      case ColonyActionType.MoveFundsMotion:
      case ColonyActionType.MoveFundsMultisig:
        return <TransferFunds actionData={action} />;
      case ColonyActionType.CreateDomain:
      case ColonyActionType.CreateDomainMotion:
      case ColonyActionType.EditDomain:
      case ColonyActionType.EditDomainMotion:
      case ColonyActionType.CreateDomainMultisig:
      case ColonyActionType.EditDomainMultisig:
        return <ManageTeam actionData={action} />;
      case ColonyActionType.UnlockToken:
      case ColonyActionType.UnlockTokenMotion:
      case ColonyActionType.UnlockTokenMultisig:
        return <UnlockToken actionData={action} />;
      case ColonyActionType.VersionUpgrade:
      case ColonyActionType.VersionUpgradeMotion:
      case ColonyActionType.VersionUpgradeMultisig:
        return <UpgradeColonyVersion actionData={action} />;
      case ColonyActionType.CreateDecisionMotion:
        return <CreateDecision actionData={action} />;
      case ColonyActionType.SetUserRoles:
      case ColonyActionType.SetUserRolesMotion:
      case ColonyActionType.SetUserRolesMultisig:
        return <SetUserRoles actionData={action} />;
      case ColonyActionType.AddVerifiedMembers:
      case ColonyActionType.AddVerifiedMembersMotion:
      case ColonyActionType.AddVerifiedMembersMultisig:
        return <AddVerifiedMembers actionData={action} />;
      case ColonyActionType.RemoveVerifiedMembers:
      case ColonyActionType.RemoveVerifiedMembersMotion:
      case ColonyActionType.RemoveVerifiedMembersMultisig:
        return <RemoveVerifiedMembers actionData={action} />;
      case ColonyActionType.EmitDomainReputationReward:
      case ColonyActionType.EmitDomainReputationRewardMotion:
      case ColonyActionType.EmitDomainReputationRewardMultisig:
      case ColonyActionType.EmitDomainReputationPenalty:
      case ColonyActionType.EmitDomainReputationPenaltyMotion:
      case ColonyActionType.EmitDomainReputationPenaltyMultisig:
        return <ManageReputation actionData={action} />;
      case ColonyActionType.ColonyEdit:
      case ColonyActionType.ColonyEditMotion:
      case ColonyActionType.ColonyEditMultisig:
        return <EditColonyDetails actionData={action} />;
      /**
       * @deprecated
       * This is still needed to allow users to view existing Colony Objectives in the Completed Action component
       */
      case ExtendedColonyActionType.UpdateColonyObjective:
      case ExtendedColonyActionType.UpdateColonyObjectiveMotion:
      case ExtendedColonyActionType.UpdateColonyObjectiveMultisig:
        return <UpgradeColonyObjective actionData={action} />;
      // @TODO: Connect this to the reputation actions
      /* case ColonyActionType.EmitDomainReputationReward:
         case ColonyActionType.EmitDomainReputationPenalty:
          return <ManageReputation action={action} />; */
      case ColonyActionType.CreateExpenditure:
        return <PaymentBuilder actionData={action} />;
      case ColonyActionType.ManageTokens:
      case ColonyActionType.ManageTokensMotion:
      case ColonyActionType.ManageTokensMultisig:
        return <ManageTokens actionData={action} />;
      default:
        console.warn('Unsupported action display', action);
        return <div>Not implemented yet</div>;
    }
  };

  // FIXME: Aaaaaaaaah
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
      case ColonyActionType.EditExpenditureMotion:
      case ColonyActionType.FundExpenditureMotion:
      case ColonyActionType.EmitDomainReputationRewardMotion:
      case ColonyActionType.EmitDomainReputationPenaltyMotion:
      case ExtendedColonyActionType.UpdateColonyObjectiveMotion:
        return <Motions transactionId={action.transactionHash} />;
      case ColonyActionType.CreateExpenditure:
        return <PaymentBuilderWidget actionData={action} />;
      default:
        return <PermissionSidebar transactionId={action.transactionHash} />;
    }
  };

  return (
    <ActionSidebarLayout
      badges={
        <Badges
          actionData={action || undefined}
          expenditure={expenditure || undefined}
          isMotion={isMotion}
          isMultiSig={isMultiSig}
          motionState={motionState}
          loadingExpenditure={!!loadingExpenditure}
        />
      }
      shareButton={<ShareButton />}
      userNavigation={userNavigation}
      width={ActionSidebarWidth.Wide}
    >
      <div className="flex flex-grow flex-col-reverse justify-end overflow-auto sm:flex-row sm:justify-start">
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
    </ActionSidebarLayout>
  );
};

CompletedActionSidebar.displayName = displayName;
export default CompletedActionSidebar;
