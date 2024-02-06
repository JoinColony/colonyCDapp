import {
  AppWindow,
  Bank,
  Buildings,
  ClipboardText,
  ClockCounterClockwise,
  Scales,
} from '@phosphor-icons/react';
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
    icon: ClockCounterClockwise,
  },
  1: {
    text: formatText({ id: 'role.1' }),
    description: 'TODO!',
    icon: AppWindow,
  },
  2: {
    text: formatText({ id: 'role.2' }),
    description: formatText(
      votingReputationMessages.votingReputationPermissionArbitrationDescription,
    ),
    icon: Scales,
  },
  3: {
    text: formatText({ id: 'role.3' }),
    description: formatText(
      votingReputationMessages.votingReputationPermissionArchitectureDescription,
    ),
    icon: Buildings,
  },
  5: {
    text: formatText({ id: 'role.5' }),
    description: formatText(
      votingReputationMessages.votingReputationPermissionFundingDescription,
    ),
    icon: Bank,
  },
  6: {
    text: formatText({ id: 'role.6' }),
    description: 'TODO!',
    icon: ClipboardText,
  },
};

const Permissions: FC<PermissionsProps> = ({ roles }) => {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1">
      {roles?.map((role) => {
        const { icon, text, description } = permissionIconMap[role];
        return (
          <span key={text}>
            <UserPermissionsBadge
              icon={icon}
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
