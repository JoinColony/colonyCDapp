import React from 'react';
import { Outlet } from 'react-router-dom';
import { SelectOption } from '~v5/common/Fields/Select/types';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';

import {
  USER_ADVANCED_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_PREFERENCES_ROUTE,
} from './routeConstants';

const navigationItems: SelectOption[] = [
  {
    to: USER_EDIT_PROFILE_ROUTE,
    label: 'Profile',
    value: 0,
  },
  {
    to: USER_PREFERENCES_ROUTE,
    label: 'Preferences',
    value: 1,
  },
  {
    to: USER_ADVANCED_ROUTE,
    label: 'Advanced',
    value: 2,
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
