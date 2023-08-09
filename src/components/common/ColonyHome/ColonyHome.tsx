import React, { useMemo, useState } from 'react';
import {
  Outlet,
  Route,
  Routes as RoutesSwitch,
  useLocation,
} from 'react-router-dom';

import ColonyActions from '~common/ColonyActions';
// import ColonyEvents from '~dashboard/ColonyEvents';

import ColonyDecisions from '~common/ColonyDecisions';

import {
  COLONY_DECISIONS_ROUTE,
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
} from '~routes/index';
import NotFoundRoute from '~routes/NotFoundRoute';
import ColonyExtensions from '~common/ColonyExtensions';
import ExtensionDetails from '~common/Extensions/ExtensionDetails';
import { useColonyContext } from '~hooks';

import ColonyHomeLayout from './ColonyHomeLayout';
import { ColonyHomeProvider } from '~context/ColonyHomeContext';

const displayName = 'common.ColonyHome';

const ColonyHome = () => {
  const { colony } = useColonyContext();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryDomainIdFilter = searchParams.get('domainFilter');
  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainIdFilter),
  );

  const memoizedSwitch = useMemo(() => {
    if (colony) {
      return (
        <RoutesSwitch>
          <Route
            path={COLONY_EVENTS_ROUTE}
            element={
              <ColonyHomeLayout
                filteredDomainId={domainIdFilter}
                onDomainChange={setDomainIdFilter}
              >
                {/* <ColonyEvents colony={colony} ethDomainId={filteredDomainId} /> */}
                <div>Events (Transactions Log)</div>
              </ColonyHomeLayout>
            }
          />
          <Route
            element={
              <ColonyHomeProvider>
                <ColonyHomeLayout
                  filteredDomainId={domainIdFilter}
                  onDomainChange={setDomainIdFilter}
                >
                  <Outlet />
                </ColonyHomeLayout>
              </ColonyHomeProvider>
            }
          >
            <Route path="/" element={<ColonyActions />} />
            <Route
              path={COLONY_EXTENSIONS_ROUTE}
              element={<ColonyExtensions />}
            />
            <Route
              path={COLONY_EXTENSION_DETAILS_ROUTE}
              element={<ExtensionDetails />}
            />
            <Route
              path={COLONY_DECISIONS_ROUTE}
              element={<ColonyDecisions domainId={domainIdFilter} />}
            />
          </Route>

          <Route path="*" element={<NotFoundRoute />} />
        </RoutesSwitch>
      );
    }
    return null;
  }, [colony, domainIdFilter]);

  return memoizedSwitch;
};

ColonyHome.displayName = displayName;

export default ColonyHome;
