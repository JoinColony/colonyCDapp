import { ColonyRole } from '@colony/colony-js';
import { type InferType, mixed, object, string, number } from 'yup';

import { CUSTOM_USER_ROLE } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export const FIELD_NAME = {
  MEMBER: 'member',
  TEAM: 'team',
  CREATED_IN: 'createdIn',
  ROLE: 'role',
  AUTHORITY: 'authority',
  PERMISSIONS: 'permissions',
  DECISION_METHOD: DECISION_METHOD_FIELD_NAME,
} as const;

type PermissionRole = `role_${(typeof AVAILABLE_ROLES)[number]}`;

export const validationSchema = object()
  .shape({
    [FIELD_NAME.MEMBER]: string().required(),
    [FIELD_NAME.TEAM]: number().required(),
    [FIELD_NAME.CREATED_IN]: number().required(),
    [FIELD_NAME.ROLE]: string().required(),
    [FIELD_NAME.AUTHORITY]: string().required(),
    [FIELD_NAME.PERMISSIONS]: mixed<
      Partial<Record<PermissionRole, boolean>>
    >().test(
      'permissions',
      'You have to select at least one permission.',
      (value, { parent }) => {
        if (parent.role !== CUSTOM_USER_ROLE.role) {
          return true;
        }

        return Object.values(value || {}).some(Boolean);
      },
    ),
    [FIELD_NAME.DECISION_METHOD]: string().defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManagePermissionsFormValues = InferType<typeof validationSchema>;

export const AVAILABLE_ROLES = [
  ColonyRole.Root,
  ColonyRole.Administration,
  ColonyRole.Architecture,
  ColonyRole.Funding,
  ColonyRole.Recovery,
  ColonyRole.Arbitration,
];

export enum RemoveRoleOptionValue {
  remove = 'remove',
}

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
