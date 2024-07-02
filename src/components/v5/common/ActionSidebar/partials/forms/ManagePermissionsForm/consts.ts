import { ColonyRole } from '@colony/colony-js';
import { type InferType, mixed, object, string, number } from 'yup';

import { CUSTOM_USER_ROLE } from '~constants/permissions.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

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
