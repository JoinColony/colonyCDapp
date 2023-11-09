import React from 'react';
import { Route, Routes as RoutesSwitch, Navigate } from 'react-router-dom';

import ColonyHome from '~common/ColonyHome';
import ColonyFunding from '~common/ColonyFunding';
import FourOFour from '~frame/FourOFour';
import UserProfile from '~common/UserProfile';
import DecisionPreview from '~common/ColonyDecisions/DecisionPreview';
import ActionDetailsPage from '~common/ColonyActions/ActionDetailsPage';
import { NavBar, UserLayout } from '~frame/RouteLayouts';
import LandingPage from '~frame/LandingPage';
import { useTitle } from '~hooks';
import ExtensionDetailsPage from '~frame/Extensions/pages/ExtensionDetailsPage';
import ColonyDetailsPage from '~frame/Extensions/pages/ColonyDetailsPage';
import ReputationPage from '~frame/Extensions/pages/ReputationPage';
import ExtensionsPage from '~frame/Extensions/pages/ExtensionsPage';
import IntegrationsPage from '~frame/Extensions/pages/IntegrationsPage';
import IncorporationPage from '~frame/Extensions/pages/IncorporationPage';
import AdvancedPage from '~frame/Extensions/pages/AdvancedPage';
import PermissionsPage from '~frame/Extensions/pages/PermissionsPage';
import { ExtensionsContextProvider } from '~context/ExtensionsContext';
import MembersPage from '~frame/v5/pages/MembersPage';
import ColonyUsersPage from '~frame/v5/pages/ColonyUsersPage';
import VerifiedPage from '~frame/v5/pages/VerifiedPage';
import TeamsPage from '~frame/v5/pages/TeamsPage';
import UserProfilePage from '~frame/v5/pages/UserProfilePage';
import UserPreferencesPage from '~frame/v5/pages/UserPreferencesPage';
import UserAdvancedPage from '~frame/v5/pages/UserAdvancedPage';
import CreateColonyPage from '~frame/v5/pages/CreateColonyPage';
// import { ClaimTokensPage, UnwrapTokensPage } from '~dashboard/Vesting';

import {
  COLONY_FUNDING_ROUTE,
  COLONY_HOME_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_MEMBERS_WITH_DOMAIN_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_ROUTE,
  LANDING_PAGE_ROUTE,
  NOT_FOUND_ROUTE,
  DECISIONS_PAGE_ROUTE,
  COLONY_DECISIONS_PREVIEW_ROUTE,
  ACTIONS_PAGE_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_REPUTATION_ROUTE,
  COLONY_DETAILS_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_INTEGRATIONS_ROUTE,
  COLONY_INCORPORATION_ROUTE,
  COLONY_ADVANCED_ROUTE,
  COLONY_CONTRIBUTORS_ROUTE,
  COLONY_FOLLOWERS_ROUTE,
  COLONY_VERIFIED_ROUTE,
  COLONY_TEAMS_ROUTE,
  USER_PREFERENCES_ROUTE,
  USER_ADVANCED_ROUTE,
  USER_HOME_ROUTE,
  // ACTIONS_PAGE_ROUTE,
  // UNWRAP_TOKEN_ROUTE,
  // CLAIM_TOKEN_ROUTE,
} from './routeConstants';

import RootRoute from './RootRoute';
import NotFoundRoute from './NotFoundRoute';
import MainRoute from './MainRoute';
import ColonyRoute from './ColonyRoute';
import ColonyMembersRoute from './ColonyMembersRoute';
import ColonySettingsRoute from './ColonySettingsRoute';
import UserRoute from './UserRoute';
import WizardRoute from './WizardRoute';

const displayName = 'routes.Routes';

const Routes = () => {
  useTitle();

  return (
    <RoutesSwitch>
      <Route path="/" element={<RootRoute />}>
        <Route index element={<Navigate to={LANDING_PAGE_ROUTE} />} />
        <Route path={NOT_FOUND_ROUTE} element={<FourOFour />} />

        {/* Main routes */}
        <Route element={<MainRoute />}>
          <Route path={LANDING_PAGE_ROUTE} element={<LandingPage />} />
          <Route
            path={USER_ROUTE}
            element={
              <UserLayout routeProps={{ hasBackLink: false }}>
                <UserProfile />
              </UserLayout>
            }
          />

          {/* User routes */}
          <Route path={USER_HOME_ROUTE} element={<UserRoute />}>
            <Route
              path={USER_EDIT_PROFILE_ROUTE}
              element={<UserProfilePage />}
            />
            <Route
              path={USER_PREFERENCES_ROUTE}
              element={<UserPreferencesPage />}
            />
            <Route path={USER_ADVANCED_ROUTE} element={<UserAdvancedPage />} />
          </Route>
        </Route>

        <Route element={<WizardRoute />}>
          <Route path={CREATE_USER_ROUTE} element={<CreateUserPage />} />
          <Route path={CREATE_COLONY_ROUTE} element={<CreateColonyPage />} />
        </Route>

        {/* Colony routes */}
        <Route path={COLONY_HOME_ROUTE} element={<ColonyRoute />}>
          <Route index element={<ColonyHome />} />
          <Route path={COLONY_FUNDING_ROUTE} element={<ColonyFunding />} />
          <Route element={<ColonyMembersRoute />}>
            <Route path={COLONY_MEMBERS_ROUTE} element={<MembersPage />} />
            <Route
              path={COLONY_MEMBERS_WITH_DOMAIN_ROUTE}
              element={<MembersPage />}
            />
            <Route
              path={COLONY_CONTRIBUTORS_ROUTE}
              element={<ColonyUsersPage pageName="contributors" />}
            />
            <Route
              path={COLONY_FOLLOWERS_ROUTE}
              element={<ColonyUsersPage pageName="followers" />}
            />
            <Route path={COLONY_VERIFIED_ROUTE} element={<VerifiedPage />} />
            <Route path={COLONY_TEAMS_ROUTE} element={<TeamsPage />} />
          </Route>
          <Route
            path={COLONY_DECISIONS_PREVIEW_ROUTE}
            element={
              <NavBar>
                <DecisionPreview />
              </NavBar>
            }
          />

          {/* Colony settings routes */}
          <Route element={<ColonySettingsRoute />}>
            <Route
              path={COLONY_DETAILS_ROUTE}
              element={<ColonyDetailsPage />}
            />
            <Route
              path={COLONY_REPUTATION_ROUTE}
              element={<ReputationPage />}
            />
            <Route
              path={COLONY_PERMISSIONS_ROUTE}
              element={<PermissionsPage />}
            />
            <Route
              path={COLONY_EXTENSIONS_ROUTE}
              element={<ExtensionsPage />}
            />
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

          <Route path={ACTIONS_PAGE_ROUTE} element={<ActionDetailsPage />} />
          <Route path={DECISIONS_PAGE_ROUTE} element={<ActionDetailsPage />} />
        </Route>
        {/*
      <AlwaysAccesibleRoute
        path={UNWRAP_TOKEN_ROUTE}
        component={UnwrapTokensPage}
        layout={NavBar}
        routeProps={({ colonyName }) => ({
          backText: ColonyBackText,
          backRoute: `/colony/${colonyName}`,
        })}
      />
      <AlwaysAccesibleRoute
        path={CLAIM_TOKEN_ROUTE}
        component={ClaimTokensPage}
        layout={NavBar}
        routeProps={({ colonyName }) => ({
          backText: ColonyBackText,
          backRoute: `/colony/${colonyName}`,
        })}
      />

      /*
       * Redirect anything else that's not found to the 404 route
       */}
        <Route path="*" element={<NotFoundRoute />} />
      </Route>
    </RoutesSwitch>
  );
};

Routes.displayName = displayName;

export default Routes;
