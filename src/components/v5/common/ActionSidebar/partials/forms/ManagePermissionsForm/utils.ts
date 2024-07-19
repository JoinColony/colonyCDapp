import { ColonyRole } from '@colony/colony-js';

import {
  CUSTOM_USER_ROLE,
  UserRole,
  USER_ROLES,
} from '~constants/permissions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
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
  role: string,
) => {
  const permissionsList = (() => {
    switch (role) {
      case UserRole.Custom: {
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
    roles: getPermissionsMap(permissions, role),
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
