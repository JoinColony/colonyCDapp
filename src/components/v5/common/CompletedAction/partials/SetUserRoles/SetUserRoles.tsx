import { ColonyRole } from '@colony/colony-js';
import { UserFocus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { getRole } from '~constants/permissions.ts';
import { type ColonyActionRoles } from '~gql';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';
import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import {
  ActionTypeRow,
  AuthorityRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  PermissionsRow,
  PermissionsTableRow,
  TeamFromRow,
} from '../rows/index.ts';
import { getFormattedTokenAmount } from '../utils.ts';

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
    defaultMessage: 'Pay {recipient} {amount} {token} by {user}',
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
  const { amount, initiatorUser, recipientUser, token, roles } = action;
  const userColonyRoles = transformActionRolesToColonyRoles(roles);
  const { name: roleName, role } = getRole(userColonyRoles);
  const formattedAmount = getFormattedTokenAmount(
    amount || '1',
    token?.decimals,
  );

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          amount: formattedAmount,
          token: action.token?.symbol,
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
          user: initiatorUser ? (
            <UserPopover
              userName={initiatorUser.profile?.displayName}
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserPopover>
          ) : null,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <div>
          <Tooltip
            placement={DEFAULT_TOOLTIP_POSITION}
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.managePermissions.member',
            })}
          >
            <div className="flex items-center gap-2">
              <UserFocus size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.member' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <UserAvatar
            user={{
              profile: action.recipientUser?.profile,
              walletAddress: action.recipientAddress || '',
            }}
            size="xs"
            showUsername
          />
        </div>
        {action.fromDomain?.metadata && (
          <TeamFromRow
            teamMetadata={action.fromDomain.metadata}
            actionType={action.type}
          />
        )}
        <PermissionsRow roleName={roleName} />
        <AuthorityRow />
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
