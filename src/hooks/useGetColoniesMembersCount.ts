import { useEffect } from 'react';

import {
  type SearchableColonyContributorFilterInput,
  useGetMembersCountQuery,
  useOnCreateColonyContributorSubscription,
} from '~gql';

/**
 * Wrapper for useGetMembersCountQuery to return the count as an array
 *
 * @param {string[]} colonyAddresses - An array of colony addresses to fetch member counts for
 * @param {SearchableColonyContributorFilterInput} filterOptions - The filter criteria for member attributes
 * @returns
 *   - `colonyMemberCounts` (number[]): The count of members for the specified colonies.
 *   - `isLoading` (boolean): Indicates whether the data is still being fetched.
 */
export const useGetColoniesMembersCount = (
  colonyAddresses: string[],
  filterOptions: SearchableColonyContributorFilterInput,
) => {
  const queryFilter = {
    or: colonyAddresses.map((colonyAddress) => ({
      and: [
        { colonyAddress: { eq: colonyAddress } },
        {
          ...filterOptions,
        },
      ],
    })),
  };

  const {
    data: contributorsCount,
    fetchMore,
    loading: contributorsCountLoading,
    refetch: refetchMembersCount,
  } = useGetMembersCountQuery({
    variables: {
      filter: { ...queryFilter },
    },
    onCompleted: (data) => {
      if (data.searchColonyContributors?.nextToken) {
        fetchMore({
          variables: {
            ...queryFilter,
            nextToken: data.searchColonyContributors.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
              ...prev,
              getActionsByColony: {
                ...prev.searchColonyContributors,
                items: [
                  ...(prev.searchColonyContributors?.aggregateItems[0]?.result
                    ?.__typename === 'SearchableAggregateBucketResult'
                    ? prev.searchColonyContributors?.aggregateItems[0]?.result
                        ?.buckets ?? []
                    : []),
                  ...(fetchMoreResult.searchColonyContributors
                    ?.aggregateItems[0]?.result?.__typename ===
                  'SearchableAggregateBucketResult'
                    ? fetchMoreResult.searchColonyContributors
                        ?.aggregateItems[0]?.result?.buckets ?? []
                    : []),
                ],
                nextToken: fetchMoreResult.searchColonyContributors?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const { data: newColonyContributorResult } =
    useOnCreateColonyContributorSubscription();

  const newColonyContributor =
    newColonyContributorResult?.onCreateColonyContributor?.contributorAddress;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (newColonyContributor) {
      // It looks hacky, but we need the timeout to ensure that opensearch has been updated before we refetch.
      timeout = setTimeout(refetchMembersCount, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [newColonyContributor, refetchMembersCount]);

  const membersCount =
    contributorsCount?.searchColonyContributors?.aggregateItems[0]?.result
      ?.__typename === 'SearchableAggregateBucketResult'
      ? contributorsCount.searchColonyContributors.aggregateItems[0]?.result
          ?.buckets
      : [];

  const colonyMemberCounts = colonyAddresses.map(
    (colonyAddress) =>
      membersCount?.filter((item) => item?.key === colonyAddress)[0]
        ?.doc_count || 0,
  );

  return {
    colonyMemberCounts,
    loading: contributorsCountLoading,
  };
};

const followerFilters = {
  or: [
    { hasPermissions: { eq: true } },
    { hasReputation: { eq: true } },
    { isWatching: { eq: true } },
    { isVerified: { eq: true } },
  ],
};

/**
 * Wrapper for useGetColoniesMembersCount to return the follower count as an array
 *
 * @param {string[]} colonyAddresses - An array of colony addresses to fetch follower counts for
 * @returns
 *   - `colonyMemberCounts` (number[]): The count of followers for the specified colonies.
 *   - `isLoading` (boolean): Indicates whether the data is still being fetched.
 */
export const useGetColoniesFollowersCount = (colonyAddresses: string[]) => {
  const { colonyMemberCounts, loading } = useGetColoniesMembersCount(
    colonyAddresses,
    followerFilters,
  );

  return { colonyMemberCounts, loading };
};

/**
 * Wrapper for useGetColoniesMembersCount to return the follower count for a single colony
 *
 * @param {string} colonyAddress - A colony address to fetch follower counts for
 * @returns
 *   - `colonyMemberCount` (number): The count of followers for the colony.
 *   - `isLoading` (boolean): Indicates whether the data is still being fetched.
 */
export const useGetColonyFollowersCount = (colonyAddress: string) => {
  const { colonyMemberCounts, loading } = useGetColoniesMembersCount(
    [colonyAddress],
    followerFilters,
  );

  return { colonyMemberCount: colonyMemberCounts[0], loading };
};

const contributorFilters = {
  or: [{ hasPermissions: { eq: true } }, { hasReputation: { eq: true } }],
};

/**
 * Wrapper for useGetColoniesMembersCount to return the contributor count as an array
 *
 * @param {string[]} colonyAddresses - An array of colony addresses to fetch contributor counts for
 * @returns
 *   - `colonyMemberCounts` (number[]): The count of contributors for the specified colonies.
 *   - `isLoading` (boolean): Indicates whether the data is still being fetched.
 */
export const useGetColoniesContributorsCount = (colonyAddresses: string[]) => {
  const { colonyMemberCounts, loading } = useGetColoniesMembersCount(
    colonyAddresses,
    contributorFilters,
  );

  return { colonyMemberCounts, loading };
};

/**
 * Wrapper for useGetColoniesMembersCount to return the contributor count for a single colony
 *
 * @param {string} colonyAddress - A colony address to fetch contributor counts for
 * @returns
 *   - `colonyMemberCount` (number): The count of contributors for the colony.
 *   - `isLoading` (boolean): Indicates whether the data is still being fetched.
 */
export const useGetColonyContributorsCount = (colonyAddress: string) => {
  const { colonyMemberCounts, loading } = useGetColoniesMembersCount(
    [colonyAddress],
    contributorFilters,
  );

  return { colonyMemberCount: colonyMemberCounts[0], loading };
};
