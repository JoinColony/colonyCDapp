import React, {
  // useEffect,
  useMemo,
} from 'react';
import { Route, Routes as RoutesSwitch, Navigate } from 'react-router-dom';
// import { defineMessages } from 'react-intl';
// import { useDispatch } from 'react-redux';

// import { WalletMethod } from '~immutable/index';
// import CreateColonyWizard from '~dashboard/CreateColonyWizard';
// import CreateUserWizard from '~dashboard/CreateUserWizard';
import ColonyHome from '~common/ColonyHome';
// import ColonyMembers from '~dashboard/ColonyMembers';
import FourOFour from '~frame/FourOFour';
// import Inbox from '~users/Inbox';
// import Wallet from '~dashboard/Wallet';
// import ConnectWalletWizard from '~users/ConnectWalletWizard';
// import UserProfile from '~users/UserProfile';
// import UserProfileEdit from '~users/UserProfileEdit';
import {
  // NavBar, Plain, SimpleNav,
  Default,
} from '~frame/RouteLayouts';
// import { ColonyBackText } from '~pages/BackTexts';
// import LoadingTemplate from '~root/LoadingTemplate';
import LandingPage from '~frame/LandingPage';
// import ActionsPage from '~dashboard/ActionsPage';
// import { ClaimTokensPage, UnwrapTokensPage } from '~dashboard/Vesting';

// import appLoadingContext from '~context/appLoadingState';
// import ColonyFunding from '~dashboard/ColonyFunding';
// import { ActionTypes } from '~redux';
import { useAppContext } from '~hooks';

import {
  // COLONY_EVENTS_ROUTE,
  // COLONY_EXTENSIONS_ROUTE,
  // COLONY_EXTENSION_DETAILS_ROUTE,
  // COLONY_EXTENSION_SETUP_ROUTE,
  // COLONY_FUNDING_ROUTE,
  COLONY_HOME_ROUTE,
  // CONNECT_ROUTE,
  // CREATE_COLONY_ROUTE,
  // CREATE_USER_ROUTE,
  // INBOX_ROUTE,
  // NOT_FOUND_ROUTE,
  // USER_EDIT_ROUTE,
  // USER_ROUTE,
  // WALLET_ROUTE,
  LANDING_PAGE_ROUTE,
  NOT_FOUND_ROUTE,
  // MEMBERS_ROUTE,
  // ACTIONS_PAGE_ROUTE,
  // UNWRAP_TOKEN_ROUTE,
  // CLAIM_TOKEN_ROUTE,
} from './routeConstants';
import NotFoundRoute from './NotFoundRoute';

// import WalletRequiredRoute from './WalletRequiredRoute';
// import useTitle from '~hooks/useTitle';

// const MSG = defineMessages({
//   userProfileEditBack: {
//     id: 'routes.Routes.userProfileEditBack',
//     defaultMessage: 'Go to profile',
//   },
//   loadingAppMessage: {
//     id: 'routes.Routes.loadingAppMessage',
//     defaultMessage: 'Loading App',
//   },
// });

const Routes = () => {
  const { user, wallet } = useAppContext();
  // const isAppLoading = appLoadingContext.getIsLoading();

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch({
  //     type: ActionTypes.WALLET_OPEN,
  //   });
  // }, [dispatch]);

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
          path={COLONY_HOME_ROUTE}
          element={
            <Default routeProps={{ hasBackLink: false }}>
              <ColonyHome />
            </Default>
          }
        />
        {/* <Route
          path={COLONY_FUNDING_ROUTE}
          element={
            <Default>
              <ColonyFunding />
            </Default>
          }
          routeProps={({ colonyName }) => ({
            backText: ColonyBackText,
            backRoute: `/colony/${colonyName}`,
            hasSubscribedColonies: false,
          })}
        /> */}

        {/* <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={CONNECT_ROUTE}
          component={ConnectWalletWizard}
          layout={Plain}
        />
        <WalletRequiredRoute
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
        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={WALLET_ROUTE}
          component={Wallet}
          layout={SimpleNav}
          routeProps={{
            hasBackLink: false,
          }}
        />
        <WalletRequiredRoute
          isConnected={isConnected}
          didClaimProfile={didClaimProfile}
          path={INBOX_ROUTE}
          component={Inbox}
          layout={SimpleNav}
          routeProps={{
            hasBackLink: false,
          }}
        />


        <AlwaysAccesibleRoute
          exact
          path={[
            COLONY_EXTENSION_DETAILS_ROUTE,
            COLONY_EXTENSIONS_ROUTE,
            COLONY_EXTENSION_SETUP_ROUTE,
            COLONY_HOME_ROUTE,
            COLONY_EVENTS_ROUTE,
          ]}
          component={ColonyHome}
          layout={Default}
          routeProps={{ hasBackLink: false }}
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
          path={MEMBERS_ROUTE}
          component={ColonyMembers}
          layout={Default}
          routeProps={({ colonyName }) => ({
            backText: ColonyBackText,
            backRoute: `/colony/${colonyName}`,
            hasSubscribedColonies: false,
          })}
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
        /> */}

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

export default Routes;
