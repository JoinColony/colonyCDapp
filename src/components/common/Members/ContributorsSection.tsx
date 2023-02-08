import React, { useState, useCallback, ReactNode } from 'react';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';

import MembersList from '~shared/MembersList';
import LoadMoreButton from '~shared/LoadMoreButton';
import SortingRow, {
  Props as SortingProps,
} from '~shared/MembersList/SortingRow';
import { Contributor, MemberUser } from '~types';
import { useColonyMembersSorting } from '~hooks';

import styles from './MembersSection.css';

const displayName = 'common.Members.ContributorsSection';

const MSG = defineMessages({
  contributorsTitle: {
    id: `${displayName}.contributorsTitle`,
    defaultMessage: 'Contributors',
  },
  noMembersFound: {
    id: `${displayName}.noMembersFound`,
    defaultMessage: 'No members found',
  },
});

interface Props {
  members: Contributor[];
  canAdministerComments: boolean;
  extraItemContent?: (user: MemberUser) => ReactNode;
  itemsPerSection?: number;
}

const ContributorsSection = ({
  members,
  canAdministerComments,
  extraItemContent,
  itemsPerSection = 10,
}: Props & Partial<SortingProps>) => {
  const [dataPage, setDataPage] = useState<number>(1);

  const paginatedMembers = members.slice(0, itemsPerSection * dataPage);
  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  const { sortedMembers, sortingMethod, handleSortingMethodChange } =
    useColonyMembersSorting(paginatedMembers, true);

  return (
    <>
      <div className={styles.bar}>
        <div
          className={classnames(styles.title, {
            [styles.contributorsTitle]: true,
          })}
        >
          <FormattedMessage {...MSG.contributorsTitle} />
          {handleSortingMethodChange && sortingMethod && (
            <SortingRow
              handleSortingMethodChange={handleSortingMethodChange}
              sortingMethod={sortingMethod}
            />
          )}
        </div>
      </div>
      {paginatedMembers.length ? (
        <div className={styles.membersList}>
          <MembersList
            extraItemContent={extraItemContent}
            members={sortedMembers}
            canAdministerComments={canAdministerComments}
            showUserReputation
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

ContributorsSection.displayName = displayName;

export default ContributorsSection;
