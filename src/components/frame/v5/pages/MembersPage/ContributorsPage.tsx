import React, { FC } from 'react';

import { formatText } from '~utils/intl';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { useColonyContext } from '~hooks';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';

import MembersTabContent from './partials/MembersTabContent';
import { useMembersPage } from './hooks';

const ContributorsPage: FC = () => {
  const {
    contributorsList,
    loadingContributors,
    hasMoreContributors,
    loadMoreContributors,
  } = useMembersPage();
  const { handleClipboardCopy } = useCopyToClipboard();
  const { colony } = useColonyContext();

  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/${name}`;

  return (
    <MembersTabContent
      items={contributorsList}
      isLoading={loadingContributors}
      loadMoreButtonProps={
        hasMoreContributors
          ? {
              onClick: loadMoreContributors,
            }
          : undefined
      }
      contentClassName="flex-col-reverse sm:flex-row"
      emptyContentProps={{
        buttonText: { id: 'members.subnav.invite' },
        onClick: () => handleClipboardCopy(colonyURL),
        title: formatText({ id: 'membersPage.contributors.emptyTitle' }),
        description: formatText({
          id: 'membersPage.contributors.emptyDescription',
        }),
        icon: 'smiley-meh',
      }}
    >
      <TeamReputationSummary className="sm:max-w-[14.375rem]" />
    </MembersTabContent>
  );
};

export default ContributorsPage;
