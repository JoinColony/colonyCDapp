import React, { useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import {
  Outlet,
  Route,
  Routes as RoutesSwitch,
  useParams,
} from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import LoadingTemplate from '~frame/LoadingTemplate';
// import Extensions, { ExtensionDetails } from '~dashboard/Extensions';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import { allAllowedExtensions } from '~data/staticData/';

// import ColonyActions from '~dashboard/ColonyActions';
// import ColonyEvents from '~dashboard/ColonyEvents';

import ColonyHomeLayout from './ColonyHomeLayout';

import { getFullColonyByName } from '~gql';

import styles from './ColonyHomeLayout.css';

import {
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
  COLONY_FUNDING_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_MEMBERS_WITH_DOMAIN_ROUTE,
} from '~routes/index';
import NotFoundRoute from '~routes/NotFoundRoute';
import { Default } from '~frame/RouteLayouts';
import ColonyFunding from '~common/ColonyFunding';
import ColonyMembers from '~common/ColonyMembers';

const displayName = 'common.ColonyHome';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

const ColonyHome = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId?: string;
  }>();

  const { data, loading, error } = useQuery(gql(getFullColonyByName), {
    variables: {
      name: colonyName,
    },
  });

  const [colony] = data?.getColonyByName?.items || [];

  // console.log(colony);

  // const { domainFilter: queryDomainFilterId } = parseQS(location?.search) as {
  //   domainFilter: string | undefined;
  // };

  const [domainIdFilter, setDomainIdFilter] = useState<number>(0);

  const filteredDomainId = domainIdFilter || COLONY_TOTAL_BALANCE_DOMAIN_ID;

  // const isExtensionIdValid = useMemo(
  //   // if no extensionId is provided, assume it's valid
  //   () => (extensionId ? allAllowedExtensions.includes(extensionId) : true),
  //   [extensionId],
  // );

  const memoizedSwitch = useMemo(() => {
    // if (data?.processedColony && isExtensionIdValid) {
    if (colony) {
      return (
        <RoutesSwitch>
          <Route
            path="/"
            element={
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                // ethDomainId={filteredDomainId}
              >
                {/* <ColonyActions colony={colony} ethDomainId={filteredDomainId} /> */}
                <div>Actions & Motions List</div>
              </ColonyHomeLayout>
            }
          />
          <Route
            path={COLONY_EVENTS_ROUTE}
            element={
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                // showActions={false}
              >
                {/* <ColonyEvents colony={colony} ethDomainId={filteredDomainId} /> */}
                <div>Events (Transactions Log)</div>
              </ColonyHomeLayout>
            }
          />
          <Route
            path={COLONY_EXTENSIONS_ROUTE}
            element={
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                showControls={false}
                showSidebar={false}
              >
                {/* <Extensions {...props} colonyAddress={colonyAddress} /> */}
                <div>Extensions</div>
              </ColonyHomeLayout>
            }
          />
          <Route
            path={COLONY_EXTENSION_DETAILS_ROUTE}
            element={
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                showControls={false}
                showSidebar={false}
              >
                <div>Extension details</div>
                {/* <ExtensionDetails {...props} colony={colony} /> */}
              </ColonyHomeLayout>
            }
          />
          <Route
            path={COLONY_EXTENSION_SETUP_ROUTE}
            element={
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                showControls={false}
                showSidebar={false}
              >
                <div>Extension setup</div>
                {/* <ExtensionDetails {...props} colony={colony} /> */}
              </ColonyHomeLayout>
            }
          />
          <Route
            element={
              <Default
                routeProps={{
                  // backText: ColonyBackText,
                  backRoute: `/colony/${colonyName}`,
                  hasSubscribedColonies: false,
                }}
              >
                <Outlet />
              </Default>
            }
          >
            <Route
              path={COLONY_FUNDING_ROUTE}
              element={<ColonyFunding colony={colony} />}
            />
            {/* Why? See https://stackoverflow.com/questions/70005601/alternate-way-for-optional-parameters-in-v6 */}
            {[COLONY_MEMBERS_ROUTE, COLONY_MEMBERS_WITH_DOMAIN_ROUTE].map(
              (path) => (
                <Route
                  key={path}
                  path={path}
                  element={<ColonyMembers colony={colony} />}
                />
              ),
            )}
          </Route>

          <Route path="*" element={<NotFoundRoute />} />
        </RoutesSwitch>
      );
    }
    return null;
  }, [colony, colonyName, filteredDomainId]);

  if (loading || (colony && colony.name !== colonyName)) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (
    !colonyName ||
    error ||
    !colony ||
    colony instanceof Error
    // || !isExtensionIdValid
  ) {
    return <NotFoundRoute />;
  }

  return memoizedSwitch;
};

ColonyHome.displayName = displayName;

export default ColonyHome;
