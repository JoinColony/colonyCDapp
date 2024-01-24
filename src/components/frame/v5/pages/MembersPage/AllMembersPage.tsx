import React, { FC, useEffect } from 'react';

import { useColonyContext } from '~context/ColonyContext';
import { useFilterContext } from '~context/FilterContext';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext';
import { useSearchContext } from '~context/SearchContext';
import useCopyToClipboard from '~hooks/useCopyToClipboard';
import { formatText } from '~utils/intl';
import { FilterTypes } from '~v5/common/TableFiltering/types';

import { useMembersPage } from './hooks';
import MembersTabContent from './partials/MembersTabContent';

const AllMembersPage: FC = () => {
  const { membersList, loading, hasMoreMembers, loadMoreMembers } =
    useMembersPage();
  const { handleClipboardCopy } = useCopyToClipboard();
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const { setSearchValue } = useSearchContext();
  const { handleClearFilters } = useFilterContext();

  useSetPageHeadingTitle(formatText({ id: 'membersPage.title' }));

  const colonyURL = `${window.location.origin}/${colonyName}`;

  // clear filters and searches when unmounting
  useEffect(
    () => () => {
      setSearchValue('');
      handleClearFilters([
        FilterTypes.Contributor,
        FilterTypes.Status,
        FilterTypes.Reputation,
        FilterTypes.Permissions,
      ]);
    },
    [setSearchValue, handleClearFilters],
  );

  return (
    <MembersTabContent
      items={membersList}
      isLoading={loading}
      loadMoreButtonProps={
        hasMoreMembers
          ? {
              onClick: loadMoreMembers,
            }
          : undefined
      }
      withSimpleCards
      emptyContentProps={{
        buttonText: { id: 'members.subnav.invite' },
        onClick: () => handleClipboardCopy(colonyURL),
        title: formatText({ id: 'membersPage.followers.emptyTitle' }),
        description: formatText({
          id: 'membersPage.followers.emptyDescription',
        }),
        icon: 'smiley-meh',
      }}
    />
  );
};

export default AllMembersPage;
