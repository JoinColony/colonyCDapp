import { ColonyRole } from '@colony/colony-js';
import React from 'react';
import { InferType, mixed, object, string } from 'yup';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import {
  CUSTOM_USER_ROLE,
  UserRole,
  USER_ROLE,
  USER_ROLES,
} from '~constants/permissions';
import { formatText } from '~utils/intl';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';
import {
  CardSelectOption,
  CardSelectOptionsGroup,
} from '~v5/common/Fields/CardSelect/types';
import RoleOptionLabel from './partials/RoleOptionLabel';
import { UserRoleSelectMeta } from './types';

export const validationSchema = object()
  .shape({
    member: string().required(),
    team: string().required(),
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
    description: string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManagePermissionsFormValues = InferType<typeof validationSchema>;

export const AUTHORITY = {
  ViaMultiSig: 'via-multi-sig',
  Own: 'own',
} as const;

export type Authority = (typeof AUTHORITY)[keyof typeof AUTHORITY];

export const AUTHORITY_OPTIONS: CardSelectOption<string>[] = [
  // @TODO: Uncomment when multi-sig is ready
  // {
  //   label: formatText({ id: 'actionSidebar.authority.viaMultiSig' }),
  //   value: AUTHORITY.ViaMultiSig,
  // },
  {
    label: formatText({ id: 'actionSidebar.authority.own' }),
    value: AUTHORITY.Own,
  },
];

const ROLE_SELECT_META: Record<
  Exclude<UserRole, 'custom'>,
  UserRoleSelectMeta
> = {
  [USER_ROLE.Mod]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.mod.desc',
    }),
    icon: 'hand-heart',
  },
  [USER_ROLE.Payer]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.payer.desc',
    }),
    icon: 'hand-coins',
  },
  [USER_ROLE.Admin]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.admin.desc',
    }),
    icon: 'gear',
  },
  [USER_ROLE.Owner]: {
    description: formatText({
      id: 'actionSidebar.managePermissions.roleSelect.owner.desc',
    }),
    icon: 'sparkle',
  },
};

export const REMOVE_ROLE_OPTION_VALUE = 'remove' as const;

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
            icon="sliders"
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
            icon="user-circle-minus"
            description={formatText({
              id: 'actionSidebar.managePermissions.roleSelect.remove.desc',
            })}
          >
            {formatText({
              id: 'actionSidebar.managePermissions.roleSelect.remove.title',
            })}
          </RoleOptionLabel>
        ),
        value: REMOVE_ROLE_OPTION_VALUE,
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
