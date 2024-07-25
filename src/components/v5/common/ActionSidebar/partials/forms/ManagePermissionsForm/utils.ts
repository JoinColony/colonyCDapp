import { ColonyRole, Id } from '@colony/colony-js';
import difference from 'lodash/difference';
import { type UseFormSetValue } from 'react-hook-form';

import {
  CUSTOM_USER_ROLE,
  UserRole,
  USER_ROLES,
  getRole,
} from '~constants/permissions.ts';
import { type ColonyFragment } from '~gql';
import { getUserRolesForDomain } from '~transformers';
import { DecisionMethod } from '~types/actions.ts';
import { Authority } from '~types/authority.ts';
import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { getObjectKeys } from '~utils/objects/index.ts';
import {
  capitalizeFirstLetter,
  getCommaSeparatedStringList,
  sanitizeHTML,
} from '~utils/strings.ts';

import {
  AVAILABLE_PERMISSIONS,
  UserRoleModifier,
  type ManagePermissionsFormValues,
} from './consts.ts';

export const getRoleLabel = (role: string | undefined) => {
  return [
    ...USER_ROLES,
    CUSTOM_USER_ROLE,
    {
      role: UserRoleModifier.Remove,
      name: formatText({
        id: 'actionSidebar.managePermissions.roleSelect.remove.title',
      }),
    },
  ].find(({ role: userRole }) => userRole === role)?.name;
};

export const getPermissionsMap = (
  permissions: ManagePermissionsFormValues['permissions'],
  role: ManagePermissionsFormValues['role'],
  team: ManagePermissionsFormValues['team'],
) => {
  const permissionsList = (() => {
    switch (role) {
      case UserRole.Custom: {
        return Object.entries(permissions ?? {}).reduce<ColonyRole[]>(
          (result, [key, value]) => {
            if (!value) {
              return result;
            }

            try {
              const [, permission] = key.split('_');

              return [
                ...result,
                getEnumValueFromKey(ColonyRole, Number(permission)),
              ];
            } catch {
              return result;
            }
          },
          [],
        );
      }
      case UserRoleModifier.Remove: {
        return [];
      }
      default: {
        return (
          USER_ROLES.find(({ role: userRole }) => userRole === role)
            ?.permissions || []
        );
      }
    }
  })();

  return AVAILABLE_PERMISSIONS.reduce(
    (result, permission) => ({
      ...result,
      [permission]:
        team !== Id.RootDomain &&
        [ColonyRole.Root, ColonyRole.Recovery].includes(permission)
          ? false
          : permissionsList.includes(permission),
    }),
    {},
  );
};

export const getManagePermissionsPayload = (
  colony: Colony,
  values: ManagePermissionsFormValues,
) => {
  const {
    description: annotationMessage,
    title,
    decisionMethod,
    team,
    member,
    createdIn,
    permissions,
    role,
    authority,
  } = values;

  const commonPayload = {
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    domainId: Number(team),
    userAddress: member,
    colonyName: colony.name,
    colonyAddress: colony.colonyAddress,
    roles: getPermissionsMap(permissions, role, team),
    authority,
    customActionTitle: title,
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
  };

  if (
    decisionMethod === DecisionMethod.Reputation ||
    decisionMethod === DecisionMethod.MultiSig
  ) {
    return {
      ...commonPayload,
      motionDomainId: Number(createdIn),
      isMultiSig: decisionMethod === DecisionMethod.MultiSig,
    };
  }

  return commonPayload;
};
export const extractColonyRoleFromPermissionKey = (permissionKey: string) => {
  const colonyRole = permissionKey.match(/role_(\d+)/)?.[1];

  if (colonyRole && colonyRole in ColonyRole) {
    return Number(colonyRole);
  }

  console.error('Manage Permissions Form: Invalid permission: ', permissionKey);

  return null;
};

export const configureFormRoles = ({
  colony,
  setValue,
  isSubmitted,
  member,
  role,
  team,
  authority,
}: {
  colony: ColonyFragment;
  setValue: UseFormSetValue<ManagePermissionsFormValues>;
  isSubmitted: boolean;
  member: ManagePermissionsFormValues['member'];
  team: ManagePermissionsFormValues['team'];
  role: ManagePermissionsFormValues['role'];
  shouldPersistRole?: boolean;
  setShouldPersistRole?: React.Dispatch<React.SetStateAction<boolean>>;
  authority: ManagePermissionsFormValues['authority'];
}) => {
  const colonyRoles = extractColonyRoles(colony.roles);

  const dbPermissionsForDomain = getUserRolesForDomain({
    colonyRoles,
    userAddress: member,
    domainId: team,
    intersectingRoles: true,
    isMultiSig: authority === Authority.ViaMultiSig,
  });

  const dbInheritedPermissions = getUserRolesForDomain({
    colonyRoles,
    userAddress: member,
    domainId: team,
    onlyInheritedRoles: true,
  });

  const dbRoleMetaForDomain = getRole(dbPermissionsForDomain);
  const dbRoleForDomain = dbRoleMetaForDomain.permissions.length
    ? dbRoleMetaForDomain.role
    : undefined;

  const dbInheritedRoleMeta = getRole(dbInheritedPermissions);
  const dbInheritedRole = dbInheritedRoleMeta.permissions.length
    ? dbInheritedRoleMeta.role
    : undefined;

  setValue('_dbRoleForDomain', dbRoleForDomain);
  setValue('_dbInheritedRole', dbInheritedRole);
  setValue('_dbPermissionsForDomain', dbPermissionsForDomain);
  setValue('_dbInheritedPermissions', dbInheritedPermissions);

  if (role !== UserRole.Custom && role !== UserRoleModifier.Remove) {
    setValue('role', dbRoleForDomain, { shouldValidate: isSubmitted });
  }

  AVAILABLE_PERMISSIONS.forEach((colonyRole) => {
    setValue(
      `permissions.role_${colonyRole}`,
      dbRoleMetaForDomain.permissions.includes(colonyRole),
    );
  });
};

export const mapPermissions = (
  permissions: ManagePermissionsFormValues['permissions'],
) =>
  permissions
    ? getObjectKeys(permissions)
        .filter((permissionKey) => permissions?.[permissionKey])
        .map(extractColonyRoleFromPermissionKey)
        .filter(notNull)
    : [];

export const getFormPermissions = ({
  formRole,
  formPermissions,
}: {
  formRole: ManagePermissionsFormValues['role'];
  formPermissions: ManagePermissionsFormValues['permissions'];
}) =>
  formRole !== UserRole.Custom
    ? USER_ROLES.find((userRole) => userRole.role === formRole)?.permissions ??
      []
    : mapPermissions(formPermissions);

export const getRemovedInheritedPermissions = ({
  dbInheritedPermissions = [],
  formPermissions = [],
}: {
  dbInheritedPermissions: ManagePermissionsFormValues['_dbInheritedPermissions'];
  formPermissions: ColonyRole[] | undefined;
}) => difference(dbInheritedPermissions, formPermissions);

export const arePermissionsTheSame = (
  permissionsA: ColonyRole[] | undefined,
  permissionsB: ColonyRole[] | undefined,
) =>
  JSON.stringify(permissionsA?.sort()) === JSON.stringify(permissionsB?.sort());

export const getPermissionName = (role: ColonyRole) =>
  formatText({ id: `role.${role}` });

/**
 *
 * @param role: payer
 * @param permissions: [2, 5, 6]
 * @returns "Payer"
 *
 * @param role: custom
 * @param permissions: [1, 2, 5]
 * @returns "Custom (Root, Arbitration and Funding)"
 */
export const getFormattedRole = ({
  role,
  permissions,
}: {
  role: UserRole;
  permissions: ColonyRole[];
}) => {
  if (role === UserRole.Custom) {
    const permissionNames = permissions.map(getPermissionName);

    const formattedPermissionNames =
      getCommaSeparatedStringList(permissionNames);

    return `Custom (${formattedPermissionNames})`;
  }

  return capitalizeFirstLetter(role);
};

export const getPermissionsForRole = (role: string) =>
  USER_ROLES.find((userRole) => userRole.role === role)?.permissions ?? [];
