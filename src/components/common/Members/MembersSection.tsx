import React, { useState, useCallback, ReactNode } from 'react';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';

import MembersList from '~shared/MembersList';
import LoadMoreButton from '~shared/LoadMoreButton';
import SortingRow, {
  Props as SortingProps,
} from '~shared/MembersList/SortingRow';
import { Colony, Watcher, Contributor } from '~types';
// import useColonyMembersSorting from '~modules/dashboard/hooks/useColonyMembersSorting';

import styles from './MembersSection.css';

const displayName = 'dashboard.MembersSection';

const MSG = defineMessages({
  contributorsTitle: {
    id: 'dashboard.Members.MembersSection.contributorsTitle',
    defaultMessage: 'Contributors',
  },
  watchersTitle: {
    id: 'dashboard.Members.MembersSection.watchersTitle',
    defaultMessage: 'Watchers',
  },
  watchersDescription: {
    id: 'dashboard.Members.MembersSection.watchersDescription',
    defaultMessage: "Members who don't currently have any reputation",
  },
  noMemebersFound: {
    id: 'dashboard.Members.MembersSection.noResultsFound',
    defaultMessage: 'No members found',
  },
});

interface Props {
  isContributorsSection: boolean;
  colony: Colony;
  members: Watcher[] | Contributor[];
  canAdministerComments: boolean;
  extraItemContent?: (user: (Watcher | Contributor)['user']) => ReactNode;
  itemsPerSection?: number;
}

const MembersSection = ({
  colony,
  members,
  canAdministerComments,
  extraItemContent,
  isContributorsSection,
  itemsPerSection = 10,
  handleSortingMethodChange,
  sortingMethod,
}: Props & Partial<SortingProps>) => {
  const [dataPage, setDataPage] = useState<number>(1);

  const paginatedMembers = members.slice(0, itemsPerSection * dataPage);
  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  return (
    <>
      <div className={styles.bar}>
        <div
          className={classnames(styles.title, {
            [styles.contributorsTitle]: isContributorsSection,
          })}
        >
          <FormattedMessage
            {...(isContributorsSection
              ? MSG.contributorsTitle
              : MSG.watchersTitle)}
          />
          {isContributorsSection &&
            handleSortingMethodChange &&
            sortingMethod && (
              <SortingRow
                handleSortingMethodChange={handleSortingMethodChange}
                sortingMethod={sortingMethod}
              />
            )}
        </div>
        {!isContributorsSection && (
          <div className={styles.description}>
            <FormattedMessage {...MSG.watchersDescription} />
          </div>
        )}
      </div>
      {paginatedMembers.length ? (
        <div className={styles.membersList}>
          <MembersList
            colony={colony}
            extraItemContent={extraItemContent}
            users={paginatedMembers}
            canAdministerComments={canAdministerComments}
            showUserReputation={isContributorsSection}
          />
        </div>
      ) : (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMemebersFound} />
        </div>
      )}
      {itemsPerSection * dataPage < members.length && (
        <LoadMoreButton onClick={handleDataPagination} isLoadingData={false} />
      )}
    </>
  );
};

MembersSection.displayName = displayName;

export default MembersSection;
