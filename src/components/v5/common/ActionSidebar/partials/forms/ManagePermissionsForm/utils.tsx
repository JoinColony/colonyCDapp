import { ApolloClient } from '@apollo/client';
import { ColonyRole } from '@colony/colony-js';
import { first } from 'lodash';
import React from 'react';
import { DeepPartial } from 'utility-types';
import {
  CUSTOM_USER_ROLE,
  USER_ROLE,
  USER_ROLES,
} from '~constants/permissions';
import {
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
  GetUserByAddressDocument,
  ColonyFragment,
} from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { formatText } from '~utils/intl';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import {
  AVAILABLE_ROLES,
  ManagePermissionsFormValues,
  REMOVE_ROLE_OPTION_VALUE,
} from './consts';

const getMemberText = async (
  userAddress: string | undefined,
  client: ApolloClient<object>,
): Promise<string> => {
  try {
    if (!userAddress) {
      return 'user';
    }

    const { data } = await client.query<
      GetUserByAddressQuery,
      GetUserByAddressQueryVariables
    >({
      query: GetUserByAddressDocument,
      variables: { address: userAddress },
    });

    return first(data?.getUserByAddress?.items)?.profile?.displayName || 'user';
  } catch {
    return 'user';
  }
};

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

const getTeamName = (
  teamId: string | undefined,
  colony: ColonyFragment | undefined,
): string | undefined =>
  colony?.domains?.items.find((domain) => domain?.nativeId === Number(teamId))
    ?.metadata?.name;

export const managePermissionsDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<ManagePermissionsFormValues>
> = async ({ member, role, team }, { currentUser, client, colony }) => {
  const teamName = getTeamName(team, colony);
  const isRemoveRoleAction = role === REMOVE_ROLE_OPTION_VALUE;

  return (
    <>
      {isRemoveRoleAction ? 'Remove permissions for' : 'Assign'}{' '}
      {await getMemberText(member, client)}{' '}
      {!isRemoveRoleAction && <>{getRoleLabel(role)} permissions </>}
      {teamName && `in ${teamName} `}
      {currentUser?.profile?.displayName && (
        <>
          by{' '}
          <UserPopover
            userName={currentUser?.profile?.displayName}
            walletAddress={currentUser.walletAddress}
            aboutDescription={currentUser.profile?.bio || ''}
            user={currentUser}
          >
            <span>{currentUser.profile.displayName}</span>
          </UserPopover>
        </>
      )}
    </>
  );
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
