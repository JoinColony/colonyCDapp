import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import {
  Navigate,
  Route,
  // RouteChildrenProps,
  Routes as RoutesSwitch,
  useParams,
} from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

// import { parse as parseQS } from 'query-string';

import LoadingTemplate from '~root/LoadingTemplate';
// import Extensions, { ExtensionDetails } from '~dashboard/Extensions';

// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import { useColonyFromNameQuery } from '~data/index';
// import { allAllowedExtensions } from '~data/staticData/';

// import ColonyActions from '~dashboard/ColonyActions';
// import ColonyEvents from '~dashboard/ColonyEvents';

import ColonyHomeLayout from './ColonyHomeLayout';

import { getFullColonyByName } from '~gql/index';

import styles from './ColonyHomeLayout.css';

import {
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  //   COLONY_EXTENSION_DETAILS_ROUTE,
  //   COLONY_EXTENSION_SETUP_ROUTE,
  // COLONY_HOME_ROUTE,
  NOT_FOUND_ROUTE,
} from '~routes/index';

const displayName = 'common.ColonyHome';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

// type Props = RouteChildrenProps<{ colonyName: string; extensionId?: string }>;

const ColonyHome = ({ match, location }) => {
  // if (!match) {
  //   throw new Error(
  //     `No match found for route in ${displayName} Please check route setup.`,
  //   );
  // }

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

  console.log(colony);

  // const { domainFilter: queryDomainFilterId } = parseQS(location?.search) as {
  //   domainFilter: string | undefined;
  // };

  // const [domainIdFilter, setDomainIdFilter] = useState<number>(
  //   Number(queryDomainFilterId),
  // );

  // const filteredDomainId = domainIdFilter || COLONY_TOTAL_BALANCE_DOMAIN_ID;

  // const { data, error, loading } = useColonyFromNameQuery({
  //   // We have to define an empty address here for type safety, will be replaced by the query
  //   variables: { name: colonyName, address: '' },
  //   pollInterval: 5000,
  // });
  // if (error) console.error(error);

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
            path={COLONY_EVENTS_ROUTE}
            element={
              <ColonyHomeLayout
                colony={colony}
                // filteredDomainId={filteredDomainId}
                // onDomainChange={setDomainIdFilter}
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
                // filteredDomainId={filteredDomainId}
                // onDomainChange={setDomainIdFilter}
                // showControls={false}
                // showSidebar={false}
              >
                {/* <Extensions {...props} colonyAddress={colonyAddress} /> */}
                <div>Extensions</div>
              </ColonyHomeLayout>
            }
          />
          {/* <Route
            exact
            path={[
              COLONY_EXTENSION_DETAILS_ROUTE,
              COLONY_EXTENSION_SETUP_ROUTE,
            ]}
            render={(props) => (
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                showControls={false}
                showSidebar={false}
              >
                <ExtensionDetails {...props} colony={colony} />
              </ColonyHomeLayout>
            )}
          /> */}
          <Route
            path="/"
            element={
              <ColonyHomeLayout
                colony={colony}
                // filteredDomainId={filteredDomainId}
                // onDomainChange={setDomainIdFilter}
                // ethDomainId={filteredDomainId}
              >
                {/* <ColonyActions colony={colony} ethDomainId={filteredDomainId} /> */}
                <div>Actions & Motions List</div>
              </ColonyHomeLayout>
            }
          />
        </RoutesSwitch>
      );
    }
    return null;
  }, [colony]);

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
    (colony as any) instanceof Error
    // || !isExtensionIdValid
  ) {
    return <Navigate to={NOT_FOUND_ROUTE} />;
  }

  return memoizedSwitch;
  // return <div>COLONY HOME</div>;
  // return (
  //   <ColonyHomeLayout
  //     colony={colony}
  //     // filteredDomainId={0}
  //     // onDomainChange={() => {}}
  //     // ethDomainId={0}
  //   >
  //     <div>Actions & Motions List</div>
  //   </ColonyHomeLayout>
  // );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
