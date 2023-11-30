import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { Id } from '@colony/colony-js';
import { useGetColonyContributorsQuery } from '~gql';
import {
  useColonyContext,
  useMobile,
  useColonyContributors,
  useAllMembers,
} from '~hooks';
import { notNull } from '~utils/arrays';
import {
  ALL_MEMBERS_LIST_LIMIT,
  ALL_MEMBERS_LOAD_MORE_LIST_LIMIT,
  CONTRIBUTORS_MEMBERS_LIST_LIMIT,
  HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT,
  VERIFIED_MEMBERS_LIST_LIMIT,
} from '~constants';
import { ColonyContributor } from '~types';
import { COLONY_VERIFIED_ROUTE } from '~routes';

import { SearchContextProvider } from './SearchContext';
import { FilterContextProvider, useFilterContext } from './FilterContext';

const MemberContext = createContext<
  | {
      allMembers: ColonyContributor[];
      members: ColonyContributor[];
      verifiedMembers: ColonyContributor[];
      totalMemberCount: number;
      contributors: ColonyContributor[];
      totalContributorCount: number;
      memberCountLoading: boolean;
      loading: boolean;
      loadingMembers: boolean;
      loadMoreContributors: () => void;
      loadMoreMembers: () => void;
      moreContributors: boolean;
      moreMembers: boolean;
      membersLimit: number;
    }
  | undefined
>(undefined);

const MemberContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { domainId, colonyName } = useParams();
  const { colony } = useColonyContext();
  const { domains, colonyAddress } = colony ?? {};
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
    handleFilterSelect,
  } = useFilterContext();

  // Preselect domain if present in the url
  useEffect(() => {
    const totalDomains = domains?.items.length ?? 1;
    const preSelectedDomainId = Number(domainId);
    const isInvalidDomainId =
      !preSelectedDomainId ||
      Number.isNaN(preSelectedDomainId) ||
      preSelectedDomainId > totalDomains ||
      preSelectedDomainId < 1;

    if (isInvalidDomainId) {
      return;
    }

    const preSelectedDomain = domains?.items
      ?.filter(notNull)
      .find(({ nativeId }) => nativeId === Number(preSelectedDomainId));

    if (preSelectedDomainId) {
      handleFilterSelect({
        target: {
          id: `${preSelectedDomainId}_domain`,
          name: preSelectedDomain?.metadata?.name ?? preSelectedDomainId,
          checked: true,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [domainId, domains, handleFilterSelect]);

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

  // Make sure we fetch all members which is needed to select a member
  // to pay etc.
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
      if (receivedData?.getColonyContributors?.nextToken) {
        // If there's more data to fetch, call fetchMore
        fetchMore({
          variables: {
            nextToken: receivedData.getColonyContributors.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            // Here, combine the previous items with the newly fetched items
            return {
              ...prev,
              getColonyContributors: {
                ...prev.getColonyContributors,
                items: [
                  ...prev.getColonyContributors.items,
                  ...fetchMoreResult.getColonyContributors.items,
                ],
                nextToken: fetchMoreResult.getColonyContributors.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const allMembers =
    memberData?.getContributorsByColony?.items.filter(notNull) || [];

  const {
    contributors,
    canLoadMore: moreContributors,
    loadMore: loadMoreContributors,
    totalContributorCount,
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
    members,
    verifiedMembers,
    canLoadMore: moreMembers,
    loadMore: loadMoreMembers,
    totalMemberCount,
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

  const value = useMemo(
    () => ({
      allMembers,
      members,
      verifiedMembers,
      totalMemberCount,
      contributors,
      totalContributorCount,
      moreContributors,
      moreMembers,
      loadMoreContributors,
      loadMoreMembers,
      membersLimit: getAllMembersPageSize(ALL_MEMBERS_LIST_LIMIT),
    }),
    [
      allMembers,
      members,
      verifiedMembers,
      totalMemberCount,
      contributors,
      totalContributorCount,
      pageSize,
      moreContributors,
      moreMembers,
      loadMoreContributors,
      moreMembers,
      loadMoreMembers,
      getAllMembersPageSize,
      loading,
    ],
  );

  return (
    <MemberContext.Provider {...{ value }}>{children}</MemberContext.Provider>
  );
};

export const MemberContextProviderWithSearchAndFilter: FC<
  PropsWithChildren
> = ({ children }) => (
  <SearchContextProvider>
    <FilterContextProvider>
      <MemberContextProvider>{children}</MemberContextProvider>
    </FilterContextProvider>
  </SearchContextProvider>
);

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error(
      'useMemberContext must be used within the MemberContextProvider',
    );
  }
  return context;
};
