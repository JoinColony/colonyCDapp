import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { Id } from '@colony/colony-js';

import { FilterContextProvider, useFilterContext } from './FilterContext';

import {
  useColonyContext,
  useMobile,
  useColonyContributors,
  useAllMembers,
} from '~hooks';
import { SearchContextProvider } from './SearchContext';
import { notNull } from '~utils/arrays';
import {
  HOMEPAGE_MEMBERS_LIST_LIMIT,
  HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT,
  VERIFIED_MEMBERS_LIST_LIMIT,
} from '~constants';
import { ColonyContributor } from '~types';
import { useGetContributorCountQuery } from '~gql';
import { COLONY_VERIFIED_ROUTE } from '~routes';

const MemberContext = createContext<
  | {
      members: ColonyContributor[];
      verifiedMembers: ColonyContributor[];
      totalMemberCount: number;
      contributors: ColonyContributor[];
      totalContributorCount: number;
      memberCountLoading: boolean;
      loadingContributors: boolean;
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
  const { domains, colonyAddress = '' } = colony ?? {};
  const isMobile = useMobile();
  const isVerifiedPage = useMatch(`${colonyName}/${COLONY_VERIFIED_ROUTE}`);

  const pageSize = useMemo(() => {
    let itemsToShow = HOMEPAGE_MEMBERS_LIST_LIMIT;

    if (isVerifiedPage) {
      itemsToShow = VERIFIED_MEMBERS_LIST_LIMIT;
    } else if (isMobile) {
      itemsToShow = HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT;
    }

    return itemsToShow;
  }, [isMobile, isVerifiedPage]);

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

  const {
    contributors,
    canLoadMore: moreContributors,
    loadMore: loadMoreContributors,
    loading: loadingContributors,
  } = useColonyContributors({
    contributorTypes,
    filterPermissions: permissions,
    filterStatus,
    nativeDomainIds,
    sortDirection: sortingMethod,
    pageSize,
  });

  const {
    members,
    verifiedMembers,
    canLoadMore: moreMembers,
    loadMore: loadMoreMembers,
    loading: loadingMembers,
  } = useAllMembers({
    contributorTypes,
    filterPermissions: permissions,
    filterStatus,
    nativeDomainIds,
    sortDirection: sortingMethod,
    pageSize,
  });

  const { data: { getTotalMemberCount } = {}, loading: memberCountLoading } =
    useGetContributorCountQuery({
      variables: { input: { colonyAddress } },
      skip: !colonyAddress,
    });

  const {
    contributorCount: totalContributorCount = 0,
    memberCount: totalMemberCount = 0,
  } = getTotalMemberCount ?? {};

  const value = useMemo(
    () => ({
      members,
      verifiedMembers,
      totalMemberCount,
      contributors,
      totalContributorCount,
      memberCountLoading,
      moreContributors,
      moreMembers,
      loadMoreContributors,
      loadMoreMembers,
      loadingContributors,
      loadingMembers,
      membersLimit: pageSize,
    }),
    [
      members,
      verifiedMembers,
      totalMemberCount,
      contributors,
      totalContributorCount,
      memberCountLoading,
      pageSize,
      moreContributors,
      loadingContributors,
      loadMoreContributors,
      moreMembers,
      loadingMembers,
      loadMoreMembers,
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
