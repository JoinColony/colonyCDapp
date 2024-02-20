import { ColonyRole } from '@colony/colony-js';
import {
  Gear,
  HandCoins,
  HandHeart,
  Sliders,
  Sparkle,
  UserCircleMinus,
} from '@phosphor-icons/react';
import React from 'react';
import { type InferType, mixed, object, string, number } from 'yup';

import {
  CUSTOM_USER_ROLE,
  UserRole,
  USER_ROLES,
} from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.tsx';
import {
  type CardSelectOption,
  type CardSelectOptionsGroup,
} from '~v5/common/Fields/CardSelect/types.ts';

import RoleOptionLabel from './partials/RoleOptionLabel/index.ts';
import { type UserRoleSelectMeta } from './types.ts';

export const validationSchema = object()
  .shape({
    member: string().required(),
    team: number().required(),
    createdIn: number(),
    role: string().required(),
    authority: string().required(),
    permissions: mixed<Partial<Record<string, boolean>>>().test(
      'permissions',
      'You have to select at least one permission.',
      (value, { parent }) => {
        if (parent.role !== CUSTOM_USER_ROLE.role) {
          return true;
        }

        return Object.values(value || {}).some(Boolean);
      },
    ),
    decisionMethod: string().defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManagePermissionsFormValues = InferType<typeof validationSchema>;

export enum Authority {
  ViaMultiSig = 'via-multi-sig',
  Own = 'own',
}

export const AuthorityOptions: CardSelectOption<string>[] = [
  // @TODO: Uncomment when multi-sig is ready
  // {
  //   label: formatText({ id: 'actionSidebar.authority.viaMultiSig' }),
  //   value: Authority.ViaMultiSig,
  // },
  {
    label: formatText({ id: 'actionSidebar.authority.own' }),
    value: Authority.Own,
  },
];

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

export enum RemoveRoleOptionValue {
  remove = 'remove',
}

export const PERMISSIONS_OPTIONS: CardSelectOptionsGroup<string>[] = [
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
        value: RemoveRoleOptionValue.remove,
      },
    ],
  },
];

export const AVAILABLE_ROLES = [
  ColonyRole.Root,
  ColonyRole.Administration,
  ColonyRole.Architecture,
  ColonyRole.Funding,
  ColonyRole.Recovery,
  ColonyRole.Arbitration,
];
