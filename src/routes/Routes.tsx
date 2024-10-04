import React from 'react';
import { Route, Routes as RoutesSwitch } from 'react-router-dom';

import ColonyFunding from '~common/ColonyFunding/index.ts';
import { Flow } from '~common/Onboarding/index.ts';
import ExtensionDetailsPage from '~frame/Extensions/pages/ExtensionDetailsPage/ExtensionDetailsPage.tsx';
import ExtensionsPage from '~frame/Extensions/pages/ExtensionsPage/index.ts';
import IntegrationsPage from '~frame/Extensions/pages/IntegrationsPage/index.ts';
import PermissionsPage from '~frame/Extensions/pages/PermissionsPage/index.ts';
import IndividualPermissionsPage from '~frame/Extensions/pages/PermissionsPage/IndividualPermissionsPage.tsx';
import MultisigPermissionsPage from '~frame/Extensions/pages/PermissionsPage/MultisigPermissionsPage.tsx';
import ReputationPage from '~frame/Extensions/pages/ReputationPage/index.ts';
import FourOFour from '~frame/FourOFour/index.ts';
import LandingPage from '~frame/LandingPage/index.ts';
import ActivityPage from '~frame/v5/pages/ActivityPage/index.ts';
import FiltersContextProvider from '~frame/v5/pages/AgreementsPage/FiltersContext/FiltersContextProvider.tsx';
import AgreementsPage from '~frame/v5/pages/AgreementsPage/index.ts';
import BalancePage from '~frame/v5/pages/BalancePage/index.ts';
import ColonyPreviewPage from '~frame/v5/pages/ColonyPreviewPage/index.ts';
import MembersPage, {
  AllMembersPage,
  ContributorsPage,
} from '~frame/v5/pages/MembersPage/index.ts';
import OnboardingPage from '~frame/v5/pages/OnboardingPage/index.ts';
import StreamingPaymentsPage from '~frame/v5/pages/StreamingPaymentsPage/StreamingPaymentsPage.tsx';
import TeamsPage from '~frame/v5/pages/TeamsPage/index.ts';
import UserAdvancedPage from '~frame/v5/pages/UserAdvancedPage/index.ts';
import UserCryptoToFiatPage from '~frame/v5/pages/UserCryptoToFiatPage/CryptoToFiatPage.tsx';
import UserPreferencesPage from '~frame/v5/pages/UserPreferencesPage/index.ts';
import UserProfilePage from '~frame/v5/pages/UserProfilePage/index.ts';
import UserAccountPage from '~frame/v5/pages/UserProfilePage/partials/UserAccountPage/index.ts';
import VerifiedPage from '~frame/v5/pages/VerifiedPage/index.ts';
import useTitle from '~hooks/useTitle.ts';
import ColonyHomePage from '~v5/frame/ColonyHome/index.ts';

import ColonyMembersRoute from './ColonyMembersRoute.tsx';
import ColonyRoute from './ColonyRoute.tsx';
import MainRoute from './MainRoute.tsx';
import NotFoundRoute from './NotFoundRoute.tsx';
import RootRoute from './RootRoute.tsx';
import {
  COLONY_BALANCES_ROUTE,
  COLONY_HOME_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_FOLLOWERS_ROUTE,
  COLONY_MEMBERS_WITH_DOMAIN_ROUTE,
  CREATE_COLONY_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  NOT_FOUND_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  USER_INVITE_ROUTE,
  COLONY_REPUTATION_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_INTEGRATIONS_ROUTE,
  COLONY_VERIFIED_ROUTE,
  COLONY_TEAMS_ROUTE,
  USER_PREFERENCES_ROUTE,
  USER_ADVANCED_ROUTE,
  USER_HOME_ROUTE,
  COLONY_ACTIVITY_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_SPLASH_ROUTE,
  CREATE_PROFILE_ROUTE,
  COLONY_MULTISIG_ROUTE,
  COLONY_AGREEMENTS_ROUTE,
  USER_CRYPTO_TO_FIAT_ROUTE,
  RESERVED_ROUTES,
  COLONY_STREAMING_PAYMENTS_ROUTE,
  // ACTIONS_PAGE_ROUTE,
  // UNWRAP_TOKEN_ROUTE,
  // CLAIM_TOKEN_ROUTE,
} from './routeConstants.ts';
import UserRoute from './UserRoute.tsx';

// import { ClaimTokensPage, UnwrapTokensPage } from '~dashboard/Vesting';

const displayName = 'routes.Routes';

const Routes = () => {
  useTitle();

  return (
    <RoutesSwitch>
      <Route path="/" element={<RootRoute />}>
        <Route index element={<LandingPage />} />

        <Route path={NOT_FOUND_ROUTE} element={<FourOFour />} />

        {/* Main routes */}
        <Route element={<MainRoute />} />
        <Route path={USER_INVITE_ROUTE} element={<ColonyPreviewPage />} />
        <Route path={COLONY_SPLASH_ROUTE} element={<ColonyPreviewPage />} />

        {/* User routes */}
        <Route path={USER_HOME_ROUTE} element={<UserRoute />}>
          <Route element={<UserProfilePage />}>
            <Route
              path={USER_EDIT_PROFILE_ROUTE}
              element={<UserAccountPage />}
            />
            <Route
              path={USER_PREFERENCES_ROUTE}
              element={<UserPreferencesPage />}
            />
            <Route path={USER_ADVANCED_ROUTE} element={<UserAdvancedPage />} />
            <Route
              path={USER_CRYPTO_TO_FIAT_ROUTE}
              element={<UserCryptoToFiatPage />}
            />
          </Route>
        </Route>

        <Route
          path={CREATE_PROFILE_ROUTE}
          element={<OnboardingPage flow={Flow.User} />}
        />

        <Route
          path={CREATE_COLONY_ROUTE}
          element={<OnboardingPage flow={Flow.Colony} />}
        />

        {/* If a reserved route has not been used by this point, redirect to NotFoundRoute */}
        {[...RESERVED_ROUTES]
          // Allow in use colony names
          .filter((route) => !['/meta', '/beta'].includes(route))
          .map((route) => (
            <Route path={route} key={route} element={<NotFoundRoute />} />
          ))}

        {/* Colony routes */}
        <Route path={COLONY_HOME_ROUTE} element={<ColonyRoute />}>
          <Route index element={<ColonyHomePage />} />
          <Route path={COLONY_ACTIVITY_ROUTE} element={<ActivityPage />} />

          <Route path={COLONY_INCOMING_ROUTE} element={<ColonyFunding />} />
          <Route element={<ColonyMembersRoute />}>
            <Route element={<MembersPage />}>
              {[COLONY_FOLLOWERS_ROUTE, COLONY_MEMBERS_WITH_DOMAIN_ROUTE].map(
                (path) => (
                  <Route path={path} element={<AllMembersPage />} key={path} />
                ),
              )}
              <Route
                path={COLONY_MEMBERS_ROUTE}
                element={<ContributorsPage />}
              />
            </Route>
            <Route path={COLONY_VERIFIED_ROUTE} element={<VerifiedPage />} />
            <Route path={COLONY_BALANCES_ROUTE} element={<BalancePage />} />
            <Route path={COLONY_TEAMS_ROUTE} element={<TeamsPage />} />
            <Route
              path={COLONY_STREAMING_PAYMENTS_ROUTE}
              element={<StreamingPaymentsPage />}
            />
          </Route>

          <Route path={COLONY_REPUTATION_ROUTE} element={<ReputationPage />} />
          <Route
            path={COLONY_AGREEMENTS_ROUTE}
            element={
              <FiltersContextProvider>
                <AgreementsPage />
              </FiltersContextProvider>
            }
          />

          <Route element={<PermissionsPage />}>
            <Route
              path={COLONY_PERMISSIONS_ROUTE}
              element={<IndividualPermissionsPage />}
            />
            <Route
              path={COLONY_MULTISIG_ROUTE}
              element={<MultisigPermissionsPage />}
            />
          </Route>

          {/* Colony settings routes */}
          <Route path={COLONY_AGREEMENTS_ROUTE} element={<AgreementsPage />} />

          {/* Enable the following routes in dev mode */}
          {import.meta.env.DEV && (
            <Route
              path={COLONY_INTEGRATIONS_ROUTE}
              element={<IntegrationsPage />}
            />
          )}

          <Route path={COLONY_EXTENSIONS_ROUTE} element={<ExtensionsPage />} />
          <Route
            path={COLONY_EXTENSION_DETAILS_ROUTE}
            element={<ExtensionDetailsPage />}
          />
        </Route>

        {/*
         * Redirect anything else that's not found to the 404 route
         */}
        <Route path="*" element={<NotFoundRoute />} />
      </Route>
    </RoutesSwitch>
  );
};

Routes.displayName = displayName;

export default Routes;
