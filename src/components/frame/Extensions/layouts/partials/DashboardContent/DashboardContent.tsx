import React, { FC } from 'react';

import { SpinnerLoader } from '~shared/Preloaders';
import { useMemberContext } from '~context/MemberContext';
import { formatText } from '~utils/intl';
import NavigationSidebarLinksList from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLinksList';

import { dashboardMainMenu, dashboardMenu } from '../../consts';

const DashboardContent: FC = () => {
  const { totalContributorCount, totalMemberCount, loading } =
    useMemberContext();

  return (
    <div className="w-full pt-2 md:pt-4">
      <div className="w-full flex items-center gap-4 mb-4 md:mb-7 text-sm text-gray-900 px-2 md:px-0">
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
      <div className="border-t border-t-gray-200 mt-4 pt-4">
        <NavigationSidebarLinksList
          className="md:-mx-2.5 md:w-[calc(100%+1.25rem)]"
          items={dashboardMenu}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
