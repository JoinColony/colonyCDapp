import { ColonyRole } from '@colony/colony-js';
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormValues } from '~common/ColonyMembers/MembersFilter';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Domain } from '~gql';
import { useColonyContext } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { User, Colony, DomainColor } from '~types';
import { sortBy } from '~utils/lodash';

import { filterMembers } from './filterMembers';
import MembersContent from './MembersContent';
import MembersTitle from './MembersTitle';

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
  filters: FormValues;
  isRootOrAllDomains: boolean;
}

export type Member = User & {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
  banned: boolean;
};

const getDomainSelectOptions = (colony?: Colony) => {
  return sortBy(
    [
      ...(colony?.domains?.items || []),
      {
        id: '',
        isRoot: true,
        nativeId: 0,
        metadata: {
          name: 'All Teams',
          description: '',
          color: DomainColor.Yellow,
        },
      },
    ].map(({ nativeId, metadata }: Domain) => {
      return {
        value: nativeId?.toString(),
        label: metadata?.name || '',
      };
    }),
    ['value'],
  );
};

const Members = ({
  selectedDomain,
  handleDomainChange,
  filters,
  isRootOrAllDomains,
}: Props) => {
  const { colony } = useColonyContext();
  const [searchValue, setSearchValue] = useState<string>('');

  const data = {};
  const loadingMembers = false;

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target?.value || '';
      setSearchValue(value);
    },
    [setSearchValue],
  );

  const filteredContributors = filterMembers(
    [],
    colony?.metadata?.whitelistedAddresses ?? [],
    searchValue,
    filters,
  );

  const filteredWatchers = filterMembers(
    [],
    colony?.metadata?.whitelistedAddresses ?? [],
    searchValue,
    filters,
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

  const hasMembers = filteredContributors?.length || filteredWatchers?.length;

  return (
    <div className={styles.main}>
      <MembersTitle
        currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
        handleDomainChange={handleDomainChange}
        domainSelectOptions={getDomainSelectOptions(colony)}
        searchValue={searchValue}
        handleSearch={handleSearch}
      />
      {hasMembers ? (
        <MembersContent
          filters={filters}
          contributors={filteredContributors}
          watchers={filteredWatchers}
          isRootOrAllDomains={isRootOrAllDomains}
        />
      ) : (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMembersFound} />
        </div>
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members;
