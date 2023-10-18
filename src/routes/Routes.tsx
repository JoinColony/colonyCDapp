import React, { useEffect } from 'react';
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
import { ColonyContextProvider } from '~context/ColonyContext';
import DecisionPreview from '~common/ColonyDecisions/DecisionPreview';
import ActionDetailsPage from '~common/ColonyActions/ActionDetailsPage';
import { Default, NavBar, UserLayout } from '~frame/RouteLayouts';
import ColonyBackText from '~frame/ColonyBackText';
import LandingPage from '~frame/LandingPage';
// import { ClaimTokensPage, UnwrapTokensPage } from '~dashboard/Vesting';

import { useTitle } from '~hooks';

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
  // ACTIONS_PAGE_ROUTE,
  // UNWRAP_TOKEN_ROUTE,
  // CLAIM_TOKEN_ROUTE,
} from './routeConstants';
import NotFoundRoute from './NotFoundRoute';

import { ColonyLayout, MainLayout } from '~frame/Extensions/layouts';
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
import { ColonyUsersPageType } from '~frame/v5/pages/ColonyUsersPage/types';
import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';
import UserProfilePage from '~frame/v5/pages/UserProfilePage';
import UserPreferencesPage from '~frame/v5/pages/UserPreferencesPage';
import UserAdvancedPage from '~frame/v5/pages/UserAdvancedPage';
import { usePageThemeContext } from '~context/PageThemeContext';
import { ActionSidebarContextProvider } from '~context/ActionSidebarContext';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import { useMemberModalContext } from '~context/MemberModalContext';
import { AppContextProvider } from '~context';
import { applyTheme } from '~frame/Extensions/themes/utils';
import { Theme } from '~frame/Extensions/themes/enum';
import CreateColonyPage from '~frame/v5/pages/CreateColonyPage';

const displayName = 'routes.Routes';

// @TODO: Move to an own file. Probably
const RootLayout = () => {
  const { isDarkMode } = usePageThemeContext();
  useEffect(() => {
    applyTheme(isDarkMode ? Theme.dark : Theme.light);
  }, [isDarkMode]);
  return (
    <AppContextProvider>
      <Outlet />
    </AppContextProvider>
  );
};

const ColonyRouteInner = () => {
  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();
  return (
    <>
      <Outlet />
      <ManageMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        user={modalUser}
      />
    </>
  );
};

// @TODO: Move to an own file, maybe include Providers that are currently in ColonyContextProvider
const ColonyRoute = () => (
  <ColonyContextProvider>
    <ColonyRouteInner />
  </ColonyContextProvider>
);

const Routes = () => {
  useTitle();

  return (
    <RoutesSwitch>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to={LANDING_PAGE_ROUTE} />} />
        <Route path={NOT_FOUND_ROUTE} element={<FourOFour />} />
        <Route
          path={LANDING_PAGE_ROUTE}
          element={
            /* @TODO: ColonyContextProvider is only temporary here. It should not be needed in the landing page */
            <ColonyContextProvider>
              <Default routeProps={{ hasBackLink: false }}>
                <LandingPage />
              </Default>
            </ColonyContextProvider>
          }
        />
        <Route
          path={CREATE_COLONY_ROUTE}
          element={
            <MainLayout
              loadingText="createColony"
              title={{ id: 'createColonyPage.title' }}
              description={{ id: 'createColony.description' }}
              pageName="createColony"
            >
              <CreateColonyPage />
            </MainLayout>
          }
        />
        <Route path={CREATE_USER_ROUTE} element={<CreateUserWizard />} />
        <Route path={COLONY_HOME_ROUTE} element={<ColonyRoute />}>
          <Route
            index
            element={
              <Default routeProps={{ hasBackLink: false }}>
                <ColonyHome />
              </Default>
            }
          />
          <Route
            path={COLONY_FUNDING_ROUTE}
            element={
              <Default
                routeProps={{
                  backText: ColonyBackText,
                  backRoute: ({ colonyName }) => `/colony/${colonyName}`,
                  hasSubscribedColonies: false,
                }}
              >
                <ColonyFunding />
              </Default>
            }
          />
          {[COLONY_MEMBERS_ROUTE, COLONY_MEMBERS_WITH_DOMAIN_ROUTE].map(
            (path) => (
              <Route
                key={path}
                path={path}
                element={
                  <ExtensionsContextProvider>
                    <MemberContextProvider>
                      <ActionSidebarContextProvider>
                        <ColonyLayout
                          loadingText="members"
                          title={{ id: 'membersPage.title' }}
                          description={{ id: 'membersPage.description' }}
                          pageName="members"
                        >
                          <MembersPage />
                        </ColonyLayout>
                      </ActionSidebarContextProvider>
                    </MemberContextProvider>
                  </ExtensionsContextProvider>
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
                  <ExtensionsContextProvider>
                    <MemberContextProvider>
                      <ActionSidebarContextProvider>
                        <ColonyLayout
                          loadingText={pageName}
                          title={{ id: `${pageName}Page.title` }}
                          description={{
                            id: `${pageName}Page.description`,
                          }}
                          pageName="members"
                        >
                          <ColonyUsersPage pageName={pageName} />
                        </ColonyLayout>
                      </ActionSidebarContextProvider>
                    </MemberContextProvider>
                  </ExtensionsContextProvider>
                }
              />
            );
          })}
          <Route
            path={COLONY_VERIFIED_ROUTE}
            element={
              <ExtensionsContextProvider>
                <MemberContextProvider>
                  <ActionSidebarContextProvider>
                    <ColonyLayout
                      loadingText="verified"
                      title={{ id: 'verifiedPage.title' }}
                      description={{ id: 'verifiedPage.description' }}
                      pageName="members"
                    >
                      <VerifiedPage />
                    </ColonyLayout>
                  </ActionSidebarContextProvider>
                </MemberContextProvider>
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_TEAMS_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ColonyLayout
                  loadingText="teams"
                  title={{ id: 'teamsPage.title' }}
                  description={{ id: 'teamsPage.description' }}
                  pageName="members"
                >
                  <TeamsPage />
                </ColonyLayout>
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_DECISIONS_PREVIEW_ROUTE}
            element={
              <NavBar>
                <DecisionPreview />
              </NavBar>
            }
          />
          <Route
            path={COLONY_EXTENSION_DETAILS_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ActionSidebarContextProvider>
                  <ColonyLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'extensionsPage.title' }}
                    description={{ id: 'extensionsPage.description' }}
                    pageName="extensions"
                  >
                    <ExtensionDetailsPage />
                  </ColonyLayout>
                </ActionSidebarContextProvider>
              </ExtensionsContextProvider>
            }
          />
          {[ACTIONS_PAGE_ROUTE, DECISIONS_PAGE_ROUTE].map((path) => (
            <Route
              path={path}
              element={
                <NavBar
                  routeProps={{
                    backRoute: ({ colonyName }) =>
                      `/colony/${colonyName}${
                        path === DECISIONS_PAGE_ROUTE ? '/decisions' : ''
                      }`,
                  }}
                >
                  <ActionDetailsPage />
                </NavBar>
              }
              key={path}
            />
          ))}
          <Route
            path={COLONY_DETAILS_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ActionSidebarContextProvider>
                  <ColonyLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'colonyDetailsPage.title' }}
                    description={{ id: 'colonyDetailsPage.description' }}
                    pageName="extensions"
                  >
                    <ColonyDetailsPage />
                  </ColonyLayout>
                </ActionSidebarContextProvider>
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_REPUTATION_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ActionSidebarContextProvider>
                  <ColonyLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'extensionsPage.title' }}
                    description={{ id: 'extensionsPage.description' }}
                    pageName="extensions"
                  >
                    <ReputationPage />
                  </ColonyLayout>
                </ActionSidebarContextProvider>
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_PERMISSIONS_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ActionSidebarContextProvider>
                  <ColonyLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'extensionsPage.title' }}
                    description={{ id: 'extensionsPage.description' }}
                    pageName="extensions"
                  >
                    <PermissionsPage />
                  </ColonyLayout>
                </ActionSidebarContextProvider>
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_EXTENSIONS_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ActionSidebarContextProvider>
                  <ColonyLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'extensionsPage.title' }}
                    description={{ id: 'extensionsPage.description' }}
                    pageName="extensions"
                  >
                    <ExtensionsPage />
                  </ColonyLayout>
                </ActionSidebarContextProvider>
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_INTEGRATIONS_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ActionSidebarContextProvider>
                  <ColonyLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'extensionsPage.title' }}
                    description={{ id: 'extensionsPage.description' }}
                    pageName="extensions"
                  >
                    <IntegrationsPage />
                  </ColonyLayout>
                </ActionSidebarContextProvider>
              </ExtensionsContextProvider>
            }
          />
          <Route
            path={COLONY_INCORPORATION_ROUTE}
            element={
              <ColonyLayout
                loadingText={{ id: 'loading.extensionsPage' }}
                title={{ id: 'extensionsPage.title' }}
                description={{ id: 'extensionsPage.description' }}
                pageName="extensions"
              >
                <ExtensionsContextProvider>
                  <IncorporationPage />
                </ExtensionsContextProvider>
              </ColonyLayout>
            }
          />
          <Route
            path={COLONY_ADVANCED_ROUTE}
            element={
              <ExtensionsContextProvider>
                <ActionSidebarContextProvider>
                  <ColonyLayout
                    loadingText={{ id: 'loading.extensionsPage' }}
                    title={{ id: 'advancedPage.title' }}
                    description={{ id: 'advancedPage.description' }}
                    pageName="extensions"
                  >
                    <AdvancedPage />
                  </ColonyLayout>
                </ActionSidebarContextProvider>
              </ExtensionsContextProvider>
            }
          />
        </Route>
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
            <ColonyLayout
              loadingText={{ id: 'loading.userProfilePage' }}
              title={{ id: 'userProfilePage.title' }}
              description={{ id: 'userProfilePage.description' }}
              pageName="profile"
            >
              <UserProfilePage />
            </ColonyLayout>
          }
        />
        <Route
          path={USER_PREFERENCES_ROUTE}
          element={
            <ColonyLayout
              loadingText={{ id: 'loading.userPreferencesPage' }}
              title={{ id: 'userPreferencesPage.title' }}
              description={{ id: 'userPreferencesPage.description' }}
              pageName="profile"
            >
              <UserPreferencesPage />
            </ColonyLayout>
          }
        />
        <Route
          path={USER_ADVANCED_ROUTE}
          element={
            <ColonyLayout
              loadingText={{ id: 'loading.userAdvancedPage' }}
              title={{ id: 'userAdvancedPage.title' }}
              description={{ id: 'userAdvancedPage.description' }}
              pageName="profile"
            >
              <UserAdvancedPage />
            </ColonyLayout>
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
      ))}
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
