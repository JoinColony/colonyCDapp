import {
  Gear,
  HandCoins,
  HandHeart,
  Sliders,
  Sparkle,
  UserCircleMinus,
} from '@phosphor-icons/react';
import React from 'react';

import {
  CUSTOM_USER_ROLE,
  UserRole,
  USER_ROLES,
} from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import {
  type CardSelectOption,
  type CardSelectOptionsGroup,
} from '~v5/common/Fields/CardSelect/types.ts';

import { UserRoleModifier } from './consts.ts';
import RoleOptionLabel from './partials/RoleOptionLabel/index.ts';
import { type UserRoleSelectMeta } from './types.ts';

const ROLE_SELECT_META: Record<
  Exclude<UserRole, 'custom'>,
  UserRoleSelectMeta
> = {
  [UserRole.Mod]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.mod.desc',
    }),
    icon: HandHeart,
  },
  [UserRole.Payer]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.payer.desc',
    }),
    icon: HandCoins,
  },
  [UserRole.Admin]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.admin.desc',
    }),
    icon: Gear,
  },
  [UserRole.Owner]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.owner.desc',
    }),
    icon: Sparkle,
  },
};

const PermissionsOptions: CardSelectOptionsGroup<string>[] = [
  {
    key: '1',
    title: 'Permission types',
    options: [
      ...USER_ROLES.map<CardSelectOption<string>>(({ name, role }) => {
        const { description, icon, name: metaName } = ROLE_SELECT_META[role];

        return {
          label: (
            <RoleOptionLabel icon={icon} description={description}>
              {metaName || name}
            </RoleOptionLabel>
          ),
          value: role,
        };
      }),
      {
        label: (
          <RoleOptionLabel
            icon={Sliders}
            description={formatText({
              id: 'actionSidebar.managePermissions.roleSelect.custom.desc',
            })}
          >
            {formatText({
              id: 'actionSidebar.managePermissions.roleSelect.custom.title',
            })}
          </RoleOptionLabel>
        ),
        value: CUSTOM_USER_ROLE.role,
      },
    ],
  },
  {
    key: '2',
    title: 'Remove permissions',
    options: [
      {
        label: (
          <RoleOptionLabel
            icon={UserCircleMinus}
            description={formatText({
              id: 'actionSidebar.managePermissions.roleSelect.remove.desc',
            })}
          >
            {formatText({
              id: 'actionSidebar.managePermissions.roleSelect.remove.title',
            })}
          </RoleOptionLabel>
        ),
        value: UserRoleModifier.Remove,
      },
    ],
  },
];

export default PermissionsOptions;
