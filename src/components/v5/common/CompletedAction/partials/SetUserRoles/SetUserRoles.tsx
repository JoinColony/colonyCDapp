import { ColonyRole } from '@colony/colony-js';
import { ShieldStar, Signature, UserFocus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { getRole } from '~constants/permissions.ts';
import { type ColonyActionRoles } from '~gql';
import { type ColonyAction } from '~types/graphql.ts';
import { AUTHORITY_OPTIONS, formatRolesTitle } from '~utils/colonyActions.ts';
import { formatText } from '~utils/intl.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
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

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Manage permissions',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      '{direction} {rolesChanged} permissions for {recipient} in {fromDomain} by {initiator}',
  },
});

const transformActionRolesToColonyRoles = (
  roles: ColonyActionRoles | null | undefined,
): ColonyRole[] => {
  if (!roles) return [];
  const roleKeys = Object.keys(roles);
  const colonyRoles: ColonyRole[] = roleKeys
    .filter((key) => roles[key])
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
  const { customTitle = formatText(MSG.defaultTitle) } = action.metadata || {};
  const { initiatorUser, recipientUser, roles } = action;
  const userColonyRoles = transformActionRolesToColonyRoles(roles);
  const { name: roleName, role } = getRole(userColonyRoles);
  const rolesTitle = formatRolesTitle(roles);

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          direction: rolesTitle.direction,
          rolesChanged: rolesTitle.roleTitle,
          fromDomain: action.fromDomain?.metadata?.name,
          initiator: initiatorUser ? (
            <UserPopover
              userName={initiatorUser.profile?.displayName}
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserPopover>
          ) : null,
          recipient: recipientUser ? (
            <UserPopover
              userName={recipientUser.profile?.displayName}
              walletAddress={recipientUser.walletAddress}
              user={recipientUser}
              withVerifiedBadge={false}
            >
              {recipientUser.profile?.displayName}
            </UserPopover>
          ) : null,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.member' })}
          rowContent={
            <UserAvatar
              user={{
                profile: action.recipientUser?.profile,
                walletAddress: action.recipientAddress || '',
              }}
              size="xs"
              showUsername
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
          rowContent={roleName}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.managePermissions.permissions',
          })}
          RowIcon={ShieldStar}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.authority' })}
          rowContent={AUTHORITY_OPTIONS[0].label}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.authority',
          })}
          RowIcon={Signature}
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
        role={role}
        domainId={action.fromDomain?.nativeId}
        userColonyRoles={userColonyRoles}
      />
    </>
  );
};

SetUserRoles.displayName = displayName;
export default SetUserRoles;
