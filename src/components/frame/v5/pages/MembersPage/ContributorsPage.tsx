import { SmileyMeh } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import TeamReputationSummary from '~v5/common/TeamReputationSummary/index.ts';

import { useMembersPage } from './hooks.ts';
import MembersTabContent from './partials/MembersTabContent/index.ts';

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
  const colonyURL = `${window.location.protocol}//${process.env.HOST}/${colonyName}`;

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
        icon: SmileyMeh,
      }}
    >
      <TeamReputationSummary className="sm:max-w-[14.375rem]" />
    </MembersTabContent>
  );
};

export default ContributorsPage;
