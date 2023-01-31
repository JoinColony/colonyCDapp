import React, { useMemo, useState } from 'react';
import {
  Outlet,
  Route,
  Routes as RoutesSwitch,
  useLocation,
  useParams,
} from 'react-router-dom';

// import Extensions, { ExtensionDetails } from '~dashboard/Extensions';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import { allAllowedExtensions } from '~data/staticData/';

// import ColonyActions from '~dashboard/ColonyActions';
// import ColonyEvents from '~dashboard/ColonyEvents';

import ColonyDecisions from '~common/ColonyDecisions';

import {
  COLONY_DECISIONS_ROUTE,
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
} from '~routes/index';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useColonyContext } from '~hooks';

import ColonyHomeLayout from './ColonyHomeLayout';

const displayName = 'common.ColonyHome';

const ColonyHome = () => {
  const { colony } = useColonyContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { extensionId } = useParams<{
    extensionId?: string;
  }>();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryDomainIdFilter = searchParams.get('domainFilter');
  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainIdFilter),
  );
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
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
              >
                {/* <ColonyEvents colony={colony} ethDomainId={filteredDomainId} /> */}
                <div>Events (Transactions Log)</div>
              </ColonyHomeLayout>
            }
          />

          <Route
            element={
              <ColonyHomeLayout
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
              >
                <Outlet />
              </ColonyHomeLayout>
            }
          >
            <Route
              path={COLONY_EXTENSIONS_ROUTE}
              element={
                <>
                  {/* <Extensions {...props} colonyAddress={colonyAddress} /> */}
                  <div>Extensions</div>
                </>
              }
            />
            <Route
              path={COLONY_EXTENSION_DETAILS_ROUTE}
              element={
                <>
                  <div>Extension details</div>
                  {/* <ExtensionDetails {...props} colony={colony} /> */}
                </>
              }
            />
            <Route
              path={COLONY_EXTENSION_SETUP_ROUTE}
              element={
                <>
                  <div>Extension setup</div>
                  {/* <ExtensionDetails {...props} colony={colony} /> */}
                </>
              }
            />
            <Route
              path={COLONY_DECISIONS_ROUTE}
              element={
                <ColonyDecisions
                /* ethDomainId={filteredDomainId} */
                />
              }
            />
          </Route>

          <Route path="*" element={<NotFoundRoute />} />
        </RoutesSwitch>
      );
    }
    return null;
  }, [colony, filteredDomainId]);

  // if (!isExtensionIdValid) {
  //   return <NotFoundRoute />;
  // }

  return memoizedSwitch;
};

ColonyHome.displayName = displayName;

export default ColonyHome;
