import React, { type FC } from 'react';

import FiltersContextProvider from '~common/ColonyActionsTable/FiltersContext/FiltersContextProvider.tsx';
import ColonyActionsTable from '~common/ColonyActionsTable/index.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { formatText } from '~utils/intl.ts';
import WidgetBoxList from '~v5/common/WidgetBoxList/index.ts';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';

import { useActivityFeedWidgets } from './hooks.tsx';

const displayName = 'v5.pages.ActivityPage';

const ActivityPage: FC = () => {
  useSetPageHeadingTitle(formatText({ id: 'activityPage.title' }));

  const widgets = useActivityFeedWidgets();

  return (
    <ContentWithTeamFilter>
      <div className="flex w-full flex-col gap-4 sm:gap-6">
        <WidgetBoxList items={widgets} />
        <div>
          <FiltersContextProvider>
            <ColonyActionsTable
              className="pb-4 [&_tr.expanded-below:not(last-child)_td>*:not(.expandable)]:!pb-2 [&_tr.expanded-below_td]:border-none"
              showTotalPagesNumber={false}
              hasHorizontalPadding
            />
          </FiltersContextProvider>
        </div>
      </div>
    </ContentWithTeamFilter>
  );
};

ActivityPage.displayName = displayName;

export default ActivityPage;
