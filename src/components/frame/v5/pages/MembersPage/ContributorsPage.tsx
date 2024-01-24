import React, { FC } from 'react';

import { useColonyContext } from '~context/ColonyContext';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext';
import useCopyToClipboard from '~hooks/useCopyToClipboard';
import { formatText } from '~utils/intl';
import TeamReputationSummary from '~v5/common/TeamReputationSummary';

import { useMembersPage } from './hooks';
import MembersTabContent from './partials/MembersTabContent';

const ContributorsPage: FC = () => {
  const {
    contributorsList,
    loading,
    hasMoreContributors,
    loadMoreContributors,
  } = useMembersPage();
  const { handleClipboardCopy } = useCopyToClipboard();
  const {
    colony: { name: colonyName },
  } = useColonyContext();

  useSetPageHeadingTitle(formatText({ id: 'membersPage.title' }));
  const colonyURL = `${window.location.origin}/${colonyName}`;

  return (
    <MembersTabContent
      items={contributorsList}
      isLoading={loading}
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
