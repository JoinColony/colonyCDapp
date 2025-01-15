import { ColonyRole } from '@colony/colony-js';
import { User, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import {
  getInheritedPermissions,
  getRole,
  USER_ROLES,
} from '~constants/permissions.ts';
import { type AvailablePermission } from '~hooks/members/types.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/PermissionsBadge.tsx';

import PermissionTooltipContent from './PermissionTooltipContent.tsx';

const displayName = 'v5.UserInfoPopover.partials.PermissionTooltip';

const MSG = defineMessages({
  multiSigPrepend: {
    id: `${displayName}.multiSigPrepend`,
    defaultMessage: 'Multi-sig ',
  },
});

interface PermissionTooltipProps {
  isMultiSig?: boolean;
  isRootDomain?: boolean;
  userPermissionsInDomain: AvailablePermission[];
  userPermissionsInParentDomain: AvailablePermission[];
  showRoleLabel?: boolean;
}

const PermissionTooltip: FC<PermissionTooltipProps> = ({
  isMultiSig = false,
  isRootDomain = false,
  userPermissionsInDomain,
  userPermissionsInParentDomain,
  showRoleLabel = false,
}) => {
  const userInheritedPermissions = getInheritedPermissions({
    parentPermissions: userPermissionsInParentDomain,
    currentPermissions: userPermissionsInDomain,
    isRootDomain,
  });

  const hasPermissions =
    userPermissionsInDomain.length > 0 || userInheritedPermissions.length > 0;

  if (!hasPermissions) {
    return null;
  }

  let mergedPermissions = [
    ...new Set([...userPermissionsInDomain, ...userPermissionsInParentDomain]),
  ];

  if (!isRootDomain) {
    mergedPermissions = mergedPermissions.filter(
      (permission) =>
        permission !== ColonyRole.Root && permission !== ColonyRole.Recovery,
    );
  }

  const role = getRole(mergedPermissions);

  return (
    // Add singleBadge container when there is only one badge
    <div className="only:flex only:w-full only:justify-end only:@container/singleBadge">
      <Tooltip
        placement="top"
        className="w-fit"
        tooltipContent={
          <PermissionTooltipContent
            userPermissions={userPermissionsInDomain}
            userInheritedPermissions={userInheritedPermissions}
            rolePrepend={
              isMultiSig ? formatText(MSG.multiSigPrepend) : undefined
            }
          />
        }
      >
        <PermissionsBadge
          icon={isMultiSig ? UsersThree : User}
          pillSize={showRoleLabel ? 'medium' : 'small'}
          // If only one badge, show at a smaller container width
          textClassName="hidden @[6rem]/singleBadge:block @[11rem]/cardDetails:block"
          text={
            showRoleLabel
              ? USER_ROLES.find(
                  ({ role: roleField }) => roleField === role.role,
                )?.name || formatText({ id: 'role.custom' })
              : undefined
          }
        />
      </Tooltip>
    </div>
  );
};

PermissionTooltip.displayName = displayName;
export default PermissionTooltip;
