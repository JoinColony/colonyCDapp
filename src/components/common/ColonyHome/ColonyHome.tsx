import React, { useMemo, useState } from 'react';
import {
  Outlet,
  Route,
  Routes as RoutesSwitch,
  useLocation,
  useParams,
} from 'react-router-dom';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import ColonyActions from '~dashboard/ColonyActions';
// import ColonyEvents from '~dashboard/ColonyEvents';
import {
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
} from '~routes/index';
import NotFoundRoute from '~routes/NotFoundRoute';
import ColonyExtensions from '~common/ColonyExtensions';
import ExtensionDetails from '~common/ExtensionDetails';
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

  const memoizedSwitch = useMemo(() => {
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
                showActions={false}
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
                showControls={false}
                showSidebar={false}
              >
                <Outlet />
              </ColonyHomeLayout>
            }
          >
            <Route
              path={COLONY_EXTENSIONS_ROUTE}
              element={<ColonyExtensions />}
            />
            <Route
              path={COLONY_EXTENSION_DETAILS_ROUTE}
              element={<ExtensionDetails />}
            />
          </Route>

          <Route path="*" element={<NotFoundRoute />} />
        </RoutesSwitch>
      );
    }
    return null;
  }, [colony, filteredDomainId]);

  return memoizedSwitch;
};

ColonyHome.displayName = displayName;

export default ColonyHome;
