import React from 'react';
import { Outlet } from 'react-router-dom';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';

import {
  USER_ADVANCED_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_PREFERENCES_ROUTE,
} from './routeConstants';

const navigationItems = [
  {
    id: 0,
    linkTo: USER_EDIT_PROFILE_ROUTE,
    label: 'Profile',
    value: 'profile',
  },
  {
    id: 1,
    linkTo: USER_PREFERENCES_ROUTE,
    label: 'Preferences',
    value: 'preferences',
  },
  {
    id: 2,
    linkTo: USER_ADVANCED_ROUTE,
    label: 'Advanced',
    value: 'advanced',
  },
];

const UserRoute = () => {
  return (
    <TwoColumns aside={<Navigation navigationItems={navigationItems} />}>
      <Outlet />
    </TwoColumns>
  );
};

export default UserRoute;
