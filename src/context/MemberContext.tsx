import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useParams } from 'react-router-dom';
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
} from '~constants';
import { ColonyContributor } from '~types';

const MemberContext = createContext<
  | {
      members: ColonyContributor[];
      contributors: ColonyContributor[];
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
  const { domainId } = useParams();
  const { colony } = useColonyContext();
  const { domains } = colony ?? {};
  const isMobile = useMobile();

  const pageSize = isMobile
    ? HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT
    : HOMEPAGE_MEMBERS_LIST_LIMIT;

  const {
    getFilterDomainIds: getDomainIds,
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
    const ids = getDomainIds();
    if (ids.length) {
      return ids;
    }

    // if no ids selected, default to all available domains
    return (
      domains?.items.filter(notNull).map(({ nativeId }) => nativeId) ?? [
        Id.RootDomain,
      ]
    );
  }, [getDomainIds, domains]);

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

  const value = useMemo(
    () => ({
      members,
      contributors,
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
      contributors,
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
