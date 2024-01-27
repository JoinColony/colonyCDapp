import { ColonyRole } from '@colony/colony-js';

import {
  CUSTOM_USER_ROLE,
  USER_ROLE,
  USER_ROLES,
} from '~constants/permissions.ts';
import { Colony } from '~types/graphql.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';

import {
  AVAILABLE_ROLES,
  ManagePermissionsFormValues,
  REMOVE_ROLE_OPTION_VALUE,
} from './consts.tsx';

export const getRoleLabel = (role: string | undefined) => {
  return [
    ...USER_ROLES,
    CUSTOM_USER_ROLE,
    {
      role: REMOVE_ROLE_OPTION_VALUE,
      name: formatText({
        id: 'actionSidebar.managePermissions.roleSelect.remove.title',
      }),
    },
  ].find(({ role: userRole }) => userRole === role)?.name;
};

export const getPermissionsMap = (
  permissions: ManagePermissionsFormValues['permissions'],
  role: string,
) => {
  const permissionsList = (() => {
    switch (role) {
      case USER_ROLE.Custom: {
        return Object.entries(permissions).reduce<ColonyRole[]>(
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
      case REMOVE_ROLE_OPTION_VALUE: {
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
  annotationMessage: values.description,
  domainId: Number(values.team),
  userAddress: values.member,
  colonyName: colony.name,
  colonyAddress: colony.colonyAddress,
  motionDomainId: Number(values.createdIn),
  roles: getPermissionsMap(values.permissions, values.role),
});
