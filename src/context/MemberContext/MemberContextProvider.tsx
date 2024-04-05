import { Id } from '@colony/colony-js';
import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import { useMatch, useParams } from 'react-router-dom';

import {
  ALL_MEMBERS_LIST_LIMIT,
  ALL_MEMBERS_LOAD_MORE_LIST_LIMIT,
  CONTRIBUTORS_MEMBERS_LIST_LIMIT,
  HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT,
  VERIFIED_MEMBERS_LIST_LIMIT,
} from '~constants/index.ts';
import { useGetColonyContributorsQuery } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useAllMembers from '~hooks/members/useAllMembers.ts';
import useColonyContributors from '~hooks/members/useColonyContributors.ts';
import { COLONY_VERIFIED_ROUTE } from '~routes/index.ts';
import { type ColonyContributor } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';

import { useColonyContext } from '../ColonyContext/ColonyContext.ts';
import { useFilterContext } from '../FilterContext/FilterContext.ts';

import { MemberContext } from './MemberContext.ts';

const MemberContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { colonyName } = useParams();
  const {
    colony: { domains, colonyAddress },
  } = useColonyContext();
  const isMobile = useMobile();
  const isVerifiedPage = useMatch(`${colonyName}/${COLONY_VERIFIED_ROUTE}`);

  const contributorsPageSize = useMemo(() => {
    let itemsToShow = CONTRIBUTORS_MEMBERS_LIST_LIMIT;

    if (isVerifiedPage) {
      itemsToShow = VERIFIED_MEMBERS_LIST_LIMIT;
    } else if (isMobile) {
      itemsToShow = HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT;
    }

    return itemsToShow;
  }, [isMobile, isVerifiedPage]);

  const getAllMembersPageSize = useCallback(
    (desktopPageSize: number, mobilePageSize?: number) => {
      let itemsToShow = desktopPageSize;

      if (isVerifiedPage) {
        itemsToShow = VERIFIED_MEMBERS_LIST_LIMIT;
      } else if (isMobile && mobilePageSize) {
        itemsToShow = mobilePageSize;
      }

      return itemsToShow;
    },
    [isMobile, isVerifiedPage],
  );

  const {
    getSortingMethod,
    getFilterStatus,
    getFilterPermissions,
    getFilterContributorType,
  } = useFilterContext();

  const nativeDomainIds = useMemo(() => {
    return (
      domains?.items.filter(notNull).map(({ nativeId }) => nativeId) ?? [
        Id.RootDomain,
      ]
    );
  }, [domains]);

  const filterStatus = useMemo(() => getFilterStatus(), [getFilterStatus]);
  const sortingMethod = useMemo(() => getSortingMethod(), [getSortingMethod]);
  const permissions = useMemo(
    () => getFilterPermissions(),
    [getFilterPermissions],
  );
  const contributorTypes = useMemo(
    () => new Set(getFilterContributorType()),
    [getFilterContributorType],
  );

  // Make sure we fetch all members which is needed to select members
  const {
    data: memberData,
    loading,
    fetchMore,
  } = useGetColonyContributorsQuery({
    variables: {
      colonyAddress,
    },
    skip: !colonyAddress,
    onCompleted: (receivedData) => {
      if (receivedData?.getContributorsByColony?.nextToken) {
        // If there's more data to fetch, call fetchMore
        fetchMore({
          variables: {
            colonyAddress,
            nextToken: receivedData.getContributorsByColony.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            // Here, combine the previous items with the newly fetched items
            return {
              ...prev,
              getContributorsByColony: {
                ...prev.getContributorsByColony,
                items: [
                  ...(prev?.getContributorsByColony?.items || []),
                  ...(fetchMoreResult?.getContributorsByColony?.items || []),
                ],
                nextToken: fetchMoreResult?.getContributorsByColony?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const allMembers = useMemo(
    () => memberData?.getContributorsByColony?.items.filter(notNull) || [],
    [memberData],
  );

  const {
    contributors: filteredContributors,
    pagedContributors,
    canLoadMore: moreContributors,
    loadMore: loadMoreContributors,
    totalContributorCount,
    totalContributors,
  } = useColonyContributors({
    allMembers,
    contributorTypes,
    filterPermissions: permissions,
    filterStatus,
    nativeDomainIds,
    sortDirection: sortingMethod,
    pageSize: contributorsPageSize,
  });

  const {
    members: filteredMembers,
    pagedMembers,
    verifiedMembers,
    canLoadMore: moreMembers,
    loadMore: loadMoreMembers,
    totalMemberCount,
    totalMembers,
  } = useAllMembers({
    allMembers,
    contributorTypes,
    filterPermissions: permissions,
    filterStatus,
    nativeDomainIds,
    sortDirection: sortingMethod,
    pageSize: (pageNumber) => {
      const isFirstPage = pageNumber === 1;
      const desktopPageSize = isFirstPage
        ? ALL_MEMBERS_LIST_LIMIT
        : ALL_MEMBERS_LOAD_MORE_LIST_LIMIT;
      const mobilePageSize = isFirstPage
        ? HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT
        : undefined;
      return getAllMembersPageSize(desktopPageSize, mobilePageSize);
    },
  });

  const membersLimit = getAllMembersPageSize(ALL_MEMBERS_LIST_LIMIT);
  const membersByAddress = useMemo(
    () =>
      totalMembers.reduce<Record<string, ColonyContributor>>((map, member) => {
        return {
          ...map,
          [member.contributorAddress]: member,
        };
      }, {}),
    [totalMembers],
  );

  const value = useMemo(
    () => ({
      membersByAddress,
      filteredMembers,
      verifiedMembers,
      totalMemberCount,
      totalMembers,
      pagedMembers,
      moreMembers,
      loadMoreMembers,
      membersLimit,
      filteredContributors,
      totalContributorCount,
      totalContributors,
      pagedContributors,
      moreContributors,
      loadMoreContributors,
      loading,
    }),
    [
      membersByAddress,
      filteredMembers,
      verifiedMembers,
      totalMemberCount,
      totalMembers,
      pagedMembers,
      moreMembers,
      loadMoreMembers,
      membersLimit,
      filteredContributors,
      totalContributorCount,
      totalContributors,
      pagedContributors,
      moreContributors,
      loadMoreContributors,
      loading,
    ],
  );

  return (
    <MemberContext.Provider {...{ value }}>{children}</MemberContext.Provider>
  );
};

export default MemberContextProvider;
