import React, { type FC } from 'react';

import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge/index.ts';
import { votingReputationMessages } from '~constants/index.ts';
import { formatText } from '~utils/intl.ts';

import { type PermissionsProps } from '../types.ts';

const displayName = 'common.Extensions.partials.Permissions';

const permissionIconMap = {
  0: {
    text: formatText({ id: 'role.0' }),
    description: formatText(
      votingReputationMessages.votingReputationPermissionRecoveryDescription,
    ),
    name: 'clock-counter-clockwise',
  },
  1: {
    text: formatText({ id: 'role.1' }),
    description: 'TODO!',
    name: 'app-window',
  },
  2: {
    text: formatText({ id: 'role.2' }),
    description: formatText(
      votingReputationMessages.votingReputationPermissionArbitrationDescription,
    ),
    name: 'scales',
  },
  3: {
    text: formatText({ id: 'role.3' }),
    description: formatText(
      votingReputationMessages.votingReputationPermissionArchitectureDescription,
    ),
    name: 'buildings',
  },
  5: {
    text: formatText({ id: 'role.5' }),
    description: formatText(
      votingReputationMessages.votingReputationPermissionFundingDescription,
    ),
    name: 'bank',
  },
  6: {
    text: formatText({ id: 'role.6' }),
    description: 'TODO!',
    name: 'clipboard-text',
  },
};

const Permissions: FC<PermissionsProps> = ({ roles }) => {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1">
      {roles?.map((role) => {
        const { name, text, description } = permissionIconMap[role];
        return (
          <span key={text}>
            <UserPermissionsBadge
              name={name}
              text={text}
              description={description}
            >
              {formatText(text)}
            </UserPermissionsBadge>
          </span>
        );
      })}
    </div>
  );
};

Permissions.displayName = displayName;

export default Permissions;
