import React, { FC } from 'react';

import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { formatText } from '~utils/intl';
import { useSetPageHeadingTitle } from '~context';

import MembersTabContent from './partials/MembersTabContent';
import { useMembersPage } from './hooks';

const AllMembersPage: FC = () => {
  const { membersList, loadingMembers, hasMoreMembers, loadMoreMembers } =
    useMembersPage();
  const { handleClipboardCopy } = useCopyToClipboard();
  const { colony } = useColonyContext();

  useSetPageHeadingTitle(formatText({ id: 'membersPage.title' }));

  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/${name}`;

  return (
    <MembersTabContent
      items={membersList}
      isLoading={loadingMembers}
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
