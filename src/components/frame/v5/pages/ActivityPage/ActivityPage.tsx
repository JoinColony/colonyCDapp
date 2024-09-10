import React, { type FC } from 'react';

import FiltersContextProvider from '~common/ColonyActionsTable/FiltersContext/FiltersContextProvider.tsx';
import ColonyActionsTable from '~common/ColonyActionsTable/index.ts';
import {
  useSetPageBreadcrumbs,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs.ts';
import { formatText } from '~utils/intl.ts';
import WidgetBoxList from '~v5/common/WidgetBoxList/index.ts';

import { useActivityFeedWidgets } from './hooks.tsx';

const displayName = 'v5.pages.ActivityPage';

const ActivityPage: FC = () => {
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();

  useSetPageHeadingTitle(formatText({ id: 'activityPage.title' }));
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  const widgets = useActivityFeedWidgets();

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-6">
      <WidgetBoxList items={widgets} />
      <div>
        <FiltersContextProvider>
          <ColonyActionsTable
            className="[&_tr.expanded-below:not(last-child)_td>*:not(.expandable)]:!pb-2 [&_tr.expanded-below_td]:border-none"
            showTotalPagesNumber={false}
            hasHorizontalPadding
          />
        </FiltersContextProvider>
      </div>
    </div>
  );
};

ActivityPage.displayName = displayName;

export default ActivityPage;
