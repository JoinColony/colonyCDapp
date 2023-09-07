import React from 'react';
import {
  Route,
  Routes as RoutesSwitch,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { defineMessages } from 'react-intl';

import CreateUserWizard from '~common/CreateUserWizard';
import ColonyHome from '~common/ColonyHome';
import ColonyFunding from '~common/ColonyFunding';
import ColonyMembers from '~common/ColonyMembers';
import FourOFour from '~frame/FourOFour';
import UserProfile from '~common/UserProfile';
import UserProfileEdit from '~common/UserProfileEdit';
import { ColonyContextProvider } from '~context/ColonyContext';
import CreateColonyWizard from '~common/CreateColonyWizard';
import DecisionPreview from '~common/ColonyDecisions/DecisionPreview';
import ActionDetailsPage from '~common/ColonyActions/ActionDetailsPage';
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
import { useAppContext, useMobile, useTitle } from '~hooks';

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
  // ACTIONS_PAGE_ROUTE,
  // UNWRAP_TOKEN_ROUTE,
  // CLAIM_TOKEN_ROUTE,
} from './routeConstants';
import NotFoundRoute from './NotFoundRoute';

const displayName = 'routes.Routes';

const MSG = defineMessages({
  userProfileEditBack: {
    id: `${displayName}.userProfileEditBack`,
    defaultMessage: 'Go to profile',
  },
  // loadingAppMessage: {
  //   id: 'routes.Routes.loadingAppMessage',
  //   defaultMessage: 'Loading App',
  // },
});

const Routes = () => {
  const { user } = useAppContext(); // wallet
  const isMobile = useMobile();
  // const isAppLoading = appLoadingContext.getIsLoading();
  // const isConnected = wallet?.address;
  // const didClaimProfile = user?.name;

  useTitle();

  // if (isAppLoading) {
  //   return <LoadingTemplate loadingText={MSG.loadingAppMessage} />;
  // }

  return (
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
        {[COLONY_MEMBERS_ROUTE, COLONY_MEMBERS_WITH_DOMAIN_ROUTE].map(
          (path) => (
            <Route key={path} path={path} element={<ColonyMembers />} />
          ),
        )}
      </Route>
      <Route
        path={COLONY_DECISIONS_PREVIEW_ROUTE}
        element={
          <ColonyContextProvider>
            <NavBar>
              <DecisionPreview />
            </NavBar>
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
      {[ACTIONS_PAGE_ROUTE, DECISIONS_PAGE_ROUTE].map((path) => (
        <Route
          path={path}
          element={
            <ColonyContextProvider>
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
            </ColonyContextProvider>
          }
          key={path}
        />
      ))}
      <Route path={CREATE_COLONY_ROUTE} element={<CreateColonyWizard />} />
      <Route path={CREATE_USER_ROUTE} element={<CreateUserWizard />} />
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
          <Default
            routeProps={{
              hasBackLink: true,
              hasSubscribedColonies: isMobile,
              backText: MSG.userProfileEditBack,
              backRoute: `/user/${user?.name}`,
            }}
          >
            <UserProfileEdit />
          </Default>
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
  );
};

Routes.displayName = displayName;

export default Routes;
