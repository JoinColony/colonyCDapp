import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';
import {
  useSetPageBreadcrumbs,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/hooks';
import { formatText } from '~utils/intl';

import { COLONY_MEMBERS_ROUTE } from './routeConstants';

const ColonyMembersRoute = () => {
  useSetPageHeadingTitle(formatText({ id: 'membersPage.title' }));
  useSetPageBreadcrumbs(
    useMemo(
      () => [
        {
          key: 'members',
          // @todo: replace with actual teams
          dropdownOptions: [
            {
              label: 'All members',
              href: COLONY_MEMBERS_ROUTE,
            },
          ],
          selectedValue: COLONY_MEMBERS_ROUTE,
        },
      ],
      [],
    ),
  );

  return (
    <MemberContextProvider>
      <Outlet />
    </MemberContextProvider>
  );
};

export default ColonyMembersRoute;
