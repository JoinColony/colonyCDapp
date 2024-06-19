import { ColonyRole } from '@colony/colony-js';
import { type InferType, mixed, object, string, number } from 'yup';

import { CUSTOM_USER_ROLE } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export const FIELD_NAME = {
  MEMBER: 'member',
  TEAM: 'team',
  CREATED_IN: 'createdIn',
  ROLE: 'role',
  AUTHORITY: 'authority',
  PERMISSIONS: 'permissions',
  DECISION_METHOD: 'decisionMethod',
} as const;

export const validationSchema = object()
  .shape({
    member: string().required(),
    team: number().required(),
    createdIn: number().required(),
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
