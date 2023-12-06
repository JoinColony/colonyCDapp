import React, { FC, useEffect } from 'react';

import { useSearchContext } from '~context/SearchContext';
import { useFilterContext } from '~context/FilterContext';
import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { formatText } from '~utils/intl';
import { useSetPageHeadingTitle } from '~context';
import { FilterTypes } from '~v5/common/TableFiltering/types';

import MembersTabContent from './partials/MembersTabContent';
import { useMembersPage } from './hooks';

const AllMembersPage: FC = () => {
  const { membersList, loading, hasMoreMembers, loadMoreMembers } =
    useMembersPage();
  const { handleClipboardCopy } = useCopyToClipboard();
  const { colony } = useColonyContext();
  const { setSearchValue } = useSearchContext();
  const { handleClearFilters } = useFilterContext();

  useSetPageHeadingTitle(formatText({ id: 'membersPage.title' }));

  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/${name}`;

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
