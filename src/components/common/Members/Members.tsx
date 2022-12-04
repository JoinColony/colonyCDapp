import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import { SpinnerLoader } from '~shared/Preloaders';
// import UserPermissions from '~dashboard/UserPermissions';
// import {
//   FormValues as FiltersFormValues,
//   MemberType,
// } from '~dashboard/ColonyMembers/MembersFilter';

// import { useTransformer } from '~utils/hooks';
import { Domain, useGetMembersForColonyQuery } from '~gql';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
  ROOT_DOMAIN_ID,
} from '~constants';
// import { getAllUserRoles } from '~modules/transformers';
// import { hasRoot, canAdminister } from '~modules/users/checks';
import { Colony, User } from '~types';

import MembersTitle from './MembersTitle';
import { filterMembers } from './filterMembers';
import MembersSection from './MembersSection';

import styles from './Members.css';

const displayName = 'common.Members';

const MSG = defineMessages({
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: "Loading Colony's users...",
  },
  failedToFetch: {
    id: `${displayName}.failedToFetch`,
    defaultMessage: "Could not fetch the colony's members",
  },
  noMemebersFound: {
    id: `${displayName}.noResultsFound`,
    defaultMessage: 'No members found',
  },
});

interface Props {
  colony: Colony;
  selectedDomain: number | undefined;
  handleDomainChange: React.Dispatch<React.SetStateAction<number>>;
  filters: any;
  // filters: FiltersFormValues;
}

export type Member = User & {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
  banned: boolean;
};

const Members = ({
  colony: { colonyAddress, colonyName, domains },
  colony,
  selectedDomain,
  handleDomainChange,
  filters,
}: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');
  // const {
  //   walletAddress: currentUserWalletAddress,
  //   username,
  //   ethereal,
  // } = useLoggedInUser();
  // const hasRegisteredProfile = !!username && !ethereal;
  // const [contributors, setContributors] = useState<[]>([]);
  // const [watchers, setWatchers] = useState<[]>([]);

  // temp
  // const loadingMembers = false;

  // const { data: members, loading: loadingMembers } =
  //   useContributorsAndWatchersQuery({
  //     variables: {
  //       colonyAddress,
  //       colonyName,
  //       domainId: selectedDomain,
  //     },
  //   });

  const { data, loading: loadingMembers } = useGetMembersForColonyQuery({
    skip: !colony?.colonyAddress,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const contributors = data?.getMembersForColony?.contributors ?? [];
  const watchers = data?.getMembersForColony?.watchers ?? [];

  // useEffect(() => {
  //   setContributors(contributors || []);
  //   setWatchers(watchers || []);
  // }, [members]);

  // const currentUserRoles = useTransformer(getAllUserRoles, [
  //   colony,
  //   currentUserWalletAddress,
  // ]);
  // const canAdministerComments =
  //   hasRegisteredProfile &&
  //   (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));

  const domainSelectOptions = sortBy(
    [...(domains?.items || []), ALLDOMAINS_DOMAIN_SELECTION].map(
      ({ nativeId, name }: Domain) => {
        return {
          value: nativeId?.toString(),
          label: name || '',
        };
      },
    ),
    ['value'],
  );

  const filterContributorsAndWatchers = useCallback(() => {
    const filteredContributors = filterMembers(
      contributors || [],
      searchValue,
      filters,
    );
    setContributors(filteredContributors);

    const filteredWatchers = filterMembers(
      watchers || [],
      searchValue,
      filters,
    );
    setWatchers(filteredWatchers);
  }, [filters, searchValue]);

  // handles search values & close button
  const handleSearch = useCallback(
    (event) => {
      const value = event.target?.value || '';
      setSearchValue(value);
      filterContributorsAndWatchers();
    },
    [filterContributorsAndWatchers, setSearchValue],
  );

  const isRootDomain = useMemo(
    () =>
      selectedDomain === ROOT_DOMAIN_ID ||
      selectedDomain === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    [selectedDomain],
  );

  const membersContent = useMemo(() => {
    const contributorsContent = (
      <MembersSection<ColonyContributor>
        isContributorsSection
        colony={colony}
        currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
        members={contributors as ColonyContributor[]}
        // canAdministerComments={canAdministerComments}
        // extraItemContent={({ roles, directRoles, banned }) => {
        //   return (
        //     <UserPermissions
        //       roles={roles}
        //       directRoles={directRoles}
        //       banned={banned}
        //       hideHeadRole
        //     />
        //   );
        // }}
      />
    );

    //   const contributorsContent = (!isRootDomain ||
    //     filters.memberType === MemberType.ALL ||
    //     filters.memberType === MemberType.CONTRIBUTORS) && (
    //     <MembersSection<ColonyContributor>
    //       isContributorsSection
    //       colony={colony}
    //       currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
    //       members={contributors as ColonyContributor[]}
    //       canAdministerComments={canAdministerComments}
    //       extraItemContent={({ roles, directRoles, banned }) => {
    //         return (
    //           <UserPermissions
    //             roles={roles}
    //             directRoles={directRoles}
    //             banned={banned}
    //             hideHeadRole
    //           />
    //         );
    //       }}
    //     />
    //   );

    //   const watchersContent =
    //     isRootDomain &&
    //     (filters.memberType === MemberType.ALL ||
    //       filters.memberType === MemberType.WATCHERS) ? (
    //       <MembersSection<ColonyWatcher>
    //         isContributorsSection={false}
    //         colony={colony}
    //         currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
    //         members={watchers as ColonyWatcher[]}
    //         canAdministerComments={canAdministerComments}
    //         extraItemContent={({ banned }) => (
    //           <UserPermissions roles={[]} directRoles={[]} banned={banned} />
    //         )}
    //       />
    //     ) : null;

    return (
      <>
        {contributorsContent}
        {/* {watchersContent} */}
      </>
    );
  }, [
    // canAdministerComments,
    colony,
    contributors,
    selectedDomain,
    watchers,
    filters,
    isRootDomain,
  ]);

  // useEffect(() => {
  //   filterContributorsAndWatchers();
  // }, [filterContributorsAndWatchers, filters, isRootDomain]);

  if (loadingMembers) {
    return (
      <div className={styles.main}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ size: 'massive', theme: 'primary' }}
        />
      </div>
    );
  }

  // const membersContent = <div>members content</div>;

  // const contributors = [];
  // const watchers = [];

  return (
    <div className={styles.main}>
      <MembersTitle
        currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
        handleDomainChange={handleDomainChange}
        domainSelectOptions={domainSelectOptions}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        colony={colony}
      />
      {!contributors?.length && !watchers?.length ? (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMemebersFound} />
        </div>
      ) : (
        membersContent
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
