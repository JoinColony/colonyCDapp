import { ColonyRole } from '@colony/colony-js';
import { useEffect, useMemo, useState } from 'react';

import {
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
  SortingMethod,
  useGetColonyWatcherQuery,
} from '~gql';
import { notNull } from '~utils/arrays';
import {
  ContributorTypeFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';
import useColonyContext from '../useColonyContext';
import { ContextModule, getContext } from '~context';
import usePermissionedContributors from './usePermissionedContributors';
import useContributorsWithReputation from './useContributorsWithReputation';
import useFilterContributors from './useFilterContributors';
import { ContributorWithReputation } from '~types';

const useWhitelistedContributors = (
  limit: number,
  whitelistedAddresses?: string[] | null,
) => {
  const [whitelistedContributors, setWhitelistedUsers] = useState<
    ContributorWithReputation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const apollo = getContext(ContextModule.ApolloClient);

    const fetchWhitelistedUsers = async (addresses: string[]) => {
      setLoading(true);
      const whitelisted = await Promise.all(
        addresses.slice(0, limit).map(async (address) => {
          const { data } = await apollo.query<
            GetUserByAddressQuery,
            GetUserByAddressQueryVariables
          >({ query: GetUserByAddressDocument, variables: { address } });

          const user = data.getUserByAddress?.items.filter(notNull).pop();

          return {
            address,
            user,
            colonyReputationPercentage: '0',
            domainReputationPercentage: '0',
            type: null,
          };
        }),
      );

      setWhitelistedUsers(whitelisted);
      setLoading(false);
    };

    if (whitelistedAddresses?.length) {
      fetchWhitelistedUsers(whitelistedAddresses);
    }
  }, [whitelistedAddresses, limit]);

  return {
    whitelistedContributors,
    loading,
    canFetchMore: limit < (whitelistedAddresses?.length ?? 0),
  };
};

const useAllMembers = ({
  nativeDomainIds,
  permissions,
  contributorTypes,
  filterStatus,
  sortingMethod,
  limit,
}: {
  nativeDomainIds: number[];
  permissions: ColonyRole[];
  contributorTypes: ContributorTypeFilter[];
  filterStatus?: StatusType;
  sortingMethod?: SortingMethod;
  limit: number;
}) => {
  const { colony } = useColonyContext();
  const { colonyAddress = '', metadata } = colony ?? {};

  const { data, loading: loadingJoined } =
    useGetColonyWatcherQuery({ variables: { id: colonyAddress, limit } }) ?? {};

  const joinedContributors: ContributorWithReputation[] = useMemo(
    () =>
      data?.getColony?.watchers?.items
        .filter(notNull)
        .map(({ userID, user: watcherUser }) => ({
          address: userID,
          user: watcherUser,
          colonyReputationPercentage: '0',
          domainReputationPercentage: '0',
          type: null,
        })) ?? [],
    [data],
  );

  const moreJoinedContributors = !!data?.getColony?.watchers?.nextToken;

  const {
    whitelistedContributors,
    loading: loadingWhitelisted,
    canFetchMore: moreWhitelistedContributors,
  } = useWhitelistedContributors(limit, metadata?.whitelistedAddresses);

  const {
    contributorsWithReputation,
    loading: loadingReputed,
    canFetchMore: moreContributorsWithRep,
  } = useContributorsWithReputation(
    colonyAddress,
    nativeDomainIds,
    contributorTypes,
    limit,
  );

  const {
    permissionedContributors,
    loading: loadingPermissioned,
    canFetchMore: morePermissionedContributors,
  } = usePermissionedContributors(
    colonyAddress,
    nativeDomainIds,
    permissions,
    limit,
  );

  const contributors = useMemo(
    () => ({
      contributorsWithReputation,
      permissionedContributors,
      whitelistedContributors,
      joinedContributors,
    }),
    [
      contributorsWithReputation,
      permissionedContributors,
      whitelistedContributors,
      joinedContributors,
    ],
  );

  const { filteredContributors, canFetchMore: moreFilteredContributors } =
    useFilterContributors({
      filterStatus,
      sortingMethod,
      contributorTypes,
      permissions,
      nativeDomainIds,
      contributors,
      limit,
    });

  return {
    allMembers: filteredContributors,
    canFetchMore:
      moreContributorsWithRep ||
      morePermissionedContributors ||
      moreWhitelistedContributors ||
      moreJoinedContributors ||
      moreFilteredContributors,
    loading:
      loadingWhitelisted ||
      loadingReputed ||
      loadingPermissioned ||
      loadingJoined,
  };
};

export default useAllMembers;
