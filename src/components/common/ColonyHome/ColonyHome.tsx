import React, { useState } from 'react';
import {
  Outlet,
  Route,
  Routes as RoutesSwitch,
  useLocation,
} from 'react-router-dom';

import ColonyActions from '~common/ColonyActions';

import ColonyDecisions from '~common/ColonyDecisions';
import { ColonyHomeProvider } from '~context/ColonyHomeContext';
import {
  COLONY_DECISIONS_ROUTE,
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  NotFoundRoute,
} from '~routes';
import ColonyExtensions from '~common/ColonyExtensions';
import ExtensionDetails from '~common/Extensions/ExtensionDetails';
import { useColonyContext } from '~hooks';
import Expenditures from '~common/Expenditures';

import ColonyHomeLayout from './ColonyHomeLayout';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/hooks';
import { formatText } from '~utils/intl';

const displayName = 'common.ColonyHome';

const ColonyHome = () => {
  const { colony } = useColonyContext();

  useSetPageHeadingTitle(formatText({ id: 'colonyHome.title' }));

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryDomainIdFilter = searchParams.get('domainFilter');
  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainIdFilter),
  );

  if (!colony) {
    return null;
  }

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
        <Route path={COLONY_EXTENSIONS_ROUTE} element={<ColonyExtensions />} />
        <Route
          path={COLONY_EXTENSION_DETAILS_ROUTE}
          element={<ExtensionDetails />}
        />
        <Route
          path={COLONY_DECISIONS_ROUTE}
          element={<ColonyDecisions domainId={domainIdFilter} />}
        />
        <Route path="/expenditures/*" element={<Expenditures />} />
      </Route>

      <Route path="*" element={<NotFoundRoute />} />
    </RoutesSwitch>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
