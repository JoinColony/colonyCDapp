import { LockKey, ShareNetwork } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useEffect, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import {
  COLONY_MEMBERS_ROUTE,
  COLONY_FOLLOWERS_ROUTE,
} from '~routes/routeConstants.ts';
import Tabs from '~shared/Extensions/Tabs/index.ts';
import { formatText } from '~utils/intl.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Filter from '~v5/common/Filter/index.ts';
import { FilterTypes } from '~v5/common/TableFiltering/types.ts';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';

import { useMembersPage } from './hooks.ts';
import { MembersTabContentWrapper } from './partials/MembersTabContent/index.ts';

const displayName = 'v5.pages.MembersPage';

const MembersPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const resolvedMembersPath = useResolvedPath(COLONY_FOLLOWERS_ROUTE);
  const resolvedContributorsPath = useResolvedPath(COLONY_MEMBERS_ROUTE);
  const [activeTab, setActiveTab] = useState(0);
  const { totalContributorCount, sortedContributorCount, sortedMemberCount } =
    useMembersPage();

  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const isMobile = useMobile();

  const titleAction = (
    <MeatBallMenu
      withVerticalIcon
      contentWrapperClassName={clsx('sm:min-w-[17.375rem]', {
        '!left-6 right-6': isMobile,
      })}
      items={[
        {
          key: '1',
          icon: ShareNetwork,
          label: formatText({
            id: 'members.subnav.invite',
          }),
          renderItemWrapper: (props, children) => (
            <MeatballMenuCopyItem
              textToCopy={`${APP_URL.origin}/${colonyName}`}
              {...props}
            >
              {children}
            </MeatballMenuCopyItem>
          ),
          onClick: () => false,
        },
        {
          key: '2',
          icon: LockKey,
          label: formatText({
            id: 'members.subnav.permissions',
          }),
          onClick: () => {
            toggleActionSidebarOn({
              [ACTION_TYPE_FIELD_NAME]: Action.ManagePermissions,
            });
          },
        },
      ]}
    />
  );

  useEffect(() => {
    if (pathname === resolvedMembersPath.pathname) {
      setActiveTab(1);
    } else if (pathname === resolvedContributorsPath.pathname) {
      setActiveTab(0);
    }
  }, [
    pathname,
    resolvedContributorsPath.pathname,
    resolvedMembersPath.pathname,
  ]);

  const tabs = (
    <Tabs
      activeTab={activeTab}
      onTabClick={(_, id) =>
        navigate(id === 0 ? COLONY_MEMBERS_ROUTE : COLONY_FOLLOWERS_ROUTE)
      }
      items={[
        {
          id: 0,
          title: formatText({ id: 'membersPage.title' }),
          notificationNumber:
            activeTab === 0 ? sortedContributorCount : totalContributorCount,
          content: (
            <MembersTabContentWrapper
              title={formatText({ id: 'membersPage.members.title' })}
              description={formatText({
                id: 'membersPage.members.description',
              })}
              additionalActions={
                <Filter
                  excludeFilterType={FilterTypes.Team}
                  searchInputLabel={formatMessage({
                    id: 'filter.members.search.title',
                  })}
                  searchInputPlaceholder={formatMessage({
                    id: 'filter.members.input.placeholder',
                  })}
                  customLabel={formatMessage({ id: 'allFilters' })}
                />
              }
              titleAction={titleAction}
            >
              <Outlet />
            </MembersTabContentWrapper>
          ),
        },
        {
          id: 1,
          title: formatText({ id: 'membersPage.followers.title' }),
          notificationNumber: sortedMemberCount,
          content: (
            <MembersTabContentWrapper
              title={formatText({ id: 'membersPage.followers.title' })}
              description={formatText({
                id: 'membersPage.followers.description',
              })}
              additionalActions={
                <Filter
                  excludeFilterType={FilterTypes.Team}
                  searchInputLabel={formatMessage({
                    id: 'filter.members.search.title',
                  })}
                  searchInputPlaceholder={formatMessage({
                    id: 'filter.members.input.placeholder',
                  })}
                  customLabel={formatMessage({ id: 'allFilters' })}
                />
              }
              titleAction={titleAction}
            >
              <Outlet />
            </MembersTabContentWrapper>
          ),
        },
      ]}
    />
  );

  if (activeTab === 1) {
    return (
      <>
        <div className="h-[3.625rem]" />
        {tabs}
      </>
    );
  }

  return <ContentWithTeamFilter>{tabs}</ContentWithTeamFilter>;
};

MembersPage.displayName = displayName;

export default MembersPage;
