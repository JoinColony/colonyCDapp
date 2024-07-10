import { ColonyRole } from '@colony/colony-js';

import {
  CUSTOM_USER_ROLE,
  UserRole,
  USER_ROLES,
} from '~constants/permissions.ts';
import { type Colony } from '~types/graphql.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import {
  AVAILABLE_ROLES,
  RemoveRoleOptionValue,
  type ManagePermissionsFormValues,
} from './consts.ts';

export const getRoleLabel = (role: string | undefined) => {
  return [
    ...USER_ROLES,
    CUSTOM_USER_ROLE,
    {
      role: RemoveRoleOptionValue.remove,
      name: formatText({
        id: 'actionSidebar.managePermissions.roleSelect.remove.title',
      }),
    },
  ].find(({ role: userRole }) => userRole === role)?.name;
};

export const getPermissionsMap = (
  permissions: ManagePermissionsFormValues['permissions'],
  role: ManagePermissionsFormValues['role'],
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
      case RemoveRoleOptionValue.remove: {
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

  return AVAILABLE_ROLES.reduce(
    (result, permission) => ({
      ...result,
      [permission]: permissionsList.includes(permission),
    }),
    {},
  );
};

export const getManagePermissionsPayload = (
  colony: Colony,
  values: ManagePermissionsFormValues,
) => ({
  annotationMessage: values.description
    ? sanitizeHTML(values.description)
    : undefined,
  domainId: Number(values.team),
  userAddress: values.member,
  colonyName: colony.name,
  colonyAddress: colony.colonyAddress,
  motionDomainId: Number(values.createdIn),
  roles: getPermissionsMap(values.permissions, values.role),
});

export const extractColonyRoleFromPermissionKey = (permissionKey: string) => {
  const colonyRole = permissionKey.match(/role_(\d+)/)?.[1];

  if (colonyRole && colonyRole in ColonyRole) {
    return Number(colonyRole);
  }

  console.error('Manage Permissions Form: Invalid permission: ', permissionKey);

  return null;
};
