import { ColonyRole } from '@colony/colony-js';
import React, { FC } from 'react';

import { getRole } from '~constants/permissions';
import { useColonyContext } from '~hooks';
import Tooltip from '~shared/Extensions/Tooltip';
import { getAllUserRoles } from '~transformers';
import { formatText } from '~utils/intl';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge';
import { PermissionRowProps } from './types';

const PermissionRow: FC<PermissionRowProps> = ({ contributorAddress }) => {
  const { colony } = useColonyContext();
  const allRoles = getAllUserRoles(colony, contributorAddress);
  const permissionRole = getRole(allRoles);

  return (
    <div className="flex items-center">
      <Tooltip
        tooltipContent={
          <>
            {formatText(
              { id: 'role.description' },
              { role: permissionRole.name },
            )}
            <ul className="list-disc font-medium pl-4 mb-4">
              {permissionRole.permissions.map((permission) => (
                <li key={permission}>{ColonyRole[permission]}</li>
              ))}
            </ul>
            <a href="/">{formatText({ id: 'learn.more' })}</a>
          </>
        }
      >
        <PermissionsBadge iconName="user" text={permissionRole.name} />
      </Tooltip>
    </div>
  );
};

export default PermissionRow;
