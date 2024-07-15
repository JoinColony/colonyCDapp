import React, { type FC, useEffect, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

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

const tabRoutes = [
  {
    tabId: TabId.Profile,
    route: USER_EDIT_PROFILE_ROUTE,
  },
  {
    tabId: TabId.Preferences,
    route: USER_PREFERENCES_ROUTE,
  },
  {
    tabId: TabId.Advanced,
    route: USER_ADVANCED_ROUTE,
  },
  {
    tabId: TabId.CryptoToFiat,
    route: USER_CRYPTO_TO_FIAT_ROUTE,
  },
];

const getTabPath = (pathname: string) => {
  const segments = pathname.split('/');
  return segments[segments.length - 1];
};

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const featureFlags = useContext(FeatureFlagsContext);

  const { setBreadcrumbs } = usePageHeadingContext();

  const cryptoToFiatFeatureFlag = featureFlags[FeatureFlag.CRYPTO_TO_FIAT];

  const tabPath = getTabPath(pathname);
  const activeTab = tabRoutes.find((route) => route.route === tabPath)?.tabId;

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

  if (cryptoToFiatFeatureFlag?.isEnabled) {
    items.push({
      id: TabId.CryptoToFiat,
      title: formatText({ id: 'userCryptoToFiatPage.title' }) || '',
      content: <Outlet />,
    });
  }

  if (activeTab === undefined) {
    return null;
  }

  return (
    <Tabs
      activeTab={activeTab}
      className="pt-6"
      onTabClick={(_, id) =>
        navigate(tabRoutes.find((route) => route.tabId === id)?.route ?? '')
      }
      items={items}
    />
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
