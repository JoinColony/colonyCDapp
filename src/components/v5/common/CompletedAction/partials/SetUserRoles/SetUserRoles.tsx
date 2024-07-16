import { ColonyRole } from '@colony/colony-js';
import { ShieldStar, Signature, UserFocus } from '@phosphor-icons/react';
import React from 'react';

import { ADDRESS_ZERO } from '~constants';
import { Action } from '~constants/actions.ts';
import { getRole } from '~constants/permissions.ts';
import {
  ColonyActionType,
  useGetColonyHistoricRoleRolesQuery,
  type GetColonyHistoricRoleRolesQuery,
} from '~gql';
import { DecisionMethod } from '~types/actions.ts';
import { Authority } from '~types/authority.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { formatRolesTitle } from '~utils/colonyActions.ts';
import { getHistoricRolesDatabaseId } from '~utils/databaseId.ts';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TEAM_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
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

const transformActionRolesToColonyRoles = (
  historicRoles: GetColonyHistoricRoleRolesQuery['getColonyHistoricRole'],
): ColonyRole[] => {
  if (!historicRoles) return [];

  const roleKeys = Object.keys(historicRoles);

  const colonyRoles: ColonyRole[] = roleKeys
    .filter((key) => historicRoles[key])
    .map((key) => {
      const match = key.match(/role_(\d+)/); // Extract the role number
      if (match && match[1]) {
        const roleIndex = parseInt(match[1], 10);
        if (roleIndex in ColonyRole) {
          return roleIndex;
        }
      }
      return null;
    })
    .filter((role): role is ColonyRole => role !== null);

  return colonyRoles;
};

const SetUserRoles = ({ action }: Props) => {
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
    isMotion,
    annotation,
    blockNumber,
    colonyAddress,
    rolesAreMultiSig,
  } = action;

  const { data: historicRoles } = useGetColonyHistoricRoleRolesQuery({
    variables: {
      id: getHistoricRolesDatabaseId({
        blockNumber,
        colonyAddress,
        nativeId: fromDomain?.nativeId,
        recipientAddress,
      }),
    },
    fetchPolicy: 'cache-and-network',
  });

  const userColonyRoles = transformActionRolesToColonyRoles(
    historicRoles?.getColonyHistoricRole,
  );

  const { name: roleName, role } = getRole(userColonyRoles);
  const rolesTitle = formatRolesTitle(roles);
  const roleAuthority = rolesAreMultiSig
    ? Authority.ViaMultiSig
    : Authority.Own;

  const metadata =
    action.motionData?.motionDomain.metadata ??
    action.multiSigData?.multiSigDomain.metadata;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.ManagePermissions,
            member: recipientAddress,
            authority: roleAuthority,
            role,
            [TEAM_FIELD_NAME]: fromDomain?.nativeId,
            [DECISION_METHOD_FIELD_NAME]: isMotion
              ? DecisionMethod.Reputation
              : DecisionMethod.Permissions,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
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
          rowLabel={formatText({ id: 'actionSidebar.permissions' })}
          rowContent={
            userColonyRoles.length
              ? roleName
              : formatText({
                  id: 'actionSidebar.managePermissions.roleSelect.remove.title',
                })
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.managePermissions.permissions',
          })}
          RowIcon={ShieldStar}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.authority' })}
          rowContent={
            rolesAreMultiSig
              ? formatText({ id: 'actionSidebar.authority.viaMultiSig' })
              : formatText({ id: 'actionSidebar.authority.own' })
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.authority',
          })}
          RowIcon={Signature}
        />
        <DecisionMethodRow
          isMotion={action.isMotion || false}
          isMultisig={action.isMultiSig || false}
        />
        {metadata && <CreatedInRow motionDomainMetadata={metadata} />}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
      {!!userColonyRoles.length && (
        <PermissionsTableRow
          role={role}
          domainId={action.fromDomain?.nativeId}
          userColonyRoles={userColonyRoles}
        />
      )}
    </>
  );
};

SetUserRoles.displayName = displayName;
export default SetUserRoles;
