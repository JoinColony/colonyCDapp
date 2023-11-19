import React from 'react';
import { defineMessages } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { SelectOption } from '~v5/common/Fields/Select/types';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';

import {
  USER_ADVANCED_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_PREFERENCES_ROUTE,
} from './routeConstants';
import { formatText } from '~utils/intl';

const accountNavMsgs = defineMessages({
  profile: {
    id: 'Account.Tabs.Profile',
    defaultMessage: 'Profile',
  },
  prefences: {
    id: 'Account.Tabs.Preferences',
    defaultMessage: 'Preferences',
  },
  advanced: {
    id: 'Account.Tabs.Advanced',
    defaultMessage: 'Advanced',
  },
});

const navigationItems: SelectOption[] = [
  {
    linkTo: USER_EDIT_PROFILE_ROUTE,
    label: formatText(accountNavMsgs.profile),
    value: 0,
  },
  {
    linkTo: USER_PREFERENCES_ROUTE,
    label: formatText(accountNavMsgs.prefences),
    value: 1,
  },
  {
    linkTo: USER_ADVANCED_ROUTE,
    label: formatText(accountNavMsgs.advanced),
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
