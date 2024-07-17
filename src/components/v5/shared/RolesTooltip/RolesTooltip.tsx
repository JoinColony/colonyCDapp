import { ColonyRole } from '@colony/colony-js';
import { User, UsersThree } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { UserRole, USER_ROLES } from '~constants/permissions.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/PermissionsBadge.tsx';

import { type RolesTooltipProps } from './types.ts';

const RolesTooltip: FC<RolesTooltipProps> = ({
  role,
  isRoleInherited,
  roleDescription,
  tooltipProps,
}) => {
  return (
    <Tooltip
      tooltipContent={
        <>
          {roleDescription ||
            formatText(
              {
                id: isRoleInherited
                  ? 'role.description.inherited'
                  : 'role.description',
              },
              { role: role.name },
            )}
          <ul className="list-disc pl-4 font-medium">
            {role.permissions.map((permission) => (
              <li key={permission}>{ColonyRole[permission]}</li>
            ))}
          </ul>
        </>
      }
      {...tooltipProps}
    >
      <PermissionsBadge
        text={
          USER_ROLES.find(({ role: roleField }) => roleField === role.role)
            ?.name || formatText({ id: 'role.custom' })
        }
        icon={role.role !== UserRole.Custom ? User : UsersThree}
      />
    </Tooltip>
  );
};

export default RolesTooltip;
