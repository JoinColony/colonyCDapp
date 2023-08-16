import { useEffect, useState } from 'react';
import { ColonyRole, Id } from '@colony/colony-js';

import { ContextModule, getContext } from '~context';
import { getExtensionInstallations } from './utils';
import {
  GetPermissionedContributorsDocument,
  GetPermissionedContributorsQuery,
  GetPermissionedContributorsQueryVariables,
} from '~gql';
import { getDomainDatabaseId } from '~utils/domains';
import { notNull } from '~utils/arrays';
import { unionBy } from '~utils/lodash';
import { ContributorWithReputation } from '~types';

const hasSomeRole = (
  roles: Partial<
    Omit<
      Record<`role_${ColonyRole}`, boolean | null | undefined>,
      'role_4' | 'role_7'
    >
  >,
  permissionsFilter: ColonyRole[],
) => {
  if (!permissionsFilter.length) {
    // if no permissions filters are set, just check user has at least one permission
    return Object.keys(roles).some((role) => !!roles[role]);
  }

  return permissionsFilter.some((permission) => !!roles[`role_${permission}`]);
};

const getPermissionedContributors = async (
  colonyAddress: string,
  nativeDomainId: number,
  limit: number,
) => {
  const apollo = getContext(ContextModule.ApolloClient);

  const installedExtensionAddresses = await getExtensionInstallations(
    colonyAddress,
  );

  const { data } =
    (await apollo.query<
      GetPermissionedContributorsQuery,
      GetPermissionedContributorsQueryVariables
    >({
      query: GetPermissionedContributorsDocument,
      variables: {
        colonyAddress,
        domainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
        limit,
      },
    })) ?? {};

  return {
    permissionedContributors:
      data.getRoleByDomainAndColony?.items
        .filter(notNull)
        .filter(
          ({ targetAddress }) =>
            !installedExtensionAddresses.has(targetAddress),
        ) ?? [],
    nextToken: data.getRoleByDomainAndColony?.nextToken,
  };
};

const usePermissionedContributors = (
  colonyAddress: string,
  nativeDomainIds: number[],
  permissionsFilter: number[],
  limit: number,
) => {
  const [contributors, setContributors] = useState<ContributorWithReputation[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [canFetchMore, setCanFetchMore] = useState<boolean>(false);

  useEffect(() => {
    // Always include the root domain, since if the user has a permission in root, they have it in all domains
    const domainSet = new Set([Id.RootDomain, ...nativeDomainIds]);

    const fetchPermissionedContributors = async () => {
      setLoading(true);
      let canFetchMoreContributors = false;
      const filteredContributors = await Promise.all(
        [...domainSet].map(async (nativeDomainId) => {
          const { permissionedContributors, nextToken } =
            await getPermissionedContributors(
              colonyAddress,
              nativeDomainId,
              limit,
            );

          if (nextToken) {
            canFetchMoreContributors = true;
          }

          return (
            permissionedContributors
              .filter(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ({ targetAddress, __typename, targetUser, ...roles }) =>
                  hasSomeRole(roles, permissionsFilter),
              )
              .map(({ targetAddress, targetUser }) => ({
                address: targetAddress,
                user: targetUser,
                colonyReputationPercentage: '0',
                domainReputationPercentage: '0',
              })) ?? []
          );
        }),
      );

      setCanFetchMore(canFetchMoreContributors);

      setContributors(
        // @ts-ignore
        unionBy(...filteredContributors, 'address'),
      );
      setLoading(false);
    };

    fetchPermissionedContributors();
  }, [colonyAddress, nativeDomainIds, permissionsFilter, limit]);

  return { permissionedContributors: contributors, loading, canFetchMore };
};

export default usePermissionedContributors;
