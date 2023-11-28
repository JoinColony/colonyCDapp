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
import { tabRoutes } from './consts';
import { TabId } from './types';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const resolvedEditProfilePath = useResolvedPath(USER_EDIT_PROFILE_ROUTE);
  const resolvedPreferencesPath = useResolvedPath(USER_PREFERENCES_ROUTE);
  const resolvedAdvancedPath = useResolvedPath(USER_ADVANCED_ROUTE);
  const [activeTab, setActiveTab] = useState<TabId>(TabId.Tab0);

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
        setActiveTab(TabId.Tab0);
        break;
      case resolvedPreferencesPath.pathname:
        setActiveTab(TabId.Tab1);
        break;
      case resolvedAdvancedPath.pathname:
        setActiveTab(TabId.Tab2);
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

  return (
    <Tabs
      activeTab={activeTab}
      onTabClick={(_, id) => navigate(tabRoutes[id])}
      items={[
        {
          id: TabId.Tab0,
          title: formatText({ id: 'userProfilePage.title' }) || '',
          content: <Outlet />,
        },
        {
          id: TabId.Tab1,
          title: formatText({ id: 'userPreferencesPage.title' }) || '',
          content: <Outlet />,
        },
        {
          id: TabId.Tab2,
          title: formatText({ id: 'userAdvancedPage.title' }) || '',
          content: <Outlet />,
        },
      ]}
    />
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
