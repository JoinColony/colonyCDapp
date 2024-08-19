import { ColonyRole } from '@colony/colony-js';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { getRole, UserRole } from '~constants/permissions.ts';
import { type AvailablePermission } from '~hooks/members/types.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'v5.UserInfoPopover.partials.PermissionTooltipContent';

const MSG = defineMessages({
  defaultPermissionsText: {
    id: `${displayName}.defaultPermissionsText`,
    defaultMessage: 'This member has the following permission types:',
  },
  bundlePermissionsText: {
    id: `${displayName}.bundlePermissionsText`,
    defaultMessage:
      'This member has the {role} permission bundle that includes the following permissions:',
  },
  inheritedAppendText: {
    id: `${displayName}.inheritedAppendText`,
    defaultMessage: '(inherited)',
  },
});

interface PermissionTooltipContentProps {
  userPermissions: AvailablePermission[];
  userInheritedPermissions: AvailablePermission[];
  rolePrepend?: string;
}

const PermissionTooltipContent: FC<PermissionTooltipContentProps> = ({
  userPermissions,
  userInheritedPermissions,
  rolePrepend = '',
}) => {
  const userRoleInDomain = getRole(userPermissions);
  const roleName = `${rolePrepend}${userRoleInDomain.name}`;

  const tooltipDescription =
    userInheritedPermissions.length > 0
      ? formatText(MSG.defaultPermissionsText)
      : formatText(
          userRoleInDomain.role === UserRole.Custom
            ? MSG.defaultPermissionsText
            : MSG.bundlePermissionsText,
          {
            role: <span className="font-bold">{roleName}</span>,
          },
          roleName,
        );

  return (
    <>
      <p className="font-normal">{tooltipDescription}</p>
      <ul className="list-disc pl-4">
        {userPermissions.map((permission) => (
          <li key={permission}>
            {rolePrepend}
            {ColonyRole[permission]}
          </li>
        ))}
        {userInheritedPermissions.map((permission) => (
          <li key={`inherited.${permission}`}>
            {rolePrepend}
            {ColonyRole[permission]} {formatText(MSG.inheritedAppendText)}
          </li>
        ))}
      </ul>
    </>
  );
};

PermissionTooltipContent.displayName = displayName;
export default PermissionTooltipContent;
