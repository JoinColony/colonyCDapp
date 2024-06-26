import React, { type FC, useEffect, useState, useContext } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

import {
  FeatureFlag,
  FeatureFlagsContext,
} from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import {
  usePageHeadingContext,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/PageHeadingContext.ts';
import {
  USER_CRYPTO_TO_FIAT_ROUTE,
  USER_ADVANCED_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_PREFERENCES_ROUTE,
} from '~routes/index.ts';
import Tabs from '~shared/Extensions/Tabs/index.ts';
import { formatText } from '~utils/intl.ts';

import { TabId } from './types.ts';

const displayName = 'v5.pages.UserProfilePage';

const tabRoutes: Record<TabId, string> = {
  [TabId.Profile]: USER_EDIT_PROFILE_ROUTE,
  [TabId.Preferences]: USER_PREFERENCES_ROUTE,
  [TabId.Advanced]: USER_ADVANCED_ROUTE,
  [TabId.CryptoToFiat]: USER_CRYPTO_TO_FIAT_ROUTE,
};

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const featureFlags = useContext(FeatureFlagsContext);
  const resolvedEditProfilePath = useResolvedPath(USER_EDIT_PROFILE_ROUTE);
  const resolvedPreferencesPath = useResolvedPath(USER_PREFERENCES_ROUTE);
  const resolvedAdvancedPath = useResolvedPath(USER_ADVANCED_ROUTE);
  const resolvedCryptoToFiatPath = useResolvedPath(USER_CRYPTO_TO_FIAT_ROUTE);
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
      case resolvedCryptoToFiatPath.pathname:
        setActiveTab(TabId.CryptoToFiat);
        break;
      default:
        break;
    }
  }, [
    pathname,
    resolvedPreferencesPath.pathname,
    resolvedEditProfilePath.pathname,
    resolvedAdvancedPath.pathname,
    resolvedCryptoToFiatPath.pathname,
  ]);

  const items = [
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

  if (featureFlags[FeatureFlag.CRYPTO_TO_FIAT]) {
    items.push({
      id: TabId.CryptoToFiat,
      title: formatText({ id: 'userCryptoToFiatPage.title' }) || '',
      content: <Outlet />,
    });
  }

  return (
    <Tabs
      activeTab={activeTab}
      className="pt-6"
      onTabClick={(_, id) => navigate(tabRoutes[id])}
      items={items}
    />
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
