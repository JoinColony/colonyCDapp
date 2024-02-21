import React, { type FC, useEffect, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

import { isDev } from '~constants/index.ts';
import {
  usePageHeadingContext,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/index.ts';
import {
  USER_ADVANCED_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_PREFERENCES_ROUTE,
  USER_PROFILE_EXPERIMENTAL_ROUTE,
} from '~routes/index.ts';
import Tabs from '~shared/Extensions/Tabs/index.ts';
import { type TabItem } from '~shared/Extensions/Tabs/types.ts';
import { formatText } from '~utils/intl.ts';

import { TabId } from './types.ts';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const resolvedEditProfilePath = useResolvedPath(USER_EDIT_PROFILE_ROUTE);
  const resolvedPreferencesPath = useResolvedPath(USER_PREFERENCES_ROUTE);
  const resolvedAdvancedPath = useResolvedPath(USER_ADVANCED_ROUTE);
  const resolvedExperimentalPath = useResolvedPath(
    USER_PROFILE_EXPERIMENTAL_ROUTE,
  );
  const [activeTab, setActiveTab] = useState<TabId>(TabId.Profile);

  const { setBreadcrumbs } = usePageHeadingContext();

  useEffect(() => {
    setBreadcrumbs([
      {
        key: 'landing-page',
        label: 'Colony App',
        href: '/',
      },
    ]);
  }, [setBreadcrumbs]);

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  useEffect(() => {
    switch (pathname) {
      case resolvedEditProfilePath.pathname:
        setActiveTab(TabId.Profile);
        break;
      case resolvedPreferencesPath.pathname:
        setActiveTab(TabId.Preferences);
        break;
      case resolvedAdvancedPath.pathname:
        setActiveTab(TabId.Advanced);
        break;
      case resolvedExperimentalPath.pathname:
        setActiveTab(TabId.Experimental);
        break;
      default:
        break;
    }
  }, [
    pathname,
    resolvedPreferencesPath.pathname,
    resolvedEditProfilePath.pathname,
    resolvedAdvancedPath.pathname,
    resolvedExperimentalPath.pathname,
  ]);

  const tabRoutes: Record<TabId, string> = {
    [TabId.Profile]: USER_EDIT_PROFILE_ROUTE,
    [TabId.Preferences]: USER_PREFERENCES_ROUTE,
    [TabId.Advanced]: USER_ADVANCED_ROUTE,
    [TabId.Experimental]: USER_PROFILE_EXPERIMENTAL_ROUTE,
  };

  const tabItems: TabItem[] = [
    {
      id: TabId.Profile,
      title: formatText({ id: 'userProfilePage.title' }) || '',
      content: <Outlet />,
    },
    {
      id: TabId.Preferences,
      title: formatText({ id: 'userPreferencesPage.title' }) || '',
      content: <Outlet />,
    },
    {
      id: TabId.Advanced,
      title: formatText({ id: 'userAdvancedPage.title' }) || '',
      content: <Outlet />,
    },
  ];

  if (isDev) {
    tabItems.push({
      id: TabId.Experimental,
      title: formatText({ id: 'userExperimentalPage.title' }) || '',
      content: <Outlet />,
      className: 'text-teams-red-600 md:hover:!text-teams-red-400',
      activeClassName:
        '!text-teams-red-600 md:hover:!text-teams-red-400 !border-teams-red-600',
    });
  }

  return (
    <Tabs
      activeTab={activeTab}
      onTabClick={(_, id) => navigate(tabRoutes[id])}
      items={tabItems}
    />
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
