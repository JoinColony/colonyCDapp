import { ShieldStar, Signature, UserFocus } from '@phosphor-icons/react';
import React from 'react';

import { ADDRESS_ZERO } from '~constants';
import { Action } from '~constants/actions.ts';
import { getRole } from '~constants/permissions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType, useGetColonyHistoricRoleRolesQuery } from '~gql';
import { getUserRolesForDomain } from '~transformers';
import { Authority } from '~types/authority.ts';
import { type ColonyAction } from '~types/graphql.ts';
import {
  formatRolesTitle,
  normalizeRolesForAction,
} from '~utils/colonyActions.ts';
import {
  extractColonyRoles,
  transformApiRolesToArray,
} from '~utils/colonyRoles.ts';
import { getHistoricRolesDatabaseId } from '~utils/databaseId.ts';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import {
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TEAM_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { UserRoleModifier } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionData,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  PermissionsTableRow,
  TeamFromRow,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.SetUserRoles';

interface Props {
  action: ColonyAction;
}

const SetUserRoles = ({ action }: Props) => {
  const {
    colony: { roles: rolesInColony },
  } = useColonyContext();
  const decisionMethod = useDecisionMethod(action);
  const {
    customTitle = formatText(
      { id: 'action.type' },
      { actionType: ColonyActionType.SetUserRoles },
    ),
  } = action.metadata || {};
  const {
    initiatorUser,
    recipientUser,
    roles,
    recipientAddress,
    transactionHash,
    fromDomain,
    annotation,
    rolesAreMultiSig,
    blockNumber,
    colonyAddress,
    isMotion,
    isMultiSig,
  } = action;
  const areRolesMultiSig = !!rolesAreMultiSig;
  const isActionMotion = isMotion || isMultiSig;

  const roleAuthority = rolesAreMultiSig
    ? Authority.ViaMultiSig
    : Authority.Own;

  const { data: historicRoles } = useGetColonyHistoricRoleRolesQuery({
    variables: {
      id: getHistoricRolesDatabaseId({
        blockNumber,
        colonyAddress,
        nativeId: fromDomain?.nativeId,
        recipientAddress,
        isMultiSig: areRolesMultiSig,
      }),
    },
    fetchPolicy: 'cache-and-network',
  });

  const colonyRoles = extractColonyRoles(rolesInColony);
  const currentUserRoles = getUserRolesForDomain({
    colonyRoles,
    isMultiSig: areRolesMultiSig,
    userAddress: recipientAddress ?? '', // this shouldn't be undefined
    domainId: fromDomain?.nativeId,
    constraint: 'excludeInheritedRoles',
  });

  const oldRoles = historicRoles?.getColonyHistoricRole
    ? transformApiRolesToArray(historicRoles.getColonyHistoricRole)
    : currentUserRoles;

  if (!roles) {
    console.warn('No roles present in action');
    return null;
  }

  const normalizedRoles = normalizeRolesForAction(roles);
  const isRemovingRoles =
    normalizedRoles.filter((role) => role.setTo).length === 0;

  /*
   * This probably seems so confusing but dropping a here be dragons comment for future developers
   * When you create a motion, there is no historic roles created, that's created when a setUserRoles contract passes
   * when you do it via permissions, it 100% reflects the roles the user currently holds
   * The roles on the action are just a diff, so if we add just 1 role, only that one is there, the same when we remove it
   * Motions however modify the user's current roles in the colony, so we use those
   */
  const newRoles = isActionMotion
    ? normalizedRoles.filter((role) => role.setTo === true).map(({ id }) => id)
    : oldRoles;

  const { name: newRoleName, role: newUserRole } = getRole(
    newRoles,
    areRolesMultiSig,
  );
  const { role: oldUserRole } = getRole(oldRoles, areRolesMultiSig);

  const metadata = action.motionData?.motionDomain.metadata;
  const rolesTitle = formatRolesTitle(roles);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          action={Action.ManagePermissions}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            member: recipientAddress,
            authority: roleAuthority,
            role: isRemovingRoles ? UserRoleModifier.Remove : newUserRole,
            [TEAM_FIELD_NAME]: fromDomain?.nativeId,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
          showRedoItem={
            !isRemovingRoles ||
            (!!action.motionData && !action.motionData?.isFinalized) ||
            (!!action.multiSigData && !action.multiSigData?.isExecuted)
          }
        />
      </div>
      <ActionSubtitle>
        {formatText(
          { id: 'action.title' },
          {
            direction: rolesTitle,
            multiSigAuthority:
              roleAuthority === Authority.ViaMultiSig
                ? `${formatText({
                    id: 'decisionMethod.multiSig',
                  })} `
                : '',
            actionType: ColonyActionType.SetUserRoles,
            fromDomain: action.fromDomain?.metadata?.name,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
            recipient: recipientAddress ? (
              <UserInfoPopover
                walletAddress={recipientAddress}
                user={recipientUser}
                withVerifiedBadge={false}
              >
                {recipientUser?.profile?.displayName ||
                  splitWalletAddress(recipientAddress)}
              </UserInfoPopover>
            ) : null,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.member' })}
          rowContent={
            <UserPopover
              walletAddress={action.recipientAddress || ADDRESS_ZERO}
              size={20}
            />
          }
          RowIcon={UserFocus}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.managePermissions.member',
          })}
        />
        {action.fromDomain?.metadata && (
          <TeamFromRow
            teamMetadata={action.fromDomain.metadata}
            actionType={action.type}
          />
        )}
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.authority' })}
          rowContent={
            areRolesMultiSig
              ? formatText({ id: 'actionSidebar.authority.viaMultiSig' })
              : formatText({ id: 'actionSidebar.authority.own' })
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.authority',
          })}
          RowIcon={Signature}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.permissions' })}
          rowContent={
            !isRemovingRoles
              ? newRoleName
              : formatText({
                  id: 'actionSidebar.managePermissions.roleSelect.remove.title',
                })
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.managePermissions.permissions',
          })}
          RowIcon={ShieldStar}
        />
        <DecisionMethodRow action={action} />
        {metadata && <CreatedInRow motionDomainMetadata={metadata} />}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
      <PermissionsTableRow
        dbPermissionsOld={oldRoles}
        dbRoleForDomainOld={oldUserRole}
        dbPermissionsNew={newRoles}
        dbRoleForDomainNew={newUserRole}
        domainId={action.fromDomain?.nativeId}
      />
    </>
  );
};

SetUserRoles.displayName = displayName;
export default SetUserRoles;
