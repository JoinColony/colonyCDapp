import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { Id } from '@colony/colony-js';

import { FilterContextProvider, useFilterContext } from './FilterContext';

import {
  useColonyContext,
  useContributors,
  useAllMembers,
  useMobile,
} from '~hooks';
import { SearchContextProvider } from './SearchContext';
import { notNull } from '~utils/arrays';
import { ContributorWithReputation } from '~types';
import {
  HOMEPAGE_MEMBERS_LIST_LIMIT,
  HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT,
} from '~constants';

const MemberContext = createContext<
  | {
      followers: ContributorWithReputation[];
      contributors: ContributorWithReputation[];
      loadingContributors: boolean;
      loadingAllMembers: boolean;
      loadMoreContributors: () => void;
      loadMoreAll: () => void;
      moreContributors: boolean;
      moreAllMembers: boolean;
      membersLimit: number;
    }
  | undefined
>(undefined);

const MemberContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { domainId } = useParams();
  const { colony } = useColonyContext();
  const { domains } = colony ?? {};
  const isMobile = useMobile();

  const pageLimit = isMobile
    ? HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT
    : HOMEPAGE_MEMBERS_LIST_LIMIT;
  const [limitContributors, setLimitContributors] = useState<number>(pageLimit);
  const [limitAll, setLimitAll] = useState<number>(pageLimit);

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
    () => getFilterContributorType(),
    [getFilterContributorType],
  );

  const {
    contributors,
    loading: loadingContributors,
    canFetchMore,
  } = useContributors({
    nativeDomainIds,
    permissions,
    filterStatus,
    sortingMethod,
    contributorTypes,
    limit: limitContributors,
  });

  const {
    allMembers,
    loading: loadingAllMembers,
    canFetchMore: canFetchMoreAll,
  } = useAllMembers({
    nativeDomainIds,
    permissions,
    filterStatus,
    sortingMethod,
    contributorTypes,
    limit: limitAll,
  });

  const value = useMemo(
    () => ({
      followers: allMembers,
      contributors,
      moreContributors: canFetchMore,
      moreAllMembers: canFetchMoreAll,
      loadMoreContributors: () =>
        setLimitContributors((oldLimit) => oldLimit + pageLimit),
      loadMoreAll: () => setLimitAll((oldLimit) => oldLimit + pageLimit),
      loadingContributors,
      loadingAllMembers,
      membersLimit: pageLimit,
    }),
    [
      contributors,
      loadingContributors,
      loadingAllMembers,
      allMembers,
      pageLimit,
      canFetchMore,
      canFetchMoreAll,
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
