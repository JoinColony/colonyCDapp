import React, { useState, useCallback, ReactNode } from 'react';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';

import MembersList from '~shared/MembersList';
import LoadMoreButton from '~shared/LoadMoreButton';
import SortingRow, {
  Props as SortingProps,
} from '~shared/MembersList/SortingRow';
import { Watcher, Contributor, Member } from '~types';
import { useColonyMembersSorting } from '~hooks';

import styles from './MembersSection.css';

const displayName = 'common.Members.MembersSection';

const MSG = defineMessages({
  contributorsTitle: {
    id: `${displayName}.contributorsTitle`,
    defaultMessage: 'Contributors',
  },
  watchersTitle: {
    id: `${displayName}.watchersTitle`,
    defaultMessage: 'Watchers',
  },
  watchersDescription: {
    id: `${displayName}.watchersDescription`,
    defaultMessage: "Members who don't currently have any reputation",
  },
  noMembersFound: {
    id: `${displayName}.noMembersFound`,
    defaultMessage: 'No members found',
  },
});

interface Props {
  isContributorsSection: boolean;
  members: Watcher[] | Contributor[];
  canAdministerComments: boolean;
  extraItemContent?: (user: Member['user']) => ReactNode;
  itemsPerSection?: number;
}

const MembersSection = ({
  members,
  canAdministerComments,
  extraItemContent,
  isContributorsSection,
  itemsPerSection = 10,
}: Props & Partial<SortingProps>) => {
  const [dataPage, setDataPage] = useState<number>(1);

  const paginatedMembers = members.slice(0, itemsPerSection * dataPage);
  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  const { sortedMembers, sortingMethod, handleSortingMethodChange } =
    useColonyMembersSorting(paginatedMembers, isContributorsSection);

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
            extraItemContent={extraItemContent}
            members={sortedMembers}
            canAdministerComments={canAdministerComments}
            showUserReputation={isContributorsSection}
          />
        </div>
      ) : (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMembersFound} />
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
