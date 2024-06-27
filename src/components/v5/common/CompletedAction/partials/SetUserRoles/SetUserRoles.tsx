import { ShieldStar, Signature, UserFocus } from '@phosphor-icons/react';
import React from 'react';

import { ADDRESS_ZERO } from '~constants';
import { Action } from '~constants/actions.ts';
import { getRole } from '~constants/permissions.ts';
import { ColonyActionType, useGetColonyHistoricRoleRolesQuery } from '~gql';
import { DecisionMethod } from '~types/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { AUTHORITY_OPTIONS, formatRolesTitle } from '~utils/colonyActions.ts';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TEAM_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { RemoveRoleOptionValue } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
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

import {
  transformActionRolesToColonyRoles,
  transformRemovedActionRolesToColonyRoles,
} from './utils.ts';

const displayName = 'v5.common.CompletedAction.partials.SetUserRoles';

interface Props {
  action: ColonyAction;
}

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
  } = action;

  const { data: historicRoles } = useGetColonyHistoricRoleRolesQuery({
    variables: {
      id: `${colonyAddress}_${fromDomain?.nativeId}_${recipientAddress}_${blockNumber}_roles`,
    },
    fetchPolicy: 'cache-and-network',
  });

  const userColonyRoles = transformActionRolesToColonyRoles(
    roles,
    historicRoles?.getColonyHistoricRole,
  );

  const isRemoveAction = !userColonyRoles.length && !!roles;

  const removedActionRoles = isRemoveAction
    ? transformRemovedActionRolesToColonyRoles(roles)
    : [];

  const displayedRoles = isRemoveAction ? removedActionRoles : userColonyRoles;
  const { name: roleName, role } = getRole(displayedRoles);
  const rolesTitle = formatRolesTitle(roles);

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
            authority: AUTHORITY_OPTIONS[0].value,
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
          rowContent={AUTHORITY_OPTIONS[0].label}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.authority',
          })}
          RowIcon={Signature}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.permissions' })}
          rowContent={
            isRemoveAction
              ? formatText({
                  id: 'actionSidebar.managePermissions.roleSelect.remove.title',
                })
              : roleName
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.managePermissions.permissions',
          })}
          RowIcon={ShieldStar}
        />
        <DecisionMethodRow isMotion={action.isMotion || false} />
        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
      <PermissionsTableRow
        role={isRemoveAction ? RemoveRoleOptionValue.remove : role}
        domainId={action.fromDomain?.nativeId}
        userColonyRoles={displayedRoles}
      />
    </>
  );
};

SetUserRoles.displayName = displayName;
export default SetUserRoles;
