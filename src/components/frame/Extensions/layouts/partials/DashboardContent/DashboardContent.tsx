import React, { type FC } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import {
  dashboardMainMenu,
  dashboardMenu,
} from '~frame/Extensions/layouts/consts.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import NavigationSidebarLinksList from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLinksList/index.ts';

const DashboardContent: FC = () => {
  const { totalContributorCount, totalMemberCount, loading } =
    useMemberContext();

  return (
    <div className="w-full pt-2 md:pt-4">
      <div className="mb-4 flex w-full items-center gap-4 px-2 text-sm text-gray-900 md:mb-7 md:px-0">
        {loading ? (
          <SpinnerLoader />
        ) : (
          <>
            <p className="flex-1">
              {formatText(
                { id: 'navigation.dashboard.contributors' },
                {
                  count: (
                    <strong className="font-semibold">
                      {Intl.NumberFormat().format(totalContributorCount)}
                    </strong>
                  ),
                },
              )}
            </p>
            <p className="flex-1">
              {formatText(
                { id: 'navigation.dashboard.members' },
                {
                  count: (
                    <strong className="font-semibold">
                      {Intl.NumberFormat().format(totalMemberCount)}
                    </strong>
                  ),
                },
              )}
            </p>
          </>
        )}
      </div>
      <NavigationSidebarLinksList
        className="md:-mx-2.5 md:w-[calc(100%+1.25rem)]"
        items={dashboardMainMenu}
      />
      <div className="mt-4 border-t border-t-gray-200 pt-4">
        <NavigationSidebarLinksList
          className="md:-mx-2.5 md:w-[calc(100%+1.25rem)]"
          items={dashboardMenu}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
