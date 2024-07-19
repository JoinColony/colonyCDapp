/* eslint-disable camelcase */
import { ColonyRole, Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { boolean, number, object, string } from 'yup';

import { UserRole } from '~constants/permissions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { getObjectKeys } from '~utils/objects/index.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import { getEnumYupSchema } from '~utils/yup/utils.ts';
import {
  type DESCRIPTION_FIELD_NAME,
  type CREATED_IN_FIELD_NAME,
  type DECISION_METHOD_FIELD_NAME,
  type MEMBER_FIELD_NAME,
  type TEAM_FIELD_NAME,
  ACTION_BASE_VALIDATION_SCHEMA,
  type TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

import { extractColonyRoleFromPermissionKey } from './utils.ts';

export const ROLE_FIELD_NAME = 'role';
export const AUTHORITY_FIELD_NAME = 'authority';
export const PERMISSIONS_FIELD_NAME = 'permissions';

export const AVAILABLE_ROLES = [
  ColonyRole.Recovery,
  ColonyRole.Root,
  ColonyRole.Arbitration,
  ColonyRole.Architecture,
  ColonyRole.Funding,
  ColonyRole.Administration,
] as const;

type AvailableRolesUnion = (typeof AVAILABLE_ROLES)[number];

export type Permissions = {
  [K in AvailableRolesUnion as `role_${K}`]: boolean;
};

export type ManagePermissionsFormValues = {
  [TITLE_FIELD_NAME]: string;
  [MEMBER_FIELD_NAME]: string;
  [TEAM_FIELD_NAME]: number;
  [CREATED_IN_FIELD_NAME]: number;
  [ROLE_FIELD_NAME]: string | undefined;
  [AUTHORITY_FIELD_NAME]: Authority;
  [PERMISSIONS_FIELD_NAME]: Permissions | undefined;
  [DECISION_METHOD_FIELD_NAME]: DecisionMethod;
  [DESCRIPTION_FIELD_NAME]: string | undefined;
  // These are intended to be used as reference values when running form validations
  // and won't be included in the form submission
  /**
   * Keeps track of a user's current DB role wrapper which is taken from the role meta i.e. owner | mod | payer | admin | custom
   * @internal
   */
  _dbuserRoleWrapperForDomain?: ManagePermissionsFormValues['role'];
  /**
   * Keeps track of a user's specific DB roles for a domain
   * @internal
   */
  _dbUserRolesForDomain?: ColonyRole[];
  /**
   * Keeps track of a user's inherited DB roles for a domain
   * @internal
   */
  _dbUserInheritedRolesForDomain?: ColonyRole[];
};

export type SchemaTestContext = { parent: ManagePermissionsFormValues };

export const permissionsSchema = object({
  role_0: boolean().default(false),
  role_1: boolean().default(false),
  role_2: boolean().default(false),
  role_3: boolean().default(false),
  role_5: boolean().default(false),
  role_6: boolean().default(false),
});

export enum UserRoleModifier {
  Remove = 'Remove',
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

const MSG = defineMessages({
  samePermissionsApplied: {
    id: 'managePermissionsFormError.samePermissionsApplied',
    defaultMessage: 'This user already has these permissions',
  },
  permissionRequired: {
    id: 'managePermissionsFormError.permissionsRequired',
    defaultMessage: 'You have to enable at least one permission',
  },
  permissionsInherited: {
    id: 'managePermissionsFormError.permissionsInherited',
    defaultMessage:
      'Permissions inherited from a parent team, select the parent team to remove permissions.',
  },
  noPermissionsInDomain: {
    id: 'managePermissionsFormError.noPermissionsInDomain',
    defaultMessage: 'Member does not have permissions in this team',
  },
});

export const validationSchema = object()
  .shape<ManagePermissionsFormValues>({
    member: string().required(),
    team: number().required(),
    createdIn: number().defined(),
    role: string()
      .test(
        ROLE_FIELD_NAME,
        formatMessage(MSG.permissionsInherited),
        (
          role,
          {
            parent: { member, team, _dbUserInheritedRolesForDomain },
          }: SchemaTestContext,
        ) => {
          if (
            member &&
            team !== Id.RootDomain &&
            role === UserRoleModifier.Remove
          ) {
            return !_dbUserInheritedRolesForDomain?.length;
          }

          return true;
        },
      )
      .test(
        ROLE_FIELD_NAME,
        formatMessage(MSG.noPermissionsInDomain),
        (
          role,
          {
            parent: { member, team, _dbUserRolesForDomain },
          }: SchemaTestContext,
        ) => {
          if (member && team && role === UserRoleModifier.Remove) {
            return !!_dbUserRolesForDomain?.length;
          }

          return true;
        },
      )
      .test(
        ROLE_FIELD_NAME,
        formatMessage(MSG.samePermissionsApplied),
        (
          role,
          {
            parent: { member, team, _dbuserRoleWrapperForDomain },
          }: SchemaTestContext,
        ) => {
          if (member && team && role && role !== UserRole.Custom) {
            return role !== _dbuserRoleWrapperForDomain;
          }

          return true;
        },
      )
      .required(),
    authority: getEnumYupSchema(Authority).required(),
    permissions: permissionsSchema.when('role', {
      is: UserRole.Custom,
      then: (schema: typeof permissionsSchema) =>
        schema
          .test(
            PERMISSIONS_FIELD_NAME,
            formatMessage(MSG.permissionRequired),
            (permissions, { parent: { member, team } }: SchemaTestContext) => {
              if (member && team && permissions) {
                return Object.values(permissions).some(Boolean);
              }

              return true;
            },
          )
          .test(
            PERMISSIONS_FIELD_NAME,
            formatMessage(MSG.samePermissionsApplied),
            (
              permissions,
              {
                parent: { member, team, _dbUserRolesForDomain },
              }: SchemaTestContext,
            ) => {
              if (member && team && permissions && _dbUserRolesForDomain) {
                // At this point, the user's current and db-stored roles are represented as ColonyRole[]: [0, 1, 5, 6]
                // Meanwhile the form-formatted roles are represented as an object: { role_0: false, ... role_6: true }
                // We'd want to filter the truthy form-formatted roles and map their ColonyRole suffixes
                // i.e. { role_0: false, role_1: true, role_2: false, role_4: true } => [1, 4]
                const newPermissions = getObjectKeys(permissions)
                  .filter((permissionKey) => permissions[permissionKey])
                  .map(extractColonyRoleFromPermissionKey);

                return (
                  JSON.stringify(_dbUserRolesForDomain.sort()) !==
                  JSON.stringify(newPermissions.sort())
                );
              }

              return true;
            },
          ),
    }),
    decisionMethod: getEnumYupSchema(DecisionMethod).required(),
    title: string().required(), // @TODO these two dont get inferred from the schema with concat
    description: string().optional(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export const MANAGE_PERMISSIONS_ACTION_FORM_ID =
  'manage-permissions-action-form-id';
