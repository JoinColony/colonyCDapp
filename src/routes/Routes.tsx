import React, { useMemo } from 'react';
import {
  Route,
  Routes as RoutesSwitch,
  Navigate,
  Outlet,
} from 'react-router-dom';

import CreateUserWizard from '~common/CreateUserWizard';
import ColonyHome from '~common/ColonyHome';
import ColonyFunding from '~common/ColonyFunding';
import FourOFour from '~frame/FourOFour';
import UserProfile from '~common/UserProfile';
import {
  // NavBar, Plain, SimpleNav,
  Default,
  NavBar,
  UserLayout,
} from '~frame/RouteLayouts';
import ColonyBackText from '~frame/ColonyBackText';
// import LoadingTemplate from '~root/LoadingTemplate';
import LandingPage from '~frame/LandingPage';
// import ActionsPage from '~dashboard/ActionsPage';
// import { ClaimTokensPage, UnwrapTokensPage } from '~dashboard/Vesting';

// import appLoadingContext from '~context/appLoadingState';
import { useAppContext } from '~hooks';

import {
  COLONY_FUNDING_ROUTE,
  COLONY_HOME_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_MEMBERS_WITH_DOMAIN_ROUTE,
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
  USER_EDIT_ROUTE,
  USER_ROUTE,
  LANDING_PAGE_ROUTE,
  NOT_FOUND_ROUTE,
  ACTIONS_PAGE_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_REPUTATION_ROUTE,
  COLONY_DETAILS_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_INTEGRATIONS_ROUTE,
  COLONY_INCORPORATION_ROUTE,
  COLONY_ADVANCED_ROUTE,
  COLONY_EXTENSION_DETAILS_SETUP_ROUTE,
  COLONY_CONTRIBUTORS_ROUTE,
  COLONY_FOLLOWERS_ROUTE,
  COLONY_VERIFIED_ROUTE,
  COLONY_TEAMS_ROUTE,
  USER_PREFERENCES_ROUTE,
  USER_ADVANCED_ROUTE,
  COLONY_ADMIN_ROUTE,
  // ACTIONS_PAGE_ROUTE,
  // UNWRAP_TOKEN_ROUTE,
  // CLAIM_TOKEN_ROUTE,
} from './routeConstants';
import NotFoundRoute from './NotFoundRoute';
import { ColonyContextProvider } from '~context/ColonyContext';
import CreateColonyWizard from '~common/CreateColonyWizard';
import ActionDetailsPage from '~common/ColonyActions/ActionDetailsPage';
import PageLayout from '~frame/Extensions/layouts/PageLayout';
import ExtensionDetailsPage from '~frame/Extensions/pages/ExtensionDetailsPage';
import ColonyDetailsPage from '~frame/Extensions/pages/ColonyDetailsPage';
import ReputationPage from '~frame/Extensions/pages/ReputationPage';
import ExtensionsPage from '~frame/Extensions/pages/ExtensionsPage';
import IntegrationsPage from '~frame/Extensions/pages/IntegrationsPage';
import IncorporationPage from '~frame/Extensions/pages/IncorporationPage';
import AdvancedPage from '~frame/Extensions/pages/AdvancedPage';
import PermissionsPage from '~frame/Extensions/pages/PermissionsPage';
import LazyConsensusPage from '~frame/Extensions/pages/LazyConsensusPage';
import { ExtensionsContextProvider } from '~context/ExtensionsContext';
import MembersPage from '~frame/v5/pages/MembersPage';
import ColonyUsersPage from '~frame/v5/pages/ColonyUsersPage';
import VerifiedPage from '~frame/v5/pages/VerifiedPage';
import TeamsPage from '~frame/v5/pages/TeamsPage';
import { SearchContextProvider } from '~context/SearchContext';
import { ColonyUsersPageType } from '~frame/v5/pages/ColonyUsersPage/types';
import { MemberContextProvider } from '~context/MemberContext';
import UserProfilePage from '~frame/v5/pages/UserProfilePage';
import UserPreferencesPage from '~frame/v5/pages/UserPreferencesPage';
import UserAdvancedPage from '~frame/v5/pages/UserAdvancedPage';
import { PageThemeContextProvider } from '~context/PageThemeContext';

// import useTitle from '~hooks/useTitle';

const displayName = 'routes.Routes';

const Routes = () => {
  const { user, wallet } = useAppContext();
  // const isAppLoading = appLoadingContext.getIsLoading();

  // disabling rules to silence eslint warnings
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isConnected = wallet?.address;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const didClaimProfile = user?.name;

  // useTitle();

  /**
   * @NOTE Memoized Switch
   *
   * We need to memoize the entire route switch to prevent re-renders at not
   * so oportune times.
   *
   * The `balance` value, accessible through (no longer isLoggedInUser), even if we don't
   * use it here directly, will cause a re-render of the `<Routes />` component
   * every time it changes (using the subscription).
   *
   * To prevent this, we memoize the whole routes logic, to only render it again
   * when the user connects a new wallet.
   *
   * This was particularly problematic when creating a new colony, and after
   * the first TX, the balance would change and as a result everything would
   * re-render, reseting the wizard.
   */
  const MemoizedSwitch = useMemo(
    () => (
      <RoutesSwitch>
        <Route path="/" element={<Navigate to={LANDING_PAGE_ROUTE} />} />
        <Route path={NOT_FOUND_ROUTE} element={<FourOFour />} />

        <Route
          path={LANDING_PAGE_ROUTE}
          element={
            <Default routeProps={{ hasBackLink: false }}>
              <LandingPage />
            </Default>
          }
        />

        <Route
          element={
            <ColonyContextProvider>
              <Default
                routeProps={{
                  backText: ColonyBackText,
                  backRoute: ({ colonyName }) => `/colony/${colonyName}`,
                  hasSubscribedColonies: false,
                }}
              >
                <Outlet />
              </Default>
            </ColonyContextProvider>
          }
        >
          <Route path={COLONY_FUNDING_ROUTE} element={<ColonyFunding />} />
        </Route>
        {[COLONY_MEMBERS_ROUTE, COLONY_MEMBERS_WITH_DOMAIN_ROUTE].map(
          (path) => (
            <Route
              key={path}
              path={path}
              element={
                <ColonyContextProvider>
                  <ExtensionsContextProvider>
                    <SearchContextProvider>
                      <MemberContextProvider>
                        <PageLayout
                          loadingText="members"
                          title={{ id: 'membersPage.title' }}
                          description={{ id: 'membersPage.description' }}
                          pageName="members"
                        >
                          <MembersPage />
                        </PageLayout>
                      </MemberContextProvider>
                    </SearchContextProvider>
                  </ExtensionsContextProvider>
                </ColonyContextProvider>
              }
            />
          ),
        )}
        {[COLONY_CONTRIBUTORS_ROUTE, COLONY_FOLLOWERS_ROUTE].map((path) => {
          const pageName = path.split('/')[2] as ColonyUsersPageType;

          return (
            <Route
              key={path}
              path={path}
              element={
                <ColonyContextProvider>
                  <ExtensionsContextProvider>
                    <SearchContextProvider>
                      <MemberContextProvider>
                        <PageLayout
                          loadingText={pageName}
                          title={{ id: `${pageName}Page.title` }}
                          description={{ id: `${pageName}Page.description` }}
                          pageName="members"
                        >
                          <ColonyUsersPage pageName={pageName} />
                        </PageLayout>
                      </MemberContextProvider>
                    </SearchContextProvider>
                  </ExtensionsContextProvider>
                </ColonyContextProvider>
              }
            />
          );
        })}
        <Route
          path={COLONY_VERIFIED_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <SearchContextProvider>
                  <MemberContextProvider>
                    <PageLayout
                      loadingText="verified"
                      title={{ id: 'verifiedPage.title' }}
                      description={{ id: 'verifiedPage.description' }}
                      pageName="members"
                    >
                      <VerifiedPage />
                    </PageLayout>
                  </MemberContextProvider>
                </SearchContextProvider>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_TEAMS_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText="teams"
                  title={{ id: 'teamsPage.title' }}
                  description={{ id: 'teamsPage.description' }}
                  pageName="members"
                >
                  <TeamsPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_HOME_ROUTE}
          element={
            <ColonyContextProvider>
              <Default routeProps={{ hasBackLink: false }}>
                <ColonyHome />
              </Default>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_EXTENSION_DETAILS_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText={{ id: 'loading.extensionsPage' }}
                  title={{ id: 'extensionsPage.title' }}
                  description={{ id: 'extensionsPage.description' }}
                  pageName="extensions"
                >
                  <ExtensionDetailsPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_EXTENSION_DETAILS_SETUP_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText={{ id: 'loading.extensionsPage' }}
                  title={{ id: 'extensionsPage.title' }}
                  description={{ id: 'extensionsPage.description' }}
                  pageName="extensions"
                >
                  <LazyConsensusPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={ACTIONS_PAGE_ROUTE}
          element={
            <ColonyContextProvider>
              <NavBar>
                <ActionDetailsPage />
              </NavBar>
            </ColonyContextProvider>
          }
        />
        <Route path={CREATE_COLONY_ROUTE} element={<CreateColonyWizard />} />
        <Route path={CREATE_USER_ROUTE} element={<CreateUserWizard />} />
        {[COLONY_ADMIN_ROUTE, COLONY_DETAILS_ROUTE].map((path) => (
          <Route
            path={path}
            key={path}
            element={
              <ColonyContextProvider>
                <ExtensionsContextProvider>
                  <PageLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'colonyDetailsPage.title' }}
                    description={{ id: 'colonyDetailsPage.description' }}
                    pageName="extensions"
                  >
                    <ColonyDetailsPage />
                  </PageLayout>
                </ExtensionsContextProvider>
              </ColonyContextProvider>
            }
          />
        ))}
        <Route
          path={COLONY_REPUTATION_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText={{ id: 'loading.extensionsPage' }}
                  title={{ id: 'extensionsPage.title' }}
                  description={{ id: 'extensionsPage.description' }}
                  pageName="extensions"
                >
                  <ReputationPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_PERMISSIONS_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText={{ id: 'loading.extensionsPage' }}
                  title={{ id: 'extensionsPage.title' }}
                  description={{ id: 'extensionsPage.description' }}
                  pageName="extensions"
                >
                  <PermissionsPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_EXTENSIONS_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText={{ id: 'loading.extensionsPage' }}
                  title={{ id: 'extensionsPage.title' }}
                  description={{ id: 'extensionsPage.description' }}
                  pageName="extensions"
                >
                  <ExtensionsPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_INTEGRATIONS_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText={{ id: 'loading.extensionsPage' }}
                  title={{ id: 'extensionsPage.title' }}
                  description={{ id: 'extensionsPage.description' }}
                  pageName="extensions"
                >
                  <IntegrationsPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_INCORPORATION_ROUTE}
          element={
            <ColonyContextProvider>
              <PageLayout
                loadingText={{ id: 'loading.extensionsPage' }}
                title={{ id: 'extensionsPage.title' }}
                description={{ id: 'extensionsPage.description' }}
                pageName="extensions"
              >
                <ExtensionsContextProvider>
                  <IncorporationPage />
                </ExtensionsContextProvider>
              </PageLayout>
            </ColonyContextProvider>
          }
        />
        <Route
          path={COLONY_ADVANCED_ROUTE}
          element={
            <ColonyContextProvider>
              <ExtensionsContextProvider>
                <PageLayout
                  loadingText={{ id: 'loading.extensionsPage' }}
                  title={{ id: 'advancedPage.title' }}
                  description={{ id: 'advancedPage.description' }}
                  pageName="extensions"
                >
                  <AdvancedPage />
                </PageLayout>
              </ExtensionsContextProvider>
            </ColonyContextProvider>
          }
        />
        <Route
          path={USER_ROUTE}
          element={
            <UserLayout routeProps={{ hasBackLink: false }}>
              <UserProfile />
            </UserLayout>
          }
        />
        <Route
          path={USER_EDIT_ROUTE}
          element={
            <PageThemeContextProvider>
              <PageLayout
                loadingText={{ id: 'loading.userProfilePage' }}
                title={{ id: 'userProfilePage.title' }}
                description={{ id: 'userProfilePage.description' }}
                pageName="profile"
                hideColonies
              >
                <UserProfilePage />
              </PageLayout>
            </PageThemeContextProvider>
          }
        />
        <Route
          path={USER_PREFERENCES_ROUTE}
          element={
            <PageThemeContextProvider>
              <PageLayout
                loadingText={{ id: 'loading.userPreferencesPage' }}
                title={{ id: 'userPreferencesPage.title' }}
                description={{ id: 'userPreferencesPage.description' }}
                pageName="profile"
                hideColonies
              >
                <UserPreferencesPage />
              </PageLayout>
            </PageThemeContextProvider>
          }
        />
        <Route
          path={USER_ADVANCED_ROUTE}
          element={
            <PageThemeContextProvider>
              <PageLayout
                loadingText={{ id: 'loading.userAdvancedPage' }}
                title={{ id: 'userAdvancedPage.title' }}
                description={{ id: 'userAdvancedPage.description' }}
                pageName="profile"
                hideColonies
              >
                <UserAdvancedPage />
              </PageLayout>
            </PageThemeContextProvider>
          }
        />
        {/* <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={CREATE_USER_ROUTE}
          component={CreateUserWizard}
          layout={Plain}
        />
        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={CREATE_COLONY_ROUTE}
          component={CreateColonyWizard}
          layout={Plain}
        />

        <AlwaysAccesibleRoute
          path={USER_ROUTE}
          component={UserProfile}
          layout={SimpleNav}
          routeProps={{
            hasBackLink: false,
          }}
        />
        <AlwaysAccesibleRoute
          path={USER_EDIT_ROUTE}
          component={UserProfileEdit}
          layout={Default}
          routeProps={{
            hasSubscribedColonies: false,
            backText: MSG.userProfileEditBack,
            backRoute: `/user/${username}`,
          }}
        />
        <AlwaysAccesibleRoute
          exact
          path={ACTIONS_PAGE_ROUTE}
          component={ActionsPage}
          layout={NavBar}
          routeProps={({ colonyName }) => ({
            backText: '',
            backRoute: `/colony/${colonyName}`,
          })}
        />
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

        {/*
         * Redirect anything else that's not found to the 404 route
         */}
        <Route path="*" element={<NotFoundRoute />} />
      </RoutesSwitch>
    ),
    [],
  );

  // if (isAppLoading) {
  //   return <LoadingTemplate loadingText={MSG.loadingAppMessage} />;
  // }
  return MemoizedSwitch;
};

Routes.displayName = displayName;

export default Routes;
