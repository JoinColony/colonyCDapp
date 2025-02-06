/* eslint-disable camelcase */
import { ColonyRole, Id } from '@colony/colony-js';
import { isNaN } from 'lodash';
import difference from 'lodash/difference';
import { defineMessages } from 'react-intl';
import { boolean, number, object, string, type TestContext } from 'yup';

import { PERMISSIONS_TABLE_CONTENT, UserRole } from '~constants/permissions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import {
  capitalizeFirstLetter,
  getCommaSeparatedStringList,
} from '~utils/strings.ts';
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

import {
  arePermissionsTheSame,
  getFormattedRole,
  getPermissionName,
  getPermissionsForRole,
  mapPermissions,
} from './utils.ts';

export const ROLE_FIELD_NAME = 'role';
export const AUTHORITY_FIELD_NAME = 'authority';
export const PERMISSIONS_FIELD_NAME = 'permissions';

export const AVAILABLE_PERMISSIONS = [
  ColonyRole.Recovery,
  ColonyRole.Root,
  ColonyRole.Arbitration,
  ColonyRole.Architecture,
  ColonyRole.Funding,
  ColonyRole.Administration,
] as const;

type AvailablePermissionsUnion = (typeof AVAILABLE_PERMISSIONS)[number];

export type Permissions = {
  [K in AvailablePermissionsUnion as `role_${K}`]: boolean;
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
   * Keeps track of a user's current DB user role which is taken from the role meta i.e. owner | mod | payer | admin | custom
   * @internal
   */
  _dbRoleForDomain?: ManagePermissionsFormValues['role'];
  /**
   * Keeps track of a user's specific DB permissions for a domain
   * @internal
   */
  _dbPermissionsForDomain?: ColonyRole[];
  /**
   * Keeps track of a user's inherited DB permissions for a domain
   * @internal
   */
  _dbInheritedPermissions?: ColonyRole[];
  /**
   * Keeps track of a user's inherited role for a domain
   * @internal
   */
  _dbInheritedRole?: ManagePermissionsFormValues['role'];
};

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

export const ROLE_TIERS = {
  [UserRole.Owner]: PERMISSIONS_TABLE_CONTENT.owner.permissions.length,
  [UserRole.Admin]: PERMISSIONS_TABLE_CONTENT.admin.permissions.length,
  [UserRole.Payer]: PERMISSIONS_TABLE_CONTENT.payer.permissions.length,
  [UserRole.Mod]: PERMISSIONS_TABLE_CONTENT.mod.permissions.length,
};

const MSG = defineMessages({
  samePermissionsApplied: {
    id: 'managePermissionsFormError.samePermissionsApplied',
    defaultMessage: 'This member already has these permissions',
  },
  sameInheritedRoleApplied: {
    id: 'managePermissionsFormError.sameInheritedRoleApplied',
    defaultMessage:
      'This member already has {role} permissions inherited from the parent team',
  },
  rolePermissionsMissing: {
    id: 'managePermissionsFormError.rolePermissionsMissing',
    defaultMessage:
      'This member already has {role} permissions inherited from a parent team. You can select the Custom permission type and enable the {missingPermissions} {count, plural, one {permission} other {permissions}} to have the required permissions in this team.',
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
    member: string().required(formatText({ id: 'errors.member.required' })),
    team: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required(formatText({ id: 'errors.domain' })),
    createdIn: number().defined(),
    role: string()
      .test({
        name: ROLE_FIELD_NAME,
        test: (
          formRole,
          {
            parent: {
              member,
              team,
              _dbInheritedPermissions: dbInheritedPermissions,
              _dbPermissionsForDomain: dbPermissionsForDomain,
              _dbInheritedRole: dbInheritedRole,
              _dbRoleForDomain: dbRoleForDomain,
            },
            createError,
          }: TestContext,
        ) => {
          if (member && team && formRole && formRole !== UserRole.Custom) {
            if (formRole === UserRoleModifier.Remove) {
              // SCOPE: Permissions field is set to "Remove permissions"

              // If the user does not have permissions in the domain, throw an error right away
              if (!dbPermissionsForDomain?.length) {
                return createError({
                  message: formatText(MSG.noPermissionsInDomain),
                  path: ROLE_FIELD_NAME,
                });
              }

              // If the Team field is set to a subdomain
              if (team !== Id.RootDomain) {
                if (dbInheritedPermissions?.length) {
                  // Return an error when the user has inherited Permissions
                  return createError({
                    message: formatText(MSG.permissionsInherited),
                    path: ROLE_FIELD_NAME,
                  });
                }
              }
            } else {
              // SCOPE: Permissions field IS NOT set to "Remove permissions"

              // If the team is set to a Parent domain
              if (team === Id.RootDomain) {
                // Throw an error if the user is being given the same role
                if (formRole === dbInheritedRole) {
                  return createError({
                    message: formatText(MSG.samePermissionsApplied),
                    path: ROLE_FIELD_NAME,
                  });
                }
              }

              // If the team is set to a subdomain
              if (team !== Id.RootDomain) {
                // Roles for domains get a bit complex because it could be that the inherited role is Mod.
                // Then Funding and Arbitration were added for the user in Team Andromeda.
                // This effectively gives Payer permissions for the user in Team Andromeda even though the
                // inherited role is Mod.
                // So we really have to know the derived role for a given subdomain which is held in _dbInheritedRole

                // If the same role is being given to a user, determine if the role is a
                // a derived or inherited role. Adjust the error message accordingly.
                if (formRole === dbRoleForDomain) {
                  // If the roles happen to be the same but the domain permissions are only
                  // partially made up of the inherited permissions, we can conclude that the current
                  // form permissions are made up of inherited permissions + user-selected permissions
                  if (
                    dbInheritedPermissions?.length !==
                    dbPermissionsForDomain?.length
                  ) {
                    // In which case, we use the generic same permission error message
                    return createError({
                      message: formatText(MSG.samePermissionsApplied),
                      path: ROLE_FIELD_NAME,
                    });
                  }

                  // Otherwise, show an error that tells the user what their inherited role is
                  return createError({
                    message: formatText(MSG.sameInheritedRoleApplied, {
                      role: capitalizeFirstLetter(formRole),
                    }),
                    path: ROLE_FIELD_NAME,
                  });
                }

                // If the DB inherited role is one of: owner | payer | admin | mod
                if (dbInheritedRole !== UserRole.Custom) {
                  // If the role is being upgraded
                  if (ROLE_TIERS[formRole] > ROLE_TIERS[dbInheritedRole]) {
                    // Figure out the remaining permissions required to satisfy the Role selected
                    const requiredPermissions = getPermissionsForRole(formRole);

                    const missingPermissions = difference(
                      requiredPermissions,
                      dbInheritedPermissions,
                    ).map(getPermissionName);

                    // Then throw an error message showing what other Permissions are needed
                    return createError({
                      message: formatText(MSG.rolePermissionsMissing, {
                        role: getFormattedRole({
                          role: dbInheritedRole,
                          permissions: dbInheritedPermissions,
                        }),
                        missingPermissions:
                          getCommaSeparatedStringList(missingPermissions),
                        count: missingPermissions.length,
                      }),
                      path: ROLE_FIELD_NAME,
                    });
                  }

                  // If the role is being downgraded
                  if (ROLE_TIERS[formRole] < ROLE_TIERS[dbInheritedRole]) {
                    // Throw an error because we know the user has inherited permissions
                    return createError({
                      message: formatText(MSG.permissionsInherited),
                      path: ROLE_FIELD_NAME,
                    });
                  }
                }

                // If the DB inherited role is custom
                if (dbInheritedRole === UserRole.Custom) {
                  if (dbRoleForDomain === formRole) {
                    return createError({
                      message: formatText(MSG.samePermissionsApplied),
                      path: ROLE_FIELD_NAME,
                    });
                  }

                  const requiredFormPermissions =
                    getPermissionsForRole(formRole);

                  const missingPermissions = difference(
                    requiredFormPermissions,
                    dbPermissionsForDomain,
                  ).map(getPermissionName);

                  // If we detect that a user has selected a Role which requires more permissions,
                  // throw an error message showing what other Permissions are needed
                  if (missingPermissions?.length) {
                    return createError({
                      message: formatText(MSG.rolePermissionsMissing, {
                        role: getFormattedRole({
                          role: dbInheritedRole,
                          permissions: dbInheritedPermissions,
                        }),
                        missingPermissions:
                          getCommaSeparatedStringList(missingPermissions),
                        count: missingPermissions.length,
                      }),
                      path: ROLE_FIELD_NAME,
                    });
                  }

                  const isAnInheritedPermissionGoingToBeRemoved =
                    dbInheritedPermissions.some(
                      (inheritedPermission) =>
                        !requiredFormPermissions.includes(inheritedPermission),
                    );

                  // If we detect that a user has selected a Role which removes at least one
                  // inherited permission from a user, throw an error
                  if (isAnInheritedPermissionGoingToBeRemoved) {
                    return createError({
                      message: formatText(MSG.permissionsInherited),
                      path: ROLE_FIELD_NAME,
                    });
                  }
                }
              }
            }
          }

          return true;
        },
      })
      .required(formatText({ id: 'errors.role.required' })),
    authority: getEnumYupSchema(Authority).required(
      formatText({ id: 'errors.authority.required' }),
    ),
    permissions: permissionsSchema.when('role', {
      is: UserRole.Custom,
      then: (schema: typeof permissionsSchema) =>
        schema
          .test(
            PERMISSIONS_FIELD_NAME,
            formatMessage(MSG.permissionRequired),
            (permissions, { parent: { member, team } }: TestContext) => {
              if (member && team && permissions) {
                return Object.values(permissions).some(Boolean);
              }

              return true;
            },
          )
          .test({
            name: PERMISSIONS_FIELD_NAME,
            test: (
              permissions,
              {
                parent: {
                  member,
                  team,
                  _dbInheritedPermissions: dbInheritedPermissions,
                  _dbPermissionsForDomain: dbPermissionsForDomain,
                },
                createError,
              }: TestContext,
            ) => {
              if (member && team && permissions && dbPermissionsForDomain) {
                // At this point, the user's current and db-stored permissions are represented as ColonyRole[]: [0, 1, 5, 6]
                // Meanwhile the form-formatted permissions are represented as an object: { role_0: false, ... role_6: true }
                // We'd want to filter the truthy form-formatted permissions and map their ColonyRole suffixes
                // i.e. { role_0: false, role_1: true, role_2: false, role_4: true } => [1, 4]
                const formPermissions = mapPermissions(permissions);

                if (
                  arePermissionsTheSame(dbPermissionsForDomain, formPermissions)
                ) {
                  if (team === Id.RootDomain) {
                    return createError({
                      message: formatText(MSG.samePermissionsApplied),
                      path: PERMISSIONS_FIELD_NAME,
                    });
                  }

                  // If the permissions happen to be the same but the form permissions are only
                  // partially made up of the inherited permissions, we can conclude that the current
                  // form permissions are made up of inherited permissions + user-selected permissions
                  if (
                    dbInheritedPermissions.length !== formPermissions.length
                  ) {
                    return createError({
                      message: formatText(MSG.samePermissionsApplied),
                      path: PERMISSIONS_FIELD_NAME,
                    });
                  }

                  if (
                    dbInheritedPermissions.length === formPermissions.length
                  ) {
                    return createError({
                      message: formatText(MSG.sameInheritedRoleApplied, {
                        role: 'these custom',
                      }),
                      path: PERMISSIONS_FIELD_NAME,
                    });
                  }
                }
              }

              return true;
            },
          }),
    }),
    decisionMethod: getEnumYupSchema(DecisionMethod).required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
    title: string().required(), // @TODO these two dont get inferred from the schema with concat
    description: string().optional(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export const MANAGE_PERMISSIONS_ACTION_FORM_ID =
  'manage-permissions-action-form-id';
