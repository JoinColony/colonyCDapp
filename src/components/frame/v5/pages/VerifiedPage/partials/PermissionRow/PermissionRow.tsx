import { ColonyRole } from '@colony/colony-js';
import { User } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { getRole } from '~constants/permissions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { formatText } from '~utils/intl.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/index.ts';

import { type PermissionRowProps } from './types.ts';

const displayName = 'v5.pages.VerifiedPage.partials.PermissionRow';

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
            <ul className="mb-4 list-disc pl-4 font-medium">
              {permissionRole.permissions.map((permission) => (
                <li key={permission}>{ColonyRole[permission]}</li>
              ))}
            </ul>
            <a
              href="https://docs.colony.io/learn/advanced-concepts/permissions"
              target="_blank"
              rel="noreferrer"
            >
              {formatText({ id: 'learn.more' })}
            </a>
          </>
        }
      >
        <PermissionsBadge
          icon={User}
          text={permissionRole.name}
          className="!py-1.5 text-gray-900"
        />
      </Tooltip>
    </div>
  );
};

PermissionRow.displayName = displayName;

export default PermissionRow;
