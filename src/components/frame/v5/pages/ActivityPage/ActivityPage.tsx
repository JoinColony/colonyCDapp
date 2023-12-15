import React, { FC } from 'react';

import { useSetPageBreadcrumbs, useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';
import WidgetBoxList from '~v5/common/WidgetBoxList';
import ColonyActionsTable from '~common/ColonyActionsTable';

import { useActivityFeedWidgets } from './hooks';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs';

const displayName = 'v5.pages.ActivityPage';

const ActivityPage: FC = () => {
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();

  useSetPageHeadingTitle(formatText({ id: 'activityPage.title' }));
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  const widgets = useActivityFeedWidgets();

  return (
    <div className="flex flex-col gap-4 sm:gap-[1.125rem] w-full">
      <WidgetBoxList items={widgets} />
      <div className="w-full">
        <ColonyActionsTable />
      </div>
    </div>
  );
};

ActivityPage.displayName = displayName;

export default ActivityPage;
