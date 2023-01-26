import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { sortBy } from '~utils/lodash';

import { SpinnerLoader } from '~shared/Preloaders';

import { useColonyContext } from '~hooks';
import { Domain, useGetMembersForColonyQuery, SortingMethod } from '~gql';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
} from '~constants';
import { User } from '~types';
import { notNull } from '~utils/arrays';

import MembersTitle from './MembersTitle';
import MembersContent from './MembersContent';
// import { filterMembers } from './filterMembers';

import styles from './Members.css';

const displayName = 'common.Members';

const MSG = defineMessages({
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: 'Loading colony members',
  },
  failedToFetch: {
    id: `${displayName}.failedToFetch`,
    defaultMessage: 'Could not fetch colony members',
  },
  noMembersFound: {
    id: `${displayName}.noMembersFound`,
    defaultMessage: 'No members found',
  },
});

interface Props {
  selectedDomain?: number;
  handleDomainChange: React.Dispatch<React.SetStateAction<number>>;
  filters: any;
  // filters: FiltersFormValues;
}

export type Member = User & {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
  banned: boolean;
};

const Members = ({ selectedDomain, handleDomainChange, filters }: Props) => {
  const { colony } = useColonyContext();
  const [searchValue, setSearchValue] = useState<string>('');
  const sortingMethod = SortingMethod.ByHighestRep;

  const { data, loading: loadingMembers } = useGetMembersForColonyQuery({
    skip: !colony?.colonyAddress,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
        domainId: selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID,
        sortingMethod,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const contributors = useMemo(
    () => data?.getMembersForColony?.contributors?.filter(notNull) ?? [],
    [data],
  );
  const watchers = useMemo(
    () => data?.getMembersForColony?.watchers?.filter(notNull) ?? [],
    [data],
  );

  const domainSelectOptions = sortBy(
    [...(colony?.domains?.items || []), ALLDOMAINS_DOMAIN_SELECTION].map(
      ({ nativeId, name }: Domain) => {
        return {
          value: nativeId?.toString(),
          label: name || '',
        };
      },
    ),
    ['value'],
  );

  // handles search values & close button
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target?.value || '';
      setSearchValue(value);
    },
    [setSearchValue],
  );

  if (loadingMembers && !data) {
    return (
      <div className={styles.main}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ size: 'massive', theme: 'primary' }}
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <MembersTitle
        currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
        handleDomainChange={handleDomainChange}
        domainSelectOptions={domainSelectOptions}
        searchValue={searchValue}
        handleSearch={handleSearch}
      />
      {!contributors?.length && !watchers?.length ? (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMembersFound} />
        </div>
      ) : (
        <MembersContent
          selectedDomain={selectedDomain}
          filters={filters}
          contributors={contributors}
          watchers={watchers}
        />
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members;
