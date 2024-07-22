import { ColonyRole, Id } from '@colony/colony-js';
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
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import {
  AVAILABLE_ROLES,
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

  return AVAILABLE_ROLES.reduce(
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

  const userRolesForDomain = getUserRolesForDomain({
    colonyRoles,
    userAddress: member,
    domainId: team,
    intersectingRoles: true,
    isMultiSig: authority === Authority.ViaMultiSig,
  });

  const userInheritedRolesForDomain = getUserRolesForDomain({
    userAddress: member,
    domainId: team,
    inheritedRoles: true,
    colonyRoles,
  });

  const userRoleMeta = getRole(userRolesForDomain);

  const userRoleWrapperForDomain = userRoleMeta.permissions.length
    ? userRoleMeta.role
    : undefined;

  setValue('_dbuserRoleWrapperForDomain', userRoleWrapperForDomain);
  setValue('_dbUserRolesForDomain', userRolesForDomain);
  setValue('_dbUserInheritedRolesForDomain', userInheritedRolesForDomain);

  if (role !== UserRole.Custom && role !== UserRoleModifier.Remove) {
    setValue('role', userRoleWrapperForDomain, { shouldValidate: isSubmitted });
  }

  AVAILABLE_ROLES.forEach((colonyRole) => {
    setValue(
      `permissions.role_${colonyRole}`,
      userRoleMeta.permissions.includes(colonyRole),
    );
  });
};
