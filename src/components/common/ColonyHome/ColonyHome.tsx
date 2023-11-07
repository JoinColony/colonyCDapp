import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import {
  Navigate,
  Outlet,
  Route,
  Routes as RoutesSwitch,
  useLocation,
  useParams,
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
import { useAppContext, useColonyContext } from '~hooks';
import Expenditures from '~common/Expenditures';
import { useGetColonyWhitelistByNameQuery } from '~gql';
import Spinner from '~v5/shared/Spinner';

import ColonyHomeLayout from './ColonyHomeLayout';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/hooks';
import { formatText } from '~utils/intl';

const MSG = defineMessages({
  loadingMessage: {
    id: 'ColonyHome.loadingMessage',
    defaultMessage: 'Loading Colony...',
  },
});

const displayName = 'common.ColonyHome';

const ColonyHome = () => {
  const { colonyName = '' } = useParams<{ colonyName: string }>();
  const { colony, loading } = useColonyContext();
  const { user, userLoading, walletConnecting } = useAppContext();

  // @TODO: This is terrible. Once we have auth, we need a method
  // to check whether the logged in user is a member of the Colony
  const { data: dataWhitelist, loading: whitelistLoading } =
    useGetColonyWhitelistByNameQuery({
      variables: { name: colonyName },
    });

  useSetPageHeadingTitle(formatText({ id: 'colonyHome.title' }));

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryDomainIdFilter = searchParams.get('domainFilter');
  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainIdFilter),
  );

  if (userLoading || walletConnecting || loading || whitelistLoading) {
    return <Spinner loading loadingText={MSG.loadingMessage} />;
  }

  const isMember = !!dataWhitelist?.getColonyByName?.items[0]?.whitelist.some(
    (addr) => addr === user?.walletAddress,
  );

  if (!user || !isMember) {
    return <Navigate to={`/go/${colonyName}`} />;
  }

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
