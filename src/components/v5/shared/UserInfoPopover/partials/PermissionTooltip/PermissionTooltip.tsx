import { ColonyRole } from '@colony/colony-js';
import { User, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

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
}

const PermissionTooltip: FC<PermissionTooltipProps> = ({
  isMultiSig = false,
  isRootDomain = false,
  userPermissionsInDomain,
  userPermissionsInParentDomain,
}) => {
  const getInheritedPermissions = (): AvailablePermission[] => {
    if (isRootDomain) {
      return [];
    }

    return userPermissionsInParentDomain.filter(
      (permission) =>
        permission !== ColonyRole.Root &&
        permission !== ColonyRole.Recovery &&
        !userPermissionsInDomain.includes(permission),
    );
  };

  const userInheritedPermissions = getInheritedPermissions();

  const hasPermissions =
    userPermissionsInDomain.length > 0 || userInheritedPermissions.length > 0;

  if (!hasPermissions) {
    return null;
  }

  return (
    <Tooltip
      placement="top"
      tooltipContent={
        <PermissionTooltipContent
          userPermissions={userPermissionsInDomain}
          userInheritedPermissions={userInheritedPermissions}
          rolePrepend={isMultiSig ? formatText(MSG.multiSigPrepend) : undefined}
        />
      }
    >
      <PermissionsBadge
        icon={isMultiSig ? UsersThree : User}
        pillSize="small"
      />
    </Tooltip>
  );
};

PermissionTooltip.displayName = displayName;
export default PermissionTooltip;
