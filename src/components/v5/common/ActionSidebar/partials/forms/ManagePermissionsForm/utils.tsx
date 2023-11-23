import { ColonyRole } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import {
  CUSTOM_USER_ROLE,
  USER_ROLE,
  USER_ROLES,
} from '~constants/permissions';
import { ColonyActionType, ColonyActionRoles } from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { formatText } from '~utils/intl';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { getTeam, tryGetUser } from '../utils';
import {
  AVAILABLE_ROLES,
  ManagePermissionsFormValues,
  REMOVE_ROLE_OPTION_VALUE,
} from './consts';

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

export const managePermissionsDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<ManagePermissionsFormValues>
> = async (
  { member, role, team: teamId, decisionMethod, permissions },
  { getActionTitleValues, colony, client },
) => {
  const team = getTeam(teamId, colony);
  const recipientUser = member ? await tryGetUser(member, client) : undefined;

  return getActionTitleValues(
    {
      type:
        decisionMethod === DECISION_METHOD.Permissions
          ? ColonyActionType.SetUserRoles
          : ColonyActionType.SetUserRolesMotion,
      fromDomain: team,
      recipientUser,
      recipientAddress: member,
      roles: role
        ? Object.entries(
            getPermissionsMap(permissions || {}, role),
          ).reduce<ColonyActionRoles>(
            (result, [key, value]) => ({
              ...result,
              [`role_${key}`]: value,
            }),
            {},
          )
        : {},
    },
    {
      [ActionTitleMessageKeys.FromDomain]: formatText({
        id: 'actionSidebar.metadataDescription.team',
      }),
      [ActionTitleMessageKeys.Recipient]: formatText({
        id: 'actionSidebar.metadataDescription.user',
      }),
    },
  );
};
