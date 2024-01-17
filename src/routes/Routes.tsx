import React from 'react';
import { Route, Routes as RoutesSwitch } from 'react-router-dom';

import ColonyFunding from '~common/ColonyFunding';
import { Flow } from '~common/Onboarding';
import { ExtensionsContextProvider } from '~context/ExtensionsContext';
import AdvancedPage from '~frame/Extensions/pages/AdvancedPage';
import ColonyDetailsPage from '~frame/Extensions/pages/ColonyDetailsPage';
import ExtensionDetailsPage from '~frame/Extensions/pages/ExtensionDetailsPage';
import ExtensionsPage from '~frame/Extensions/pages/ExtensionsPage';
import IncorporationPage from '~frame/Extensions/pages/IncorporationPage';
import IntegrationsPage from '~frame/Extensions/pages/IntegrationsPage';
import PermissionsPage from '~frame/Extensions/pages/PermissionsPage';
import ReputationPage from '~frame/Extensions/pages/ReputationPage';
import FourOFour from '~frame/FourOFour';
import LandingPage from '~frame/LandingPage';
import ActivityPage from '~frame/v5/pages/ActivityPage';
import BalancePage from '~frame/v5/pages/BalancePage';
import ColonyPreviewPage from '~frame/v5/pages/ColonyPreviewPage';
import MembersPage, {
  AllMembersPage,
  ContributorsPage,
} from '~frame/v5/pages/MembersPage';
import OnboardingPage from '~frame/v5/pages/OnboardingPage';
import TeamsPage from '~frame/v5/pages/TeamsPage';
import UserAdvancedPage from '~frame/v5/pages/UserAdvancedPage';
import UserPreferencesPage from '~frame/v5/pages/UserPreferencesPage';
import UserProfilePage from '~frame/v5/pages/UserProfilePage';
import UserAccountPage from '~frame/v5/pages/UserProfilePage/partials/UserAccountPage';
import VerifiedPage from '~frame/v5/pages/VerifiedPage';
import { useTitle } from '~hooks';
import ColonyHomePage from '~v5/frame/ColonyHome';

import ColonyMembersRoute from './ColonyMembersRoute';
import ColonyRoute from './ColonyRoute';
import LandingPageRoute from './LandingPageRoute';
import MainRoute from './MainRoute';
import NotFoundRoute from './NotFoundRoute';
import RootRoute from './RootRoute';
import {
  COLONY_BALANCES_ROUTE,
  COLONY_HOME_ROUTE,
  COLONY_OLD_HOME_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_MEMBERS_WITH_DOMAIN_ROUTE,
  CREATE_COLONY_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  NOT_FOUND_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  USER_INVITE_ROUTE,
  COLONY_REPUTATION_ROUTE,
  COLONY_DETAILS_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_INTEGRATIONS_ROUTE,
  COLONY_INCORPORATION_ROUTE,
  COLONY_ADVANCED_ROUTE,
  COLONY_CONTRIBUTORS_ROUTE,
  COLONY_VERIFIED_ROUTE,
  COLONY_TEAMS_ROUTE,
  USER_PREFERENCES_ROUTE,
  USER_ADVANCED_ROUTE,
  USER_HOME_ROUTE,
  COLONY_ACTIVITY_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_SPLASH_ROUTE,
  CREATE_PROFILE_ROUTE,
  // ACTIONS_PAGE_ROUTE,
  // UNWRAP_TOKEN_ROUTE,
  // CLAIM_TOKEN_ROUTE,
} from './routeConstants';

// import { ClaimTokensPage, UnwrapTokensPage } from '~dashboard/Vesting';

const displayName = 'routes.Routes';

const Routes = () => {
  useTitle();

  return (
    <RoutesSwitch>
      <Route path="/" element={<RootRoute />}>
        <Route element={<LandingPageRoute />}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route path={NOT_FOUND_ROUTE} element={<FourOFour />} />

        {/* Main routes */}
        <Route element={<MainRoute />}>
          <Route path={USER_INVITE_ROUTE} element={<ColonyPreviewPage />} />
          <Route path={COLONY_SPLASH_ROUTE} element={<ColonyPreviewPage />} />

          {/* User routes */}
          <Route path={USER_HOME_ROUTE} element={<UserProfilePage />}>
            <Route
              path={USER_EDIT_PROFILE_ROUTE}
              element={<UserAccountPage />}
            />
            <Route
              path={USER_PREFERENCES_ROUTE}
              element={<UserPreferencesPage />}
            />
            <Route path={USER_ADVANCED_ROUTE} element={<UserAdvancedPage />} />
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

        {/* Colony routes */}
        <Route path={COLONY_HOME_ROUTE} element={<ColonyRoute />}>
          <Route index element={<ColonyHomePage />} />
          <Route path={COLONY_ACTIVITY_ROUTE} element={<ActivityPage />} />

          <Route path={COLONY_INCOMING_ROUTE} element={<ColonyFunding />} />
          <Route element={<ColonyMembersRoute />}>
            <Route element={<MembersPage />}>
              {[COLONY_MEMBERS_ROUTE, COLONY_MEMBERS_WITH_DOMAIN_ROUTE].map(
                (path) => (
                  <Route path={path} element={<AllMembersPage />} key={path} />
                ),
              )}
              <Route
                path={COLONY_CONTRIBUTORS_ROUTE}
                element={<ContributorsPage />}
              />
            </Route>
            <Route path={COLONY_VERIFIED_ROUTE} element={<VerifiedPage />} />
            <Route path={COLONY_BALANCES_ROUTE} element={<BalancePage />} />
            <Route path={COLONY_TEAMS_ROUTE} element={<TeamsPage />} />
          </Route>

          {/* Colony settings routes */}
          <Route path={COLONY_DETAILS_ROUTE} element={<ColonyDetailsPage />} />

          {/* Enable the following routes in dev mode */}
          {/* @ts-ignore */}
          {!WEBPACK_IS_PRODUCTION && (
            <Route
              path={COLONY_REPUTATION_ROUTE}
              element={<ReputationPage />}
            />
          )}

          {/* @ts-ignore */}
          {!WEBPACK_IS_PRODUCTION && (
            <Route
              path={COLONY_PERMISSIONS_ROUTE}
              element={<PermissionsPage />}
            />
          )}

          {/* @ts-ignore */}
          {!WEBPACK_IS_PRODUCTION && (
            <Route
              path={COLONY_INTEGRATIONS_ROUTE}
              element={<IntegrationsPage />}
            />
          )}

          {/* @ts-ignore */}
          {!WEBPACK_IS_PRODUCTION && (
            <Route
              path={COLONY_INCORPORATION_ROUTE}
              element={<IncorporationPage />}
            />
          )}
          <Route path={COLONY_EXTENSIONS_ROUTE} element={<ExtensionsPage />} />
          <Route
            path={COLONY_EXTENSION_DETAILS_ROUTE}
            element={
              /* I am not sure why this needs a provider, but I guess we'll find out soon enough */
              <ExtensionsContextProvider>
                <ExtensionDetailsPage />
              </ExtensionsContextProvider>
            }
          />
          <Route path={COLONY_ADVANCED_ROUTE} element={<AdvancedPage />} />
        </Route>

        {/* OLD Colony routes -- remove when going live */}
        <Route path={COLONY_OLD_HOME_ROUTE} element={<ColonyRoute />}>
          {/* <Route
            path={COLONY_EVENTS_ROUTE}
            element={
              <ColonyHomeLayout
                filteredDomainId={domainIdFilter}
                onDomainChange={setDomainIdFilter}
              >
                {/* <ColonyEvents colony={colony} ethDomainId={filteredDomainId} /> }
                <div>Events (Transactions Log)</div>
              </ColonyHomeLayout>
            }
          /> */}
          <Route path={COLONY_INCOMING_ROUTE} element={<ColonyFunding />} />

          {/* Colony settings routes */}

          <Route path={COLONY_DETAILS_ROUTE} element={<ColonyDetailsPage />} />
          <Route path={COLONY_REPUTATION_ROUTE} element={<ReputationPage />} />
          <Route
            path={COLONY_PERMISSIONS_ROUTE}
            element={<PermissionsPage />}
          />
          <Route path={COLONY_EXTENSIONS_ROUTE} element={<ExtensionsPage />} />
          <Route
            path={COLONY_EXTENSION_DETAILS_ROUTE}
            element={
              /* I am not sure why this needs a provider, but I guess we'll find out soon enough */
              <ExtensionsContextProvider>
                <ExtensionDetailsPage />
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_INTEGRATIONS_ROUTE}
            element={<IntegrationsPage />}
          />
          <Route
            path={COLONY_INCORPORATION_ROUTE}
            element={<IncorporationPage />}
          />
          <Route path={COLONY_ADVANCED_ROUTE} element={<AdvancedPage />} />
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
