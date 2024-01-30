import { ColonyRole } from '@colony/colony-js';
import React, { type FC } from 'react';

import { USER_ROLE, USER_ROLES } from '~constants/permissions.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/PermissionsBadge.tsx';

import { type RolesTooltipProps } from './types.ts';

const RolesTooltip: FC<RolesTooltipProps> = ({
  role,
  roleDescription,
  tooltipProps,
}) => {
  return (
    <Tooltip
      tooltipContent={
        <>
          {roleDescription ||
            formatText({ id: 'role.description' }, { role: role.name })}
          <ul className="list-disc font-medium pl-4">
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
        iconName={role.role !== USER_ROLE.Custom ? 'user' : 'users-three'}
      />
    </Tooltip>
  );
};

export default RolesTooltip;
