import React from 'react';
import { Outlet } from 'react-router-dom';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

import {
  COLONY_DETAILS_ROUTE,
  COLONY_REPUTATION_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_INTEGRATIONS_ROUTE,
  COLONY_INCORPORATION_ROUTE,
  COLONY_ADVANCED_ROUTE,
} from './routeConstants';

const navigationItems = [
  {
    id: 0,
    linkTo: COLONY_DETAILS_ROUTE,
    label: 'Colony Details',
    value: 'colony-details',
  },
  {
    id: 1,
    linkTo: COLONY_REPUTATION_ROUTE,
    label: 'Reputation',
    value: 'reputation',
  },
  {
    id: 2,
    linkTo: COLONY_PERMISSIONS_ROUTE,
    label: 'Permissions',
    value: 'permissions',
  },
  {
    id: 3,
    linkTo: COLONY_EXTENSIONS_ROUTE,
    label: 'Extensions',
    value: 'extensions',
  },
  {
    id: 4,
    linkTo: COLONY_INTEGRATIONS_ROUTE,
    label: 'Integrations',
    value: 'integrations',
  },
  {
    id: 5,
    linkTo: COLONY_INCORPORATION_ROUTE,
    label: 'Incorporation',
    value: 'incorporation',
  },
  {
    id: 6,
    linkTo: COLONY_ADVANCED_ROUTE,
    label: 'Advanced',
    value: 'advanced',
  },
];

const ColonySettingsRoute = () => {
  return (
    // @TODO: this is only temporary until we have a better way to define the loading text
    <Spinner loading={false} loadingText="Loading">
      <TwoColumns aside={<Navigation navigationItems={navigationItems} />}>
        <Outlet />
      </TwoColumns>
    </Spinner>
  );
};

export default ColonySettingsRoute;
