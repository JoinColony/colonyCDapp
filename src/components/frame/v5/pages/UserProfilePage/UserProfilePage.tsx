import React, { FC, useEffect, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { formatText } from '~utils/intl';
import { usePageHeadingContext, useSetPageHeadingTitle } from '~context';
import {
  USER_ADVANCED_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_PREFERENCES_ROUTE,
} from '~routes';
import Tabs from '~shared/Extensions/Tabs';
import { TabId } from './types';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const resolvedEditProfilePath = useResolvedPath(USER_EDIT_PROFILE_ROUTE);
  const resolvedPreferencesPath = useResolvedPath(USER_PREFERENCES_ROUTE);
  const resolvedAdvancedPath = useResolvedPath(USER_ADVANCED_ROUTE);
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
      default:
        break;
    }
  }, [
    pathname,
    resolvedPreferencesPath.pathname,
    resolvedEditProfilePath.pathname,
    resolvedAdvancedPath.pathname,
  ]);

  const tabRoutes: Record<TabId, string> = {
    [TabId.Profile]: USER_EDIT_PROFILE_ROUTE,
    [TabId.Preferences]: USER_PREFERENCES_ROUTE,
    [TabId.Advanced]: USER_ADVANCED_ROUTE,
  };

  return (
    <Tabs
      activeTab={activeTab}
      onTabClick={(_, id) => navigate(tabRoutes[id])}
      items={[
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
      ]}
    />
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
