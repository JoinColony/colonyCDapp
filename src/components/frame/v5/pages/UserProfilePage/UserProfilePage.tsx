import React, { type FC, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useFeatureFlagsContext } from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import { FeatureFlag } from '~context/FeatureFlagsContext/types.ts';
import {
  usePageHeadingContext,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useTablet } from '~hooks';
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
    id: TabId.Profile,
    route: USER_EDIT_PROFILE_ROUTE,
    title: formatText({ id: 'userProfilePage.title' }) || '',
    content: <Outlet />,
  },
  {
    id: TabId.Preferences,
    route: USER_PREFERENCES_ROUTE,
    title: formatText({ id: 'userPreferencesPage.title' }) || '',
    content: <Outlet />,
  },
  {
    id: TabId.Advanced,
    route: USER_ADVANCED_ROUTE,
    title: formatText({ id: 'userAdvancedPage.title' }) || '',
    content: <Outlet />,
  },
  {
    id: TabId.CryptoToFiat,
    route: USER_CRYPTO_TO_FIAT_ROUTE,
    title: formatText({ id: 'userCryptoToFiatPage.title' }) || '',
    content: <Outlet />,
    featureFlag: FeatureFlag.CRYPTO_TO_FIAT,
  },
];

const getTabPath = (pathname: string) => {
  const segments = pathname.split('/');
  return segments[segments.length - 1];
};

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const featureFlags = useFeatureFlagsContext();
  const isTablet = useTablet();

  const { setBreadcrumbs } = usePageHeadingContext();

  const allowedTabRoutes = tabRoutes.filter((route) =>
    route.featureFlag
      ? featureFlags[route.featureFlag]?.isLoading ||
        featureFlags[route.featureFlag]?.isEnabled
      : true,
  );

  const tabPath = getTabPath(pathname);
  const activeTab = allowedTabRoutes.find(
    (route) => route.route === tabPath,
  )?.id;

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

  if (activeTab === undefined) {
    return <Navigate to="/account/profile" />;
  }

  return (
    <Tabs
      activeTab={activeTab}
      className="pt-6 md:pt-4"
      onTabClick={(_, id) =>
        navigate(tabRoutes.find((route) => route.id === id)?.route ?? '')
      }
      items={allowedTabRoutes}
      showTabs={isTablet}
    />
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
