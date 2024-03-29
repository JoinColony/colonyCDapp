import { SmileyMeh } from '@phosphor-icons/react';
import React, { type FC, useEffect } from 'react';

import { APP_URL } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useFilterContext } from '~context/FilterContext/FilterContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useSearchContext } from '~context/SearchContext/SearchContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import { FilterTypes } from '~v5/common/TableFiltering/types.ts';

import { useMembersPage } from './hooks.ts';
import MembersTabContent from './partials/MembersTabContent/index.ts';

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

  const colonyURL = `${APP_URL.origin}/${colonyName}`;

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
        icon: SmileyMeh,
      }}
    />
  );
};

export default AllMembersPage;
